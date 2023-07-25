import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import {
  EntityResponseDto,
  generateHttpResponse,
} from '../utils/http-response';
import { Property } from './entity/property.entity';
import {
  PaginatedEntityResponseDto,
  PaginationOptionsDto,
} from '../utils/pagination/pagination.dto';
import { PROPERTY_RESPONSE_TEXT } from '../constants';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PropertyFiltersDto } from './dto/property-filters.dto';
import { PropertySortDto } from './dto/sort-property.dto';

@ApiTags('Properties')
@Controller('properties')
@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    transformOptions: { enableImplicitConversion: true },
  }),
)
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  @ApiOkResponse({ type: EntityResponseDto<Property> })
  async create(
    @Body() createPropertyDto: CreatePropertyDto,
  ): Promise<EntityResponseDto<Property>> {
    const data = await this.propertiesService.create(createPropertyDto);
    return generateHttpResponse(
      HttpStatus.CREATED,
      PROPERTY_RESPONSE_TEXT.CREATE,
      data,
    );
  }

  @Get()
  @ApiOkResponse({ type: PaginatedEntityResponseDto<Property> })
  async findAll(
    @Query() filters: PropertyFiltersDto,
    @Query() orderBy: PropertySortDto,
    @Query() paginationOptions: PaginationOptionsDto,
  ): Promise<PaginatedEntityResponseDto<Property>> {
    const { meta, items } = await this.propertiesService.findAll(
      filters,
      orderBy,
      paginationOptions,
    );
    return generateHttpResponse(HttpStatus.OK, PROPERTY_RESPONSE_TEXT.FIND, {
      meta,
      items,
    });
  }

  @Get(':id')
  @ApiOkResponse({ type: EntityResponseDto<Property> })
  async findOne(@Param('id') id: number): Promise<EntityResponseDto<Property>> {
    const data = await this.propertiesService.findOne(id);
    return generateHttpResponse(
      HttpStatus.OK,
      PROPERTY_RESPONSE_TEXT.FIND_ONE,
      data,
    );
  }

  @Patch(':id')
  @ApiOkResponse({ type: EntityResponseDto<Property> })
  async update(
    @Param('id') id: number,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ): Promise<EntityResponseDto<Property>> {
    const data = await this.propertiesService.update(id, updatePropertyDto);
    return generateHttpResponse(
      HttpStatus.OK,
      PROPERTY_RESPONSE_TEXT.UPDATE,
      data,
    );
  }

  @Delete(':id')
  @ApiOkResponse({ type: EntityResponseDto<Property> })
  async remove(@Param('id') id: number): Promise<EntityResponseDto<Property>> {
    const data = await this.propertiesService.remove(id);
    return generateHttpResponse(
      HttpStatus.OK,
      PROPERTY_RESPONSE_TEXT.REMOVE,
      data,
    );
  }
}
