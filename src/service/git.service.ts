import { Inject, Injectable } from '@nestjs/common';
import { RepoMapper } from 'src/mapper/repo.mapper';
import { UserMapper } from 'src/mapper/user.mapper';
import { Git as GitUtil } from '@tsdy/git-util';
import { join } from 'path';
import { BranchMapper } from 'src/mapper/branch.mapper';
import { RepoTagMapper } from 'src/mapper/repo_tag.mapper';
import { RepoCommitMapper } from 'src/mapper/repo_commit.mapper';
import { RepoBranchLnkRepoCommitMapper } from 'src/mapper/repo_branch_lnk_repo_commit.mapper';
import * as _ from 'lodash';
import { RepoBlobMapper } from 'src/mapper/repo_blob.mapper';
import { Op } from 'sequelize';
import { RepoTagLnkRepoCommitMapper } from 'src/mapper/repo_tag_lnk_repo_commit.mapper';
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
    @Inject(RepoCommitMapper.name)
    private readonly repoCommitMapper: typeof RepoCommitMapper,
    @Inject(RepoBranchLnkRepoCommitMapper.name)
    private readonly repoBranchLnkRepoCommitMapper: typeof RepoBranchLnkRepoCommitMapper,
    @Inject(RepoBlobMapper.name)
    private readonly repoBlobMapper: typeof RepoBlobMapper,
    @Inject(RepoTagLnkRepoCommitMapper.name)
    private readonly repoTagLnkRepoCommitMapper: typeof RepoTagLnkRepoCommitMapper,
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
    console.log(repo);
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

    const commit = await this.repoCommitMapper.findOne({
      where: {
        repoId: repo.id,
        commitHash,
      },
    });

    const commitList = await this.repoCommitMapper.findAll({
      where: {
        repoId: repo.id,
        commitTime: {
          [Op.lte]: commit.commitTime,
        },
      },
    });

    let tag = this.repoTagMapper.build();
    tag.repoId = repo.id;
    tag.name = version;
    tag.commitHash = commitHash;
    tag.createdAt = new Date();
    tag.updatedAt = new Date();
    tag.commitNum = commitList.length;
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

    await this.repoTagLnkRepoCommitMapper.bulkCreate(
      commitList.map((item) => ({
        repoTagId: tag.id,
        repoCommitId: item.id,
      })),
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
    const repoCommitHashSet = new Set(
      (
        await this.repoCommitMapper.findAll({
          attributes: ['commitHash'],
          where: {
            repoId: repo.id,
          },
        })
      ).map((item) => item.commitHash),
    );

    // 从git文件中取出提交后所有commit hash
    const gitCommitHashList = await gitUtil.findAllCommitHash(branch);
    console.log(
      'git',
      gitCommitHashList.find(
        (item) => item === 'a6e8fa55f98a434627d4294ff400af17d5a4a25f',
      ),
    );
    const newCommitHashList = gitCommitHashList.filter(
      (hash) => !repoCommitHashSet.has(hash),
    );
    console.log(
      'new',
      newCommitHashList.find(
        (item) => item === 'a6e8fa55f98a434627d4294ff400af17d5a4a25f',
      ),
    );
    // 需要插入数据库的diffcommit
    const commitList = await gitUtil.findCommit(
      branch,
      null,
      null,
      newCommitHashList,
    );
    console.log(
      'commitList',
      commitList.find(
        (item) =>
          item.commitHash === 'a6e8fa55f98a434627d4294ff400af17d5a4a25f',
      ),
    );
    console.log(commitList.length);

    const diffBlobItem = await gitUtil.findDiffItem(newCommitHashList);
    // console.log(diffBlobItem);

    await this.repoCommitMapper.bulkCreate(
      commitList.map((item) => ({
        repoId: repo.id,
        username: item.username,
        comment: item.comment,
        commitHash: item.commitHash,
        commitTime: item.time,
      })),
    );

    const allCommitList = await this.repoCommitMapper.findAll({
      attributes: ['id', 'commitHash'],
      where: {
        repoId: repo.id,
      },
    });
    const allCommitListMap = _.keyBy(allCommitList, 'commitHash');
    console.log('----');
    diffBlobItem.forEach((item) => {
      if (!allCommitListMap[item.commitHash]) {
        console.log(item.commitHash);
      }
    });
    await this.repoBlobMapper.bulkCreate(
      diffBlobItem.map((item) => {
        return {
          path: item.path,
          commitId: allCommitListMap[item.commitHash].id,
          blobHash: item.hash,
        };
      }),
    );

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
    branchDTO.commitNum = gitCommitHashList.length;
    branchDTO = await branchDTO.save();

    await repo.save();

    // 数据库中该分支对应的commit_hash
    const branchCommitList =
      await this.repoCommitMapper.getCommitByBranchAndRepo({
        repoId: repo.id,
        branchId: branchDTO.id,
      });
    const branchCommitListSet = new Set(
      branchCommitList.map((item) => item.commitHash),
    );
    const lnkRepoCommitHashList = gitCommitHashList.filter(
      (hash) => !branchCommitListSet.has(hash),
    );
    // console.log('________________');
    lnkRepoCommitHashList.forEach((hash) => {
      if (!allCommitListMap[hash]) {
        console.log(hash);
      }
    });

    await this.repoBranchLnkRepoCommitMapper.bulkCreate(
      lnkRepoCommitHashList.map((hash) => ({
        repoBranchId: branchDTO.id,
        repoCommitId: allCommitListMap[hash].id,
      })),
    );
  }
}
