import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface TRepoTagAttributes {
  id: number;
  repoId: number;
  name: string;
  commitHash: string;
  createdAt: Date;
  updatedAt: Date;
  commitNum: number;
}

export type TRepoTagPk = "id";
export type TRepoTagId = TRepoTag[TRepoTagPk];
export type TRepoTagOptionalAttributes = "id" | "createdAt" | "updatedAt" | "commitNum";
export type TRepoTagCreationAttributes = Optional<TRepoTagAttributes, TRepoTagOptionalAttributes>;

export class TRepoTag extends Model<TRepoTagAttributes, TRepoTagCreationAttributes> implements TRepoTagAttributes {
  id!: number;
  repoId!: number;
  name!: string;
  commitHash!: string;
  createdAt!: Date;
  updatedAt!: Date;
  commitNum!: number;


  static initModel(sequelize: Sequelize.Sequelize): typeof TRepoTag {
    return sequelize.define('TRepoTag', {
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
    tableName: 't_repo_tag',
    schema: 'public',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        name: "t_tag_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  }) as typeof TRepoTag;
  }
}
