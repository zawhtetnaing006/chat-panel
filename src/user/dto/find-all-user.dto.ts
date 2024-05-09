import { IsString } from 'class-validator';

export class findAllUserDto {
  @IsString()
  page: string;

  @IsString()
  perPage: string;
}
