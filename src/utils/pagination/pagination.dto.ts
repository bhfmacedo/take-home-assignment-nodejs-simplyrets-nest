import { ObjectLiteral } from 'typeorm';
import { IHttpResponse } from '../http-response';
import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PAGINATION_SIZE } from '../../constants';

export class PaginatedEntityResponseDto<E extends ObjectLiteral>
  implements IHttpResponse
{
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  status!: number;

  @IsString()
  @ApiProperty()
  response!: string;

  @IsNotEmpty()
  @ApiProperty()
  data: PaginatedEntity<E>;
}

export interface PaginatedEntity<E extends ObjectLiteral> {
  meta: PaginationMetaDto;
  items: E[];
}

export class PaginationMetaDto {
  @IsDefined()
  @IsNumber()
  @ApiProperty()
  totalItems!: number;

  @IsDefined()
  @IsNumber()
  @ApiProperty()
  itemCount!: number;

  @IsDefined()
  @IsNumber()
  @ApiProperty()
  itemsPerPage!: number;

  @IsDefined()
  @IsNumber()
  @ApiProperty()
  totalPages!: number;

  @IsDefined()
  @IsNumber()
  @ApiProperty()
  currentPage!: number;
}

export class PaginationOptionsDto {
  @ApiProperty({
    required: false,
    description: 'The result set page to be returned',
  })
  @IsNumber()
  @Min(PAGINATION_SIZE.MIN_PAGE)
  page: number = 1;

  @ApiProperty({
    required: false,
    description: 'The maximum number of records to be returned',
    example: 10,
  })
  @IsNumber()
  @Min(PAGINATION_SIZE.MIN_ITEMS)
  @Max(PAGINATION_SIZE.MAX_ITEMS)
  limit: number = 10;
}
