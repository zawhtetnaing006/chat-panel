import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsString,
} from 'class-validator';

export class CreateRoomDto {
  @IsString()
  name: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1, { message: 'At least one user is required' })
  users: string[];
}
