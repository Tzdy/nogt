import { Module } from '@nestjs/common';
import { Sequelize } from 'sequelize';
import { globSync } from 'glob';
import { join } from 'path';
import { initModels } from './entity/init-models';
console.log(process.env.PG_DATABASE);
export let sequelize;
export const databaseProviders = [
  {
    provide: Sequelize.name,
    useFactory: async () => {
      sequelize = new Sequelize({
        dialect: 'postgres',
        host: process.env.PG_HOST,
        port: Number(process.env.PG_PORT),
        username: process.env.PG_USER,
        password: process.env.PG_PASS,
        database: process.env.PG_DATABASE,
      });
      initModels(sequelize);
      // await sequelize.sync();
      return sequelize;
    },
  },
  ...globSync(join(__dirname, './mapper/**/*.js')).map((path) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const module = require(path);

    return {
      provide: Object.values(module)[0]['name'] as string,
      useFactory: () => {
        const originMapper = Object.values(module)[0] as any;
        const mapper = Object.values(module)[0]['initModel'](sequelize) as any;
        Reflect.ownKeys(originMapper).forEach((key) => {
          console.log(key);
          if (!['length', 'name', 'prototype'].includes(String(key))) {
            mapper[key] = originMapper[key];
          }
        });
        return mapper;
      },
    };
  }),
];

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class ModelModule {}
