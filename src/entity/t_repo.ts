import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface TRepoAttributes {
  id: number;
  userId: number;
  branchNum: number;
  tagNum: number;
  issueNum: number;
  pullRequestNum: number;
  name: string;
  type: number;
  description: string;
  defaultBranchName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TRepoPk = "id";
export type TRepoId = TRepo[TRepoPk];
export type TRepoOptionalAttributes = "id" | "branchNum" | "tagNum" | "issueNum" | "pullRequestNum" | "defaultBranchName" | "createdAt" | "updatedAt";
export type TRepoCreationAttributes = Optional<TRepoAttributes, TRepoOptionalAttributes>;

export class TRepo extends Model<TRepoAttributes, TRepoCreationAttributes> implements TRepoAttributes {
  id!: number;
  userId!: number;
  branchNum!: number;
  tagNum!: number;
  issueNum!: number;
  pullRequestNum!: number;
  name!: string;
  type!: number;
  description!: string;
  defaultBranchName?: string;
  createdAt!: Date;
  updatedAt!: Date;


  static initModel(sequelize: Sequelize.Sequelize): typeof TRepo {
    return sequelize.define('TRepo', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id'
    },
    branchNum: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'branch_num'
    },
    tagNum: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'tag_num'
    },
    issueNum: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'issue_num'
    },
    pullRequestNum: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'pull_request_num'
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    defaultBranchName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'default_branch_name'
    }
  }, {
    tableName: 't_repo',
    schema: 'public',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        name: "repo_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  }) as typeof TRepo;
  }
}
