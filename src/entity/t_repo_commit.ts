import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface TRepoCommitAttributes {
  id: number;
  commitTime: Date;
  commitHash: string;
  username: string;
  comment: string;
  repoId: number;
}

export type TRepoCommitPk = "id";
export type TRepoCommitId = TRepoCommit[TRepoCommitPk];
export type TRepoCommitOptionalAttributes = "id";
export type TRepoCommitCreationAttributes = Optional<TRepoCommitAttributes, TRepoCommitOptionalAttributes>;

export class TRepoCommit extends Model<TRepoCommitAttributes, TRepoCommitCreationAttributes> implements TRepoCommitAttributes {
  id!: number;
  commitTime!: Date;
  commitHash!: string;
  username!: string;
  comment!: string;
  repoId!: number;


  static initModel(sequelize: Sequelize.Sequelize): typeof TRepoCommit {
    return sequelize.define('TRepoCommit', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    commitTime: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'commit_time'
    },
    commitHash: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'commit_hash'
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: false
    },
    repoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'repo_id'
    }
  }, {
    tableName: 't_repo_commit',
    schema: 'public',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        name: "t_repo_commit_pk",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  }) as typeof TRepoCommit;
  }
}
