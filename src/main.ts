import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './filter/global.filter';
import { GetRepoPageListDTO } from './models/dto/repo/getRepoPageList.dto';
import { PageDTO } from './models/dto/page.dto';
import { GetTagPageListDTO } from './models/dto/tag/getTagPageList.dto';
import * as _ from 'lodash';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalFilters(new AllExceptionsFilter());
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [PageDTO, GetRepoPageListDTO, GetTagPageListDTO],
  });
  SwaggerModule.setup('api', app, document);
  await app.listen(3001);
}
bootstrap();
