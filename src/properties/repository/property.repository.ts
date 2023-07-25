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

// Interface for building custom TypeORM repositories. Since TypeORM v0.3
// is no longer recommended to create custom repositories simply by extending the
// repository class. Now we need to define the interface and a factory for actually
// instantiating it.
export interface IPropertyRepository extends Repository<Property> {
  // The actual repository
  this: Repository<Property>;

  /**
   * Finds paginated entities based on the provided pagination options and query builder.
   *
   * @param paginationOptions - The pagination options used to control the result set.
   * @param queryBuilder - An optional parameter representing a customized query.
   *  If not provided, a new query builder will be created.
   *
   * @returns The paginated result set.
   */
  findPaginated(
    paginationOptions: PaginationOptionsDto,
    queryBuilder?: SelectQueryBuilder<Property>,
  ): Promise<PaginatedEntity<Property>>;

  /**
   * Applies filters to the given query builder.
   *
   * @param queryBuilder - The QueryBuilder to which filters will be applied.
   * @param filters - Filters to be applied to the query.
   *
   * @returns A QueryBuilder instance with the filters applied.
   */
  filterQueryBuilder(
    queryBuilder: SelectQueryBuilder<Property>,
    filters: PropertyFiltersDto,
  ): SelectQueryBuilder<Property>;

  /**
   * Applies order by to the given query builder.
   *
   * @param queryBuilder - The QueryBuilder to which order by will be applied.
   * @param orderBy - Order to be applied to the query.
   *
   * @returns A QueryBuilder instance with the order by applied.
   */
  orderQueryBuilder(
    queryBuilder: SelectQueryBuilder<Property>,
    orderBy: PropertySortDto,
  ): SelectQueryBuilder<Property>;
}

// The factory will return the custom repository implementation. Nest is responsible
// for calling it when injecting the repository.
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
        // A contain filter, will return address containing the desired filter
        queryBuilder.andWhere('property.address like :address', {
          address: `%${filters.address}%`,
        });
      if (filters.price)
        queryBuilder.andWhere('property.price = :price', {
          price: filters.price,
        });
      if (filters.bedrooms)
        queryBuilder.andWhere('property.bedrooms = :bedrooms', {
          bedrooms: filters.bedrooms,
        });
      if (filters.bathrooms)
        queryBuilder.andWhere('property.bathrooms = :bathrooms', {
          bathrooms: filters.bathrooms,
        });
      if (filters.type)
        queryBuilder.andWhere('property.type = :type', { type: filters.type });

      return queryBuilder;
    },

    orderQueryBuilder(
      queryBuilder: SelectQueryBuilder<Property>,
      orderBy: PropertySortDto,
    ): SelectQueryBuilder<Property> {
      if (orderBy)
        return queryBuilder.orderBy(
          // This mapping avoid verbosity with switch/cases or if/elses
          PropertySortByMapping[orderBy.sort],
          orderBy.order,
          'NULLS LAST',
        );
    },
  };
}

// The actual repository creation
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
