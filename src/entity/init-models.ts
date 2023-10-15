import type { Sequelize } from "sequelize";
import { TBranch as _TBranch } from "./t_branch";
import type { TBranchAttributes, TBranchCreationAttributes } from "./t_branch";
import { TRepo as _TRepo } from "./t_repo";
import type { TRepoAttributes, TRepoCreationAttributes } from "./t_repo";
import { TRepoBlob as _TRepoBlob } from "./t_repo_blob";
import type { TRepoBlobAttributes, TRepoBlobCreationAttributes } from "./t_repo_blob";
import { TRepoBranchLnkRepoCommit as _TRepoBranchLnkRepoCommit } from "./t_repo_branch_lnk_repo_commit";
import type { TRepoBranchLnkRepoCommitAttributes, TRepoBranchLnkRepoCommitCreationAttributes } from "./t_repo_branch_lnk_repo_commit";
import { TRepoCommit as _TRepoCommit } from "./t_repo_commit";
import type { TRepoCommitAttributes, TRepoCommitCreationAttributes } from "./t_repo_commit";
import { TRepoTag as _TRepoTag } from "./t_repo_tag";
import type { TRepoTagAttributes, TRepoTagCreationAttributes } from "./t_repo_tag";
import { TRepoTagLnkRepoCommit as _TRepoTagLnkRepoCommit } from "./t_repo_tag_lnk_repo_commit";
import type { TRepoTagLnkRepoCommitAttributes, TRepoTagLnkRepoCommitCreationAttributes } from "./t_repo_tag_lnk_repo_commit";
import { TUser as _TUser } from "./t_user";
import type { TUserAttributes, TUserCreationAttributes } from "./t_user";

export {
  _TBranch as TBranch,
  _TRepo as TRepo,
  _TRepoBlob as TRepoBlob,
  _TRepoBranchLnkRepoCommit as TRepoBranchLnkRepoCommit,
  _TRepoCommit as TRepoCommit,
  _TRepoTag as TRepoTag,
  _TRepoTagLnkRepoCommit as TRepoTagLnkRepoCommit,
  _TUser as TUser,
};

export type {
  TBranchAttributes,
  TBranchCreationAttributes,
  TRepoAttributes,
  TRepoCreationAttributes,
  TRepoBlobAttributes,
  TRepoBlobCreationAttributes,
  TRepoBranchLnkRepoCommitAttributes,
  TRepoBranchLnkRepoCommitCreationAttributes,
  TRepoCommitAttributes,
  TRepoCommitCreationAttributes,
  TRepoTagAttributes,
  TRepoTagCreationAttributes,
  TRepoTagLnkRepoCommitAttributes,
  TRepoTagLnkRepoCommitCreationAttributes,
  TUserAttributes,
  TUserCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const TBranch = _TBranch.initModel(sequelize);
  const TRepo = _TRepo.initModel(sequelize);
  const TRepoBlob = _TRepoBlob.initModel(sequelize);
  const TRepoBranchLnkRepoCommit = _TRepoBranchLnkRepoCommit.initModel(sequelize);
  const TRepoCommit = _TRepoCommit.initModel(sequelize);
  const TRepoTag = _TRepoTag.initModel(sequelize);
  const TRepoTagLnkRepoCommit = _TRepoTagLnkRepoCommit.initModel(sequelize);
  const TUser = _TUser.initModel(sequelize);


  return {
    TBranch: TBranch,
    TRepo: TRepo,
    TRepoBlob: TRepoBlob,
    TRepoBranchLnkRepoCommit: TRepoBranchLnkRepoCommit,
    TRepoCommit: TRepoCommit,
    TRepoTag: TRepoTag,
    TRepoTagLnkRepoCommit: TRepoTagLnkRepoCommit,
    TUser: TUser,
  };
}
