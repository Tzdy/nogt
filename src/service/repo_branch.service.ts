import { Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { RepoType } from 'src/enum/repoType.enum';
import { RepoMapper } from 'src/mapper/repo.mapper';
import { UserMapper } from 'src/mapper/user.mapper';
import { PageDTO } from 'src/models/dto/page.dto';
import { UserDTO } from 'src/models/dto/user.dto';
import { HttpOKException } from 'src/utils/Exception';
import { PageUtil } from 'src/utils/PageUtil';
import { BaseService } from './base.service';
import { BranchMapper } from 'src/mapper/branch.mapper';
import { GetBranchPageListVO } from 'src/models/vo/repo_branch/get_branch_page_list.vo';
import { CreateBranchVO } from 'src/models/vo/repo_branch/create_branch.vo';
import { RepoBranchLnkRepoCommitMapper } from 'src/mapper/repo_branch_lnk_repo_commit.mapper';
import { Git as GitUtil } from '@tsdy/git-util';

import { join } from 'path';

@Injectable()
export class RepoBranchService {
  constructor(
    private readonly baseService: BaseService,
    @Inject(BranchMapper.name)
    private readonly branchMapper: typeof BranchMapper,
    @Inject(RepoMapper.name) private readonly repoMapper: typeof RepoMapper,
    @Inject(UserMapper.name) private readonly userMapper: typeof UserMapper,
    @Inject(RepoBranchLnkRepoCommitMapper.name)
    private readonly repoBranchLnkRepoCommitMapper: typeof RepoBranchLnkRepoCommitMapper,
  ) {}

  public async getBranchPageList(vo: GetBranchPageListVO, user?: UserDTO) {
    const { isMySelf, repo } = await this.baseService.getRepoInfo(
      vo.username,
      vo.repoName,
      user,
    );
    if (repo.type === RepoType.PRIVATE && !isMySelf) {
      throw new HttpOKException('没有权限查看');
    }
    const { rows: repoList, count: total } =
      await this.branchMapper.findAndCountAll({
        where: {
          repoId: repo.id,
          name: {
            [Op.like]: `${vo.branchName}%`,
          },
        },
        ...PageUtil.page(vo),
      });
    return new PageDTO(repoList, total);
  }

  public async createBranch(vo: CreateBranchVO, user: UserDTO) {
    const { oldBranchId, newBranch, repoId } = vo;
    const repo = await this.repoMapper.findOne({
      where: {
        id: repoId,
      },
    });
    if (!repo) {
      throw new HttpOKException('仓库不存在');
    }
    const gitUtil = new GitUtil(
      join(process.env.GIT_ROOT, user.username),
      repo.name,
    );
    const oldBranchDTO = await this.branchMapper.findOne({
      where: {
        id: oldBranchId,
      },
    });
    if (!oldBranchDTO) {
      throw new HttpOKException('原分支不存在');
    }
    let newBranchDTO = await this.branchMapper.findOne({
      where: {
        name: newBranch,
      },
    });
    if (newBranchDTO) {
      throw new HttpOKException('分支名已存在');
    }
    newBranchDTO = await this.branchMapper.create({
      name: newBranch,
      repoId,
      commitHash: oldBranchDTO.commitHash,
      commitNum: oldBranchDTO.commitNum,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await this.repoBranchLnkRepoCommitMapper.copyBranchLnk({
      oldBranchId: oldBranchDTO.id,
      newBranchId: newBranchDTO.id,
    });
    await gitUtil.createBranch(oldBranchDTO.name, newBranchDTO.name);
  }

  // public async deleteTag() {}
}
