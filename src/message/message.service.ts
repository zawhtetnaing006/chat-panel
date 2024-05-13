import { Injectable } from '@nestjs/common';
import { sendMessageDto } from './dto/send-message.dto';

@Injectable()
export class MessageService {
  sendMessage(sendMessageDto: sendMessageDto) {
    console.log(sendMessageDto);
  }
}
