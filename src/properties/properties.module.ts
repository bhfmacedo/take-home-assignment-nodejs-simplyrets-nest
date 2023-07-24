import { Module } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { Property } from './entity/property.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { providePropertyRepository } from './repository/property.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Property])],
  controllers: [PropertiesController],
  providers: [PropertiesService, providePropertyRepository()],
})
export class PropertiesModule {}
