import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ObjectLiteral } from 'typeorm';

export interface IHttpResponse {
  status: number;
  response: string;
  data: any;
}

export class EntityResponseDto<E extends ObjectLiteral>
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
  data: E | E[];
}

export const generateHttpResponse = (
  httpStatus: number,
  response: string,
  data: any,
): IHttpResponse => {
  return {
    status: httpStatus,
    response,
    data,
  };
};
