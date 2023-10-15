import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface TBranchAttributes {
  id: number;
  repoId: number;
  name: string;
  commitHash: string;
  createdAt: Date;
  updatedAt: Date;
  commitNum: number;
}

export type TBranchPk = "id";
export type TBranchId = TBranch[TBranchPk];
export type TBranchOptionalAttributes = "id" | "createdAt" | "updatedAt" | "commitNum";
export type TBranchCreationAttributes = Optional<TBranchAttributes, TBranchOptionalAttributes>;

export class TBranch extends Model<TBranchAttributes, TBranchCreationAttributes> implements TBranchAttributes {
  id!: number;
  repoId!: number;
  name!: string;
  commitHash!: string;
  createdAt!: Date;
  updatedAt!: Date;
  commitNum!: number;


  static initModel(sequelize: Sequelize.Sequelize): typeof TBranch {
    return sequelize.define('TBranch', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    repoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'repo_id'
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    commitHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'commit_hash'
    },
    commitNum: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'commit_num'
    }
  }, {
    tableName: 't_branch',
    schema: 'public',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        name: "t_branch_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  }) as typeof TBranch;
  }
}
