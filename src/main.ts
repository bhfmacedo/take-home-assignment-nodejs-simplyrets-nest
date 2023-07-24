import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { seedDb } from './database/database.seed';
import { getDataSourceToken } from '@nestjs/typeorm';
import { SWAGGER_STRINGS } from './constants';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(getDataSourceToken());
  await seedDb(dataSource);

  const swaggerOptions = new DocumentBuilder()
    .setTitle(SWAGGER_STRINGS.TITLE)
    .setDescription(SWAGGER_STRINGS.DESCRIPTION)
    .setVersion(SWAGGER_STRINGS.VERSION)
    .build();

  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('/', app, document);

  await app.listen(3000);
}
bootstrap();
