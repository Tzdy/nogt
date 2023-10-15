import { Inject, Injectable } from '@nestjs/common';
import { RepoMapper } from 'src/mapper/repo.mapper';
import { PageDTO } from 'src/models/dto/page.dto';
import { CreateRepoVO } from 'src/models/vo/repo/createRepo.vo';
import { GetRepoPageListVO } from 'src/models/vo/repo/getRepoPageList.vo';
import { HttpOKException } from 'src/utils/Exception';
import { PagePlugin, PageUtil } from 'src/utils/PageUtil';
import { Git as GitUtil } from '@tsdy/git-util';
import { UserDTO } from 'src/models/dto/user.dto';
import { UserMapper } from 'src/mapper/user.mapper';
import { RepoType } from 'src/enum/repoType.enum';
import { Sequelize } from 'sequelize-typescript';
import { join } from 'path';
import { mkdir, rename, rm, stat } from 'fs/promises';
import { SetRepoInfoVO } from 'src/models/vo/repo/setRepoInfo.vo';
import { GetRecommendRepoPageListVO } from 'src/models/vo/repo/getRecommendRepoPageList.vo';
import { GetRepoOneVO } from 'src/models/vo/repo/getRepoOne.vo';
import { BranchMapper } from 'src/mapper/branch.mapper';
import { GetRepoCommitPageListVO } from 'src/models/vo/repo/getRepoCommitPageList.vo';
import { BaseService } from './base.service';
import * as _ from 'lodash';
import { RepoCommitMapper } from 'src/mapper/repo_commit.mapper';
import { GetLsTreeVO } from 'src/models/vo/repo/get_ls_tree.vo';
import { RepoBlobMapper } from 'src/mapper/repo_blob.mapper';
import { GetTreeCommitListVO } from 'src/models/vo/repo/get_tree_commit_list.vo';
import { GetLsTreeDTO } from 'src/models/dto/repo/get_ls_tree.dto';
import { GetCatFileVO } from 'src/models/vo/repo/get_cat_file.vo';
import { GetCatFileDTO } from 'src/models/dto/repo/get_cat_file.dto';
import { GetLatestCommitByPathVO } from 'src/models/vo/repo/get_latest_commit_by_path.vo';
import { GetLatestCommitByPathDTO } from 'src/models/dto/repo/get_latest_commit_by_path.dto';
import { RefType } from 'src/enum/ref_type.enum';
import { GetRepoOneDTO } from 'src/models/dto/repo/get_repo_one.dto';
import { RepoTagMapper } from 'src/mapper/repo_tag.mapper';
import { Op } from 'sequelize';

@Injectable()
export class RepoService {
  constructor(
    private readonly baseService: BaseService,
    @Inject(RepoMapper.name) private readonly repoMapper: typeof RepoMapper,
    @Inject(UserMapper.name) private readonly userMapper: typeof UserMapper,
    @Inject(BranchMapper.name)
    private readonly branchMapper: typeof BranchMapper,
    @Inject(RepoCommitMapper.name)
    private readonly repoCommitMapper: typeof RepoCommitMapper,
    @Inject(RepoBlobMapper.name)
    private readonly repoBlobMapper: typeof RepoBlobMapper,
    @Inject(RepoTagMapper.name)
    private readonly repoTagMapper: typeof RepoTagMapper,
    @Inject(Sequelize.name) private sequelize: Sequelize,
  ) {}

  public async createRepo(vo: CreateRepoVO, user: UserDTO) {
    await this.sequelize.transaction(async (transaction) => {
      const repo = await this.repoMapper.findOne({
        where: {
          userId: user.id,
          name: vo.repoName,
        },
        transaction,
      });
      if (repo) {
        throw new HttpOKException('仓库已存在');
      }
      const dto = this.repoMapper.build();
      dto.userId = user.id;
      dto.name = vo.repoName;
      dto.type = vo.type;
      dto.description = vo.description;
      dto.createdAt = new Date();
      dto.updatedAt = new Date();
      await dto.save({
        transaction,
      });
      try {
        await stat(
          join('/Users/mac/Documents/web/server/gogs/nest/repo', user.username),
        );
      } catch (err) {
        await mkdir(
          join('/Users/mac/Documents/web/server/gogs/nest/repo', user.username),
        );
      }
      const gitUtil = new GitUtil(
        join('/Users/mac/Documents/web/server/gogs/nest/repo', user.username),
        dto.name,
      );
      await gitUtil.createDirAndInitBare();
    });
  }

