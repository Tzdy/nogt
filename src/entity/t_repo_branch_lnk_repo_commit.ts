import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface TRepoBranchLnkRepoCommitAttributes {
  repoBranchId: number;
  repoCommitId: number;
}

export type TRepoBranchLnkRepoCommitPk = "repoBranchId" | "repoCommitId";
export type TRepoBranchLnkRepoCommitId = TRepoBranchLnkRepoCommit[TRepoBranchLnkRepoCommitPk];
export type TRepoBranchLnkRepoCommitCreationAttributes = TRepoBranchLnkRepoCommitAttributes;

export class TRepoBranchLnkRepoCommit extends Model<TRepoBranchLnkRepoCommitAttributes, TRepoBranchLnkRepoCommitCreationAttributes> implements TRepoBranchLnkRepoCommitAttributes {
  repoBranchId!: number;
  repoCommitId!: number;


  static initModel(sequelize: Sequelize.Sequelize): typeof TRepoBranchLnkRepoCommit {
    return sequelize.define('TRepoBranchLnkRepoCommit', {
    repoBranchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'repo_branch_id'
    },
    repoCommitId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'repo_commit_id'
    }
  }, {
    tableName: 't_repo_branch_lnk_repo_commit',
    schema: 'public',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        name: "t_repo_branch_lnk_repo_commit_pk",
        unique: true,
        fields: [
          { name: "repo_branch_id" },
          { name: "repo_commit_id" },
        ]
      },
    ]
  }) as typeof TRepoBranchLnkRepoCommit;
  }
}
