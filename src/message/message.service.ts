import { Injectable } from '@nestjs/common';
import { sendMessageDto } from './dto/send-message.dto';

@Injectable()
export class MessageService {
  sendMessage(room_id: string, sendMessageDto: sendMessageDto) {
    console.log(room_id);
    console.log(sendMessageDto);
  }
}