  public async setRepoInfo(vo: SetRepoInfoVO, user: UserDTO) {
    const repo = await this.repoMapper.findOne({
      where: {
        id: vo.repoId,
      },
    });
    if (!repo) {
      throw new HttpOKException('仓库不存在');
    }
    if (repo.userId !== user.id) {
      throw new HttpOKException('不能修改其他用户仓库信息');
    }
    let isUpdate = false;
    if (vo.repoName !== undefined) {
      await rename(
        join(
          '/Users/mac/Documents/web/server/gogs/nest/repo',
          user.username,
          `${repo.name}.git`,
        ),
        join(
          '/Users/mac/Documents/web/server/gogs/nest/repo',
          user.username,
          `${vo.repoName}.git`,
        ),
      );
      repo.name = vo.repoName;
      isUpdate = true;
    }
    if (vo.description !== undefined) {
      repo.description = vo.description;
      isUpdate = true;
    }
    if (
      vo.type !== undefined &&
      [RepoType.PRIVATE, RepoType.PUBLIC].includes(vo.type)
    ) {
      repo.type = vo.type;
      isUpdate = true;
    }
    if (isUpdate) {
      repo.updatedAt = new Date();
      await repo.save();
    }
  }

  public async deleteRepo(repoId: number, user: UserDTO) {
    const repo = await this.repoMapper.findOne({
      where: {
        id: repoId,
      },
    });
    if (!repo) {
      throw new HttpOKException('仓库不存在');
    }
    if (repo.userId !== user.id) {
      throw new HttpOKException('不能修改其他用户仓库信息');
    }
    await rm(
      join(
        '/Users/mac/Documents/web/server/gogs/nest/repo',
        user.username,
        `${repo.name}.git`,
      ),
    );
    await repo.destroy();
  }

  public async getRepoPageList(vo: GetRepoPageListVO, user?: UserDTO) {
    const targetUser = await this.userMapper.findOne({
      where: {
        username: vo.username,
      },
    });
    if (!targetUser) {
      throw new HttpOKException('该用户不存在', 20002);
    }
    vo.userId = targetUser.id;
    if (!user || user.id !== targetUser.id) {
      vo.type = RepoType.PUBLIC;
    }
    const pagePlugin: PagePlugin = PageUtil.pagePlugin(vo);
    const repoList = await this.repoMapper.getRepoPageList(vo);
    return new PageDTO(repoList, pagePlugin.total);
  }

  public async getRecommendRepoPageList(vo: GetRecommendRepoPageListVO) {
    const pagePlugin: PagePlugin = PageUtil.pagePlugin(vo);
    const repoList = await this.repoMapper.getRecommendRepoPageList(vo);
    return new PageDTO(repoList, pagePlugin.total);
  }

  public async getRepoOne(vo: GetRepoOneVO) {
    const username = vo.username;
    const repoName = vo.repoName;
    let branch = vo.branch;
    const refType = vo.refType ? vo.refType : RefType.BRANCH;

    const targetUser = await this.userMapper.findOne({
      where: {
        username,
      },
    });
    if (!targetUser) {
      throw new HttpOKException('用户不存在');
    }
    const repo = await this.repoMapper.findOne({
      where: {
        userId: targetUser.id,
        name: repoName,
      },
    });
    const result = new GetRepoOneDTO();
    Object.assign(result, repo.dataValues);
    if (!repo) {
      throw new HttpOKException('仓库不存在');
    }

    if (refType === RefType.BRANCH) {
      if (!branch) {
        branch = repo.defaultBranchName;
      }
      if (!branch) {
        throw new HttpOKException('仓库无默认分支');
      }
      const branchDTO = await this.branchMapper.findOne({
        where: {
          repoId: repo.id,
          name: branch,
        },
      });
      if (!branchDTO) {
        throw new HttpOKException('分支不存在');
      }
      result.commitNum = branchDTO.commitNum;
    } else if (refType === RefType.TAG) {
      if (!branch) {
        throw new HttpOKException('标签名不能为空');
      }
      const repoTagDTO = await this.repoTagMapper.findOne({
        where: {
          repoId: repo.id,
          name: branch,
        },
      });
      if (!repoTagDTO) {
        throw new HttpOKException('标签不存在');
      }
      result.commitNum = repoTagDTO.commitNum;
    } else {
      // commitHash
      if (!branch) {
        throw new HttpOKException('commit hash 不能为空');
      }
      const commit = await this.repoCommitMapper.findOne({
        where: {
          repoId: repo.id,
          commitHash: branch,
        },
      });
      const count = await this.repoCommitMapper.count({
        where: {
          repoId: repo.id,
          commitTime: {
            [Op.lte]: commit.commitTime,
          },
        },
      });
      result.commitNum = count;
    }

    return result;
  }

