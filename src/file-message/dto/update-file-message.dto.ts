import { PartialType } from '@nestjs/mapped-types';
import { CreateFileMessageDto } from './create-file-message.dto';

export class UpdateFileMessageDto extends PartialType(CreateFileMessageDto) {}
