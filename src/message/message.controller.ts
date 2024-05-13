import { Controller, Post, Body } from '@nestjs/common';
import { MessageService } from './message.service';
import { sendMessageDto } from './dto/send-message.dto';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('send/:room_id')
  create(@Body() sendMessageDto: sendMessageDto) {
    return this.messageService.sendMessage(sendMessageDto);
  }
}
