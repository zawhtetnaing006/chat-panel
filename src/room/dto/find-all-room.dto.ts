import { IsString } from 'class-validator';

export class findAllRoomDto {
  @IsString()
  page: string;

  @IsString()
  perPage: string;
}
