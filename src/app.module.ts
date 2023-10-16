import { Module } from '@nestjs/common';
import { globSync } from 'glob';
import { ModelModule } from './model.module';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    ModelModule,
  ],
  controllers: [
    ...globSync(join(__dirname, './controller/**/*.controller.js')).map(
      (path) => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const module = require(path);
        return Object.values(module)[0];
      },
    ),
  ] as any[],
  providers: [
    ...globSync(join(__dirname, './service/**/*.service.js')).map((path) => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const module = require(path);
      return Object.values(module)[0];
    }),
  ] as any[],
})
export class AppModule {}
