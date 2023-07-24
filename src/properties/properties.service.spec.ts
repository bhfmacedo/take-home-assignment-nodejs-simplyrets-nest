import { Test, TestingModule } from '@nestjs/testing';
import { PropertiesService } from './properties.service';
import { IPropertyRepository } from './repository/property.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Property } from './entity/property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { PropertyFiltersDto } from './dto/property-filters.dto';
import {
  PaginatedEntity,
  PaginationOptionsDto,
} from 'src/utils/pagination/pagination.dto';
import { PropertySortDto } from './dto/sort-property.dto';
import { PropertyOrder, PropertySortBy } from './enum/property.enum';
import { NotFoundException } from '@nestjs/common';
import { UpdatePropertyDto } from './dto/update-property.dto';

const mockProperty: Property = {
  id: 31,
  address: '10915 South Bannister Way Garden #A',
  price: 19237330,
  bedrooms: 3,
  bathrooms: 3,
  type: null,
};

const mockDeletedProperty: Property = {
  ...mockProperty,
  deletedAt: new Date(),
};

const mockPaginatedProperty: PaginatedEntity<Property> = {
  items: [mockProperty],
  meta: {
    totalItems: 1,
    itemCount: 1,
    itemsPerPage: 1,
    totalPages: 1,
    currentPage: 1,
  },
};

const mockPropertyRepository = {
  findOneBy: jest.fn().mockResolvedValue(mockProperty),
  create: jest.fn().mockReturnValue({ ...mockProperty, id: undefined }),
  save: jest.fn().mockResolvedValue(mockProperty),
  createQueryBuilder: jest.fn().mockReturnValue({
    getManyAndCount: jest.fn().mockResolvedValue([[mockProperty], 1]),
  }),
  filterQueryBuilder: jest.fn(),
  orderQueryBuilder: jest.fn(),
  findPaginated: jest.fn().mockResolvedValue(mockPaginatedProperty),
  softRemove: jest.fn().mockResolvedValue(mockDeletedProperty),
};

describe('PropertiesService', () => {
  let service: PropertiesService;
  let repository: IPropertyRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PropertiesService,
        {
          provide: getRepositoryToken(Property),
          useValue: mockPropertyRepository,
        },
      ],
    }).compile();

    service = module.get<PropertiesService>(PropertiesService);
    repository = module.get<IPropertyRepository>(getRepositoryToken(Property));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('PropertyService.create', () => {
    const mockCreateProperty: CreatePropertyDto = {
      address: 'Some street, 10',
      price: 10000,
      bedrooms: 1,
      bathrooms: 1,
      type: null,
    };
    it('should create a new property from params', async () => {
      await service.create(mockCreateProperty);

      expect(repository.create).toHaveBeenCalledWith(mockCreateProperty);
    });
    it('should save and return the new property', async () => {
      const newProperty = await service.create(mockCreateProperty);

      expect(repository.save).toHaveBeenCalledWith({
        ...mockProperty,
        id: undefined,
      });
      expect(newProperty).toEqual(mockProperty);
    });
  });

  describe('PropertyService.findAll', () => {
    const mockFilters: PropertyFiltersDto = {
      bathrooms: 2,
      bedrooms: 3,
    };
    const mockOrder: PropertySortDto = {
      sort: PropertySortBy.ADDRESS,
      order: PropertyOrder.ASC,
    };
    const mockPaginationOptions: PaginationOptionsDto = {
      page: 2,
      limit: 10,
    };

    it('should filter properties', async () => {
      await service.findAll(mockFilters, {}, mockPaginationOptions);

      expect(repository.filterQueryBuilder).toHaveBeenCalledWith(
        repository.createQueryBuilder(),
        mockFilters,
      );
      expect(repository.orderQueryBuilder).toHaveBeenCalledWith(
        repository.createQueryBuilder(),
        {},
      );
    });

    it('should order properties', async () => {
      await service.findAll({}, mockOrder, mockPaginationOptions);

      expect(repository.filterQueryBuilder).toHaveBeenCalledWith(
        repository.createQueryBuilder(),
        {},
      );
      expect(repository.orderQueryBuilder).toHaveBeenCalledWith(
        repository.createQueryBuilder(),
        mockOrder,
      );
    });

    it('should filter and order properties', async () => {
      await service.findAll(mockFilters, mockOrder, mockPaginationOptions);

      expect(repository.filterQueryBuilder).toHaveBeenCalledWith(
        repository.createQueryBuilder(),
        mockFilters,
      );
      expect(repository.orderQueryBuilder).toHaveBeenCalledWith(
        repository.createQueryBuilder(),
        mockOrder,
      );
    });

    it('should return paginated results', async () => {
      const results = await service.findAll(
        mockFilters,
        mockOrder,
        mockPaginationOptions,
      );

      expect(repository.findPaginated).toHaveBeenCalledWith(
        mockPaginationOptions,
        repository.createQueryBuilder(),
      );
      expect(results).toEqual(mockPaginatedProperty);
    });
  });

  describe('PropertyService.findOne', () => {
    const propertyId = 1;

    it('should call find one by id', async () => {
      const property = await service.findOne(propertyId);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: propertyId });
      expect(property).toEqual(mockProperty);
    });
    it('should fail if not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(null);

      try {
        await service.findOne(propertyId);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('PropertyService.update', () => {
    const propertyId = 2;
    const mockUpdateDto: UpdatePropertyDto = {
      address: 'new address',
    };

    it('should call find property by id', async () => {
      const findOneSpy = jest.spyOn(service, 'findOne');

      await service.update(propertyId, mockUpdateDto);

      expect(findOneSpy).toHaveBeenCalledWith(propertyId);
    });

    it('should save merged property fields', async () => {
      await service.update(propertyId, mockUpdateDto);

      expect(repository.save).toHaveBeenCalledWith({
        ...mockProperty,
        ...mockUpdateDto,
      });
    });
  });

  describe('PropertyService.remove', () => {
    const propertyId = 3;

    it('should call find property by id', async () => {
      const findOneSpy = jest.spyOn(service, 'findOne');

      await service.remove(propertyId);

      expect(findOneSpy).toHaveBeenCalledWith(propertyId);
    });

    it('should soft remove and return the property', async () => {
      const removedProperty = await service.remove(propertyId);

      expect(repository.softRemove).toHaveBeenCalledWith(mockProperty);
      expect(removedProperty).toEqual(mockDeletedProperty);
    });
  });
});
