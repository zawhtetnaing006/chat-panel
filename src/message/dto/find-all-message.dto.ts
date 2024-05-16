import { IsString } from 'class-validator';

export class findAllMessageDto {
  @IsString()
  page: string;

  @IsString()
  perPage: string;
}
