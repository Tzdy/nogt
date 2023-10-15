import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface TRepoTagLnkRepoCommitAttributes {
  repoTagId: number;
  repoCommitId: number;
}

export type TRepoTagLnkRepoCommitPk = "repoTagId" | "repoCommitId";
export type TRepoTagLnkRepoCommitId = TRepoTagLnkRepoCommit[TRepoTagLnkRepoCommitPk];
export type TRepoTagLnkRepoCommitCreationAttributes = TRepoTagLnkRepoCommitAttributes;

export class TRepoTagLnkRepoCommit extends Model<TRepoTagLnkRepoCommitAttributes, TRepoTagLnkRepoCommitCreationAttributes> implements TRepoTagLnkRepoCommitAttributes {
  repoTagId!: number;
  repoCommitId!: number;


  static initModel(sequelize: Sequelize.Sequelize): typeof TRepoTagLnkRepoCommit {
    return sequelize.define('TRepoTagLnkRepoCommit', {
    repoTagId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'repo_tag_id'
    },
    repoCommitId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'repo_commit_id'
    }
  }, {
    tableName: 't_repo_tag_lnk_repo_commit',
    schema: 'public',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        name: "t_repo_tag_lnk_repo_commit_pk",
        unique: true,
        fields: [
          { name: "repo_tag_id" },
          { name: "repo_commit_id" },
        ]
      },
    ]
  }) as typeof TRepoTagLnkRepoCommit;
  }
}
