import { Property } from '../entity/property.entity';
import {
  DataSource,
  DataSourceOptions,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import {
  PaginatedEntity,
  PaginationOptionsDto,
} from 'src/utils/pagination/pagination.dto';

import { PropertySortDto } from '../dto/sort-property.dto';
import { PropertyFiltersDto } from '../dto/property-filters.dto';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { PropertySortByMapping } from '../enum/property.enum';
import { Provider } from '@nestjs/common';

export interface IPropertyRepository extends Repository<Property> {
  this: Repository<Property>;

  findPaginated(
    paginationOptions: PaginationOptionsDto,
    queryBuilder?: SelectQueryBuilder<Property>,
  ): Promise<PaginatedEntity<Property>>;

  filterQueryBuilder(
    queryBuilder: SelectQueryBuilder<Property>,
    filters: PropertyFiltersDto,
  ): SelectQueryBuilder<Property>;

  orderQueryBuilder(
    queryBuilder: SelectQueryBuilder<Property>,
    orderBy: PropertySortDto,
  ): SelectQueryBuilder<Property>;
}

function propertyRepositoryFactory(): Pick<IPropertyRepository, any> {
  return {
    async findPaginated(
      this: Repository<Property>,
      paginationOptions: PaginationOptionsDto,
      queryBuilder?: SelectQueryBuilder<Property>,
    ): Promise<PaginatedEntity<Property>> {
      if (!queryBuilder) queryBuilder = this.createQueryBuilder('property');

      const { page, limit } = paginationOptions;
      const [items, totalItems] = await queryBuilder
        .take(limit)
        .skip((page - 1) * limit)
        .getManyAndCount();

      const totalPages = Math.ceil(totalItems / limit);

      return {
        items,
        meta: {
          totalItems,
          itemCount: items.length,
          itemsPerPage: limit,
          totalPages,
          currentPage: page,
        },
      };
    },

    filterQueryBuilder(
      queryBuilder: SelectQueryBuilder<Property>,
      filters: PropertyFiltersDto,
    ): SelectQueryBuilder<Property> {
      if (filters.address)
        queryBuilder.andWhere('address like :address', {
          address: `%${filters.address}%`,
        });
      if (filters.price)
        queryBuilder.andWhere('price = :price', { price: filters.price });
      if (filters.bedrooms)
        queryBuilder.andWhere('bedrooms = :bedrooms', {
          bedrooms: filters.bedrooms,
        });
      if (filters.bathrooms)
        queryBuilder.andWhere('bathrooms = :bathrooms', {
          bathrooms: filters.bathrooms,
        });
      if (filters.type)
        queryBuilder.andWhere('type = :type', { type: filters.type });

      return queryBuilder;
    },

    orderQueryBuilder(
      queryBuilder: SelectQueryBuilder<Property>,
      orderBy: PropertySortDto,
    ): SelectQueryBuilder<Property> {
      if (orderBy)
        return queryBuilder.orderBy(
          PropertySortByMapping[orderBy.sort],
          orderBy.order,
          'NULLS LAST',
        );
    },
  };
}

export function providePropertyRepository(
  dataSource?: DataSource | DataSourceOptions | string,
): Provider<any> {
  return {
    provide: getRepositoryToken(Property, dataSource),
    inject: [getDataSourceToken(dataSource)],
    useFactory(dataSource: DataSource): Repository<Property> {
      return dataSource
        .getRepository(Property)
        .extend(propertyRepositoryFactory());
    },
  };
}
