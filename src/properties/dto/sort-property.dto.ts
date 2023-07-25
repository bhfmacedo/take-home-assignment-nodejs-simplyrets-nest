import { IsEnum, ValidateIf } from 'class-validator';
import { PropertyOrder, PropertySortBy } from '../enum/property.enum';
import { ApiProperty } from '@nestjs/swagger';

export class PropertySortDto {
  @ApiProperty({ enum: PropertySortBy })
  @ValidateIf((o) => !!o.order)
  @IsEnum(PropertySortBy)
  sort?: PropertySortBy;

  @ApiProperty({ enum: PropertyOrder })
  @ValidateIf((o) => !!o.sort)
  @IsEnum(PropertyOrder)
  order?: PropertyOrder;
}