  public async getRepoCommitPageList(
    vo: GetRepoCommitPageListVO,
    user?: UserDTO,
  ) {
    const { repo } = await this.baseService.getRepoInfo(
      vo.username,
      vo.repoName,
      user,
    );
    vo.branch = vo.branch ? vo.branch : repo.defaultBranchName;
    const pagePlugin: PagePlugin = PageUtil.pagePlugin(vo);
    const result = await this.repoCommitMapper.getRepoCommitPageList(vo);
    return new PageDTO(result, pagePlugin.total);
  }

  public async getLsTree(vo: GetLsTreeVO, user?: UserDTO) {
    const { repo } = await this.baseService.getRepoInfo(
      vo.username,
      vo.repoName,
      user,
    );
    const gitUtil = new GitUtil(
      join(process.env.GIT_ROOT, vo.username),
      vo.repoName,
    );

    const branch = vo.branch ? vo.branch : repo.defaultBranchName;
    const branchDTO = await this.branchMapper.findOne({
      where: {
        repoId: repo.id,
        name: branch,
      },
    });
    if (!branchDTO) {
      throw new HttpOKException('分支不存在');
    }
    const treeList = await gitUtil.lsTree(branch, vo.path);
    const getTreeCommitListVO: GetTreeCommitListVO = {
      list: treeList.map((item) => ({
        blobHash: item.hash,
        path: item.path,
      })),
      repoId: repo.id,
      branchId: branchDTO.id,
    };
    const treeCommitList = await this.repoBlobMapper.getTreeCommitList(
      getTreeCommitListVO,
    );
    const treeCommitListMap = _.keyBy(treeCommitList, 'path');
    const result: GetLsTreeDTO[] = [];
    treeList.forEach((tree) => {
      const item = treeCommitListMap[tree.path];
      const dto = new GetLsTreeDTO();
      dto.commitContent = item.comment;
      dto.commitHash = item.commitHash;
      dto.commitTime = item.commitTime;
      dto.commitUser = item.username;
      dto.hash = tree.hash;
      dto.name = tree.name;
      dto.path = tree.path;
      dto.type = tree.type;
      result.push(dto);
    });
    result.sort((a, b) => {
      if (b.type === 'blob' && a.type === 'tree') {
        return -1;
      } else {
        return a.name.localeCompare(b.name);
      }
    });
    return result;
  }

  public async getCatFile(
    vo: GetCatFileVO,
    user?: UserDTO,
  ): Promise<GetCatFileDTO> {
    const { repo } = await this.baseService.getRepoInfo(
      vo.username,
      vo.repoName,
      user,
    );
    const gitUtil = new GitUtil(
      join(process.env.GIT_ROOT, vo.username),
      vo.repoName,
    );
    const branch = vo.branch ? vo.branch : repo.defaultBranchName;
    const { size, value } = await gitUtil.catFile(branch, vo.path);
    const dto = new GetCatFileDTO();
    dto.text = value;
    dto.size = size;
    return dto;
  }

  public async getLatestCommitByPath(
    vo: GetLatestCommitByPathVO,
    user?: UserDTO,
  ) {
    const { repo } = await this.baseService.getRepoInfo(
      vo.username,
      vo.repoName,
      user,
    );
    if (!vo.branch) {
      vo.branch = repo.defaultBranchName;
    }
    let dto: GetLatestCommitByPathDTO = null;
    if (!vo.path) {
      const gVO: GetRepoCommitPageListVO = {
        ...vo,
        page: 1,
        pageSize: 1,
      };
      const commitList = await this.repoCommitMapper.getRepoCommitPageList(gVO);
      dto = commitList[0];
    } else if (vo.path && vo.branch) {
      const commitList = await this.repoMapper.getLatestCommit({
        username: vo.username,
        repoName: vo.repoName,
        branch: vo.branch,
        path: vo.path,
      });
      const commitUser = await this.userMapper.findOne({
        where: { username: commitList[0].username },
      });
      dto = {
        isUser: !!commitUser,
        ...commitList[0].dataValues,
      };
    } else {
      throw new HttpOKException('参数不全');
    }
    return dto;
  }
}
