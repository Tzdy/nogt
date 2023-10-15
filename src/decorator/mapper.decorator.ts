import { join, resolve } from 'path';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mybatisMapper = require('mybatis-mapper');
import * as fs from 'fs';
import { globSync } from 'glob';
import { Model, Sequelize } from 'sequelize';
import { pageHelper } from 'src/utils/PageUtil';
import { sequelize } from 'src/model.module';
const camelizeRE = /_(\w)/g;
export const camelize = (str: string): string => {
  return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''));
};
const hyphenateRE = /\B([A-Z])/g;
export const hyphenate = (str: string): string => {
  return str.replace(hyphenateRE, '_$1').toLowerCase();
};

mybatisMapper.createMapper(
  globSync(join(__dirname, '../', 'resource', 'mapper/**/*.xml')),
);

export function Mapper(constructor: { new () }) {
  const name = constructor.name;

  Reflect.ownKeys(constructor).forEach((key) => {
    if (typeof key === 'symbol') {
      return;
    }
    if (!['length', 'name', 'prototype'].includes(key)) {
      if (constructor[key]['symbol'] === 'custom') {
        return;
      }
      constructor[key] = async function (vo: Record<string, any>) {
        return (
          await this['sequelize']['query'](
            mybatisMapper.getStatement(name, key, vo),
          )
        )[0];
      };
    }
  });
}

export function Select(model?: { new (...argvs: any[]) }) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const mapperName = target['name'];
    const fun = async function (vo: Record<string, any>) {
      const page = pageHelper.page;
      pageHelper.page = null;
      let sql = mybatisMapper.getStatement(mapperName, propertyKey, vo, {
        language: 'postgresql',
        indent: '  ',
      });
      const countSql = `select count(t.*) as count from (${sql}) t`;
      if (page) {
        sql = `select t.* from (${sql}) t offset ${page.page} limit ${page.pageSize}`;
      }

      if (model) {
        console.log(Reflect.getPrototypeOf(model) === Model);
        if (Reflect.getPrototypeOf(model) === Model) {
          if (page) {
            const [a, b] = await Promise.all([
              this['sequelize']['query'](countSql, { raw: true }),
              this['sequelize']['query'](sql, {
                model: model,
                mapToModel: true,
              }),
            ]);
            page.total = Number(a[0][0].count);
            return b;
          } else {
            const result = await this['sequelize']['query'](sql, {
              model: sequelize.models[model.name],
              mapToModel: true,
              // raw: false,
            });
            return result;
          }
        } else {
          if (page) {
            const [a, b] = await Promise.all([
              this['sequelize']['query'](countSql, {
                raw: true,
              }),
              this['sequelize']['query'](sql, {
                raw: true,
              }),
            ]);
            page.total = Number(a[0][0].count);
            return b[0].map((it) => {
              const obj = new model();
              Object.keys(obj).forEach((k) => {
                obj[k] = it[hyphenate(k)];
              });
              return obj;
            });
          } else {
            return <any>(
              await this['sequelize']['query'](sql, {
                raw: true,
              })
            )[0].map((it) => {
              const obj = new model();
              Object.keys(obj).forEach((k) => {
                obj[k] = it[hyphenate(k)];
              });
              return obj;
            });
          }
        }
      } else {
        return (await this['sequelize']['query'](sql))[0];
      }
    };
    fun['symbol'] = 'custom';
    descriptor.value = fun;
  };
}
