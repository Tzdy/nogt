import { Module } from '@nestjs/common';
import { Sequelize } from 'sequelize';
import { globSync } from 'glob';
import { join } from 'path';
import { initModels } from './entity/init-models';
export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  username: '',
  password: '',
  database: 'postgres',
});
export const databaseProviders = [
  {
    provide: Sequelize.name,
    useFactory: async () => {
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
