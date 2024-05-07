import { PartialType } from '@nestjs/mapped-types';
import { CreateTextMessageDto } from './create-text-message.dto';

export class UpdateTextMessageDto extends PartialType(CreateTextMessageDto) {}
