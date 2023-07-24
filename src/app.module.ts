import { Module } from '@nestjs/common';
import { PropertiesModule } from './properties/properties.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfiguration } from './database/database.configuration';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfiguration,
    }),
    PropertiesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
