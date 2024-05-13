import { PartialType } from '@nestjs/mapped-types';
import { CreateMessageDto } from './send-message.dto';

export class UpdateMessageDto extends PartialType(CreateMessageDto) {}
