import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface TUserAttributes {
  id: number;
  username: string;
  password: string;
  nickname: string;
  gitUsername: string;
  gitEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TUserPk = "id";
export type TUserId = TUser[TUserPk];
export type TUserOptionalAttributes = "id" | "gitUsername" | "gitEmail" | "createdAt" | "updatedAt";
export type TUserCreationAttributes = Optional<TUserAttributes, TUserOptionalAttributes>;

export class TUser extends Model<TUserAttributes, TUserCreationAttributes> implements TUserAttributes {
  id!: number;
  username!: string;
  password!: string;
  nickname!: string;
  gitUsername!: string;
  gitEmail!: string;
  createdAt!: Date;
  updatedAt!: Date;


  static initModel(sequelize: Sequelize.Sequelize): typeof TUser {
    return sequelize.define('TUser', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    nickname: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    gitUsername: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "",
      field: 'git_username'
    },
    gitEmail: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "",
      field: 'git_email'
    }
  }, {
    tableName: 't_user',
    schema: 'public',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        name: "t_user_nickname",
        unique: true,
        fields: [
          { name: "nickname" },
        ]
      },
      {
        name: "t_user_username",
        unique: true,
        fields: [
          { name: "username" },
        ]
      },
      {
        name: "user_nickname",
        unique: true,
        fields: [
          { name: "nickname" },
        ]
      },
      {
        name: "user_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "user_username",
        unique: true,
        fields: [
          { name: "username" },
        ]
      },
    ]
  }) as typeof TUser;
  }
}
