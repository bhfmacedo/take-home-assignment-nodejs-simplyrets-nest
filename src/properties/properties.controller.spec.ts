import { Test, TestingModule } from '@nestjs/testing';
import { PropertiesController } from './properties.controller';
import { PropertiesService } from './properties.service';
import { Property } from './entity/property.entity';
import {
  PaginatedEntity,
  PaginationOptionsDto,
} from '../utils/pagination/pagination.dto';
import { CreatePropertyDto } from './dto/create-property.dto';
import { HttpStatus } from '@nestjs/common';
import { PROPERTY_RESPONSE_TEXT } from '../constants';
import { PropertyFiltersDto } from './dto/property-filters.dto';
import { PropertySortDto } from './dto/sort-property.dto';
import { PropertyOrder, PropertySortBy } from './enum/property.enum';
import { UpdatePropertyDto } from './dto/update-property.dto';

const mockProperty: Property = {
  id: 31,
  address: '10915 South Bannister Way Garden #A',
  price: 19237330,
  bedrooms: 3,
  bathrooms: 3,
  type: null,
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

const mockPropertyService = {
  create: jest.fn().mockResolvedValue(mockProperty),
  findAll: jest.fn().mockResolvedValue(mockPaginatedProperty),
  findOne: jest.fn().mockResolvedValue(mockProperty),
  update: jest.fn().mockResolvedValue(mockProperty),
  remove: jest.fn().mockResolvedValue(mockProperty),
};

describe('PropertiesController', () => {
  let controller: PropertiesController;
  let service: PropertiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertiesController],
      providers: [
        {
          provide: PropertiesService,
          useValue: mockPropertyService,
        },
      ],
    }).compile();

    controller = module.get<PropertiesController>(PropertiesController);
    service = module.get<PropertiesService>(PropertiesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('PropertiesController.create', () => {
    const mockCreateProperty: CreatePropertyDto = {
      address: 'Some street, 10',
      price: 10000,
      bedrooms: 1,
      bathrooms: 1,
      type: null,
    };

    it('should call service.create', async () => {
      await controller.create(mockCreateProperty);

      expect(service.create).toHaveBeenCalledWith(mockCreateProperty);
    });

    it('should return correct HTTP response', async () => {
      const result = await controller.create(mockCreateProperty);

      expect(result).toEqual({
        status: HttpStatus.CREATED,
        response: PROPERTY_RESPONSE_TEXT.CREATE,
        data: mockProperty,
      });
    });
  });

  describe('PropertiesController.findAll', () => {
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

    it('should call service.findAll', async () => {
      await controller.findAll(mockFilters, mockOrder, mockPaginationOptions);

      expect(service.findAll).toHaveBeenCalledWith(
        mockFilters,
        mockOrder,
        mockPaginationOptions,
      );
    });

    it('should return correct HTTP response', async () => {
      const result = await controller.findAll(
        mockFilters,
        mockOrder,
        mockPaginationOptions,
      );

      expect(result).toEqual({
        status: HttpStatus.OK,
        response: PROPERTY_RESPONSE_TEXT.FIND,
        data: mockPaginatedProperty,
      });
    });
  });

  describe('PropertiesController.findOne', () => {
    const propertyId = 1;

    it('should call service.findOne', async () => {
      await controller.findOne(propertyId);

      expect(service.findOne).toHaveBeenCalledWith(propertyId);
    });

    it('should return correct HTTP response', async () => {
      const result = await controller.findOne(propertyId);

      expect(result).toEqual({
        status: HttpStatus.OK,
        response: PROPERTY_RESPONSE_TEXT.FIND_ONE,
        data: mockProperty,
      });
    });
  });

  describe('PropertiesController.update', () => {
    const propertyId = 1;
    const mockUpdateDto: UpdatePropertyDto = {
      price: 15000,
    };

    it('should call service.update', async () => {
      await controller.update(propertyId, mockUpdateDto);

      expect(service.update).toHaveBeenCalledWith(propertyId, mockUpdateDto);
    });

    it('should return correct HTTP response', async () => {
      const result = await controller.update(propertyId, mockUpdateDto);

      expect(result).toEqual({
        status: HttpStatus.OK,
        response: PROPERTY_RESPONSE_TEXT.UPDATE,
        data: mockProperty,
      });
    });
  });

  describe('PropertiesController.remove', () => {
    const propertyId = 1;

    it('should call service.remove', async () => {
      await controller.remove(propertyId);

      expect(service.remove).toHaveBeenCalledWith(propertyId);
    });

    it('should return correct HTTP response', async () => {
      const result = await controller.remove(propertyId);

      expect(result).toEqual({
        status: HttpStatus.OK,
        response: PROPERTY_RESPONSE_TEXT.REMOVE,
        data: mockProperty,
      });
    });
  });
});
