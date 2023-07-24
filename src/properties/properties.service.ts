import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Property } from './entity/property.entity';
import {
  PaginatedEntity,
  PaginationOptionsDto,
} from 'src/utils/pagination/pagination.dto';
import { PropertyFiltersDto } from './dto/property-filters.dto';
import { IPropertyRepository } from './repository/property.repository';
import { PropertySortDto } from './dto/sort-property.dto';
import { PROPERTY_RESPONSE_TEXT } from '../constants';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: IPropertyRepository,
  ) {}
  create(createPropertyDto: CreatePropertyDto): Promise<Property> {
    const property = this.propertyRepository.create(createPropertyDto);
    return this.propertyRepository.save(property);
  }

  findAll(
    filters: PropertyFiltersDto,
    orderBy: PropertySortDto,
    paginationOptions: PaginationOptionsDto,
  ): Promise<PaginatedEntity<Property>> {
    const qb = this.propertyRepository.createQueryBuilder('property');
    this.propertyRepository.filterQueryBuilder(qb, filters);
    this.propertyRepository.orderQueryBuilder(qb, orderBy);

    return this.propertyRepository.findPaginated(paginationOptions, qb);
  }

  async findOne(id: number): Promise<Property> {
    const property = await this.propertyRepository.findOneBy({ id });
    if (!property)
      throw new NotFoundException(PROPERTY_RESPONSE_TEXT.NOT_FOUND);
    return property;
  }

  async update(
    id: number,
    updatePropertyDto: UpdatePropertyDto,
  ): Promise<Property> {
    const property = await this.findOne(id);
    return this.propertyRepository.save({ ...property, ...updatePropertyDto });
  }

  async remove(id: number): Promise<Property> {
    const property = await this.findOne(id);
    return this.propertyRepository.softRemove(property);
  }
}
