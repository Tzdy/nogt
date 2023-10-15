import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface TRepoBlobAttributes {
  commitId: number;
  path: string;
  blobHash: string;
}

export type TRepoBlobPk = "commitId" | "path" | "blobHash";
export type TRepoBlobId = TRepoBlob[TRepoBlobPk];
export type TRepoBlobCreationAttributes = TRepoBlobAttributes;

export class TRepoBlob extends Model<TRepoBlobAttributes, TRepoBlobCreationAttributes> implements TRepoBlobAttributes {
  commitId!: number;
  path!: string;
  blobHash!: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof TRepoBlob {
    return sequelize.define('TRepoBlob', {
    commitId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'commit_id'
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    blobHash: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      field: 'blob_hash'
    }
  }, {
    tableName: 't_repo_blob',
    schema: 'public',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        name: "t_repo_blob_pk",
        unique: true,
        fields: [
          { name: "commit_id" },
          { name: "path" },
          { name: "blob_hash" },
        ]
      },
    ]
  }) as typeof TRepoBlob;
  }
}
