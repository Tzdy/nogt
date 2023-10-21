import { Inject, Injectable } from '@nestjs/common';
import { RepoMapper } from 'src/mapper/repo.mapper';
import { UserMapper } from 'src/mapper/user.mapper';
import { Git as GitUtil } from '@tsdy/git-util';
import { join } from 'path';
import { BranchMapper } from 'src/mapper/branch.mapper';
import { RepoTagMapper } from 'src/mapper/repo_tag.mapper';
import * as _ from 'lodash';
import { Op } from 'sequelize';
import sequelize from 'sequelize';

@Injectable()
export class GitService {
  constructor(
    @Inject(UserMapper.name) private readonly userMapper: typeof UserMapper,
    @Inject(RepoMapper.name) private readonly repoMapper: typeof RepoMapper,
    @Inject(BranchMapper.name)
    private readonly branchMapper: typeof BranchMapper,
    @Inject(RepoTagMapper.name)
    private readonly repoTagMapper: typeof RepoTagMapper,
  ) {}

  public async prePush(username: string, repoName: string) {
    const user = await this.userMapper.findOne({
      where: {
        username,
      },
    });
    const repo = await this.repoMapper.findOne({
      where: {
        userId: user.id,
        name: repoName,
      },
    });
    if (!repo) {
      throw new Error('repo is not exist');
    }
  }

  public async afterPushTag(
    username: string,
    repoName: string,
    version: string,
    commitHash: string,
  ) {
    const user = await this.userMapper.findOne({
      where: {
        username,
      },
    });
    const repo = await this.repoMapper.findOne({
      where: {
        userId: user.id,
        name: repoName,
      },
    });
    const gitUtil = new GitUtil(join(process.env.GIT_ROOT, username), repoName);

    let tag = this.repoTagMapper.build();
    tag.repoId = repo.id;
    tag.name = version;
    tag.commitHash = commitHash;
    tag.createdAt = new Date();
    tag.updatedAt = new Date();
    tag.commitNum = await gitUtil.commitCount(version);
    tag = await tag.save();

    await this.repoMapper.update(
      {
        tagNum: sequelize.literal('tag_num + 1'),
        updatedAt: new Date(),
      },
      {
        where: {
          id: repo.id,
        },
      },
    );
  }

  public async afterPush(
    username: string,
    repoName: string,
    branch: string,
    commitHash: string,
  ) {
    const user = await this.userMapper.findOne({
      where: {
        username,
      },
    });
    const repo = await this.repoMapper.findOne({
      where: {
        userId: user.id,
        name: repoName,
      },
    });
    repo.updatedAt = new Date();
    const gitUtil = new GitUtil(join(process.env.GIT_ROOT, username), repoName);

    // 没有默认分支，第一次提交就为默认分支
    if (!repo.defaultBranchName) {
      repo.defaultBranchName = branch;
      await gitUtil.updateHead(branch);
    }
    // gitUtil.
    let branchDTO = await this.branchMapper.findOne({
      where: {
        repoId: repo.id,
        name: branch,
      },
    });
    if (!branchDTO) {
      branchDTO = this.branchMapper.build();
      branchDTO.repoId = repo.id;
      branchDTO.name = branch;
      branchDTO.commitHash = commitHash;
      branchDTO.createdAt = new Date();
      branchDTO.updatedAt = new Date();

      repo.branchNum++;
    } else {
      branchDTO.commitHash = commitHash;
      branchDTO.updatedAt = new Date();
    }
    branchDTO.commitNum = await gitUtil.commitCount(branch);
    await branchDTO.save();
    await repo.save();
  }
}
