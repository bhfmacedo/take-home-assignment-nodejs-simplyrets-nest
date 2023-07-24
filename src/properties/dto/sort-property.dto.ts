import { IsEnum, ValidateIf } from 'class-validator';
import { PropertyOrder, PropertySortBy } from '../enum/property.enum';

export class PropertySortDto {
  @ValidateIf((o) => !!o.order)
  @IsEnum(PropertySortBy)
  sort?: PropertySortBy;

  @ValidateIf((o) => !!o.sort)
  @IsEnum(PropertyOrder)
  order?: PropertyOrder;
}
