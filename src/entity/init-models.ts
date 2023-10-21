import type { Sequelize } from "sequelize";
import { TBranch as _TBranch } from "./t_branch";
import type { TBranchAttributes, TBranchCreationAttributes } from "./t_branch";
import { TRepo as _TRepo } from "./t_repo";
import type { TRepoAttributes, TRepoCreationAttributes } from "./t_repo";
import { TRepoTag as _TRepoTag } from "./t_repo_tag";
import type { TRepoTagAttributes, TRepoTagCreationAttributes } from "./t_repo_tag";
import { TUser as _TUser } from "./t_user";
import type { TUserAttributes, TUserCreationAttributes } from "./t_user";

export {
  _TBranch as TBranch,
  _TRepo as TRepo,
  _TRepoTag as TRepoTag,
  _TUser as TUser,
};

export type {
  TBranchAttributes,
  TBranchCreationAttributes,
  TRepoAttributes,
  TRepoCreationAttributes,
  TRepoTagAttributes,
  TRepoTagCreationAttributes,
  TUserAttributes,
  TUserCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const TBranch = _TBranch.initModel(sequelize);
  const TRepo = _TRepo.initModel(sequelize);
  const TRepoTag = _TRepoTag.initModel(sequelize);
  const TUser = _TUser.initModel(sequelize);


  return {
    TBranch: TBranch,
    TRepo: TRepo,
    TRepoTag: TRepoTag,
    TUser: TUser,
  };
}
