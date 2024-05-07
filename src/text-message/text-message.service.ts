import { Injectable } from '@nestjs/common';
import { CreateTextMessageDto } from './dto/create-text-message.dto';
import { UpdateTextMessageDto } from './dto/update-text-message.dto';

@Injectable()
export class TextMessageService {
  create(createTextMessageDto: CreateTextMessageDto) {
    return 'This action adds a new textMessage';
  }

  findAll() {
    return `This action returns all textMessage`;
  }

  findOne(id: number) {
    return `This action returns a #${id} textMessage`;
  }

  update(id: number, updateTextMessageDto: UpdateTextMessageDto) {
    return `This action updates a #${id} textMessage`;
  }

  remove(id: number) {
    return `This action removes a #${id} textMessage`;
  }
}
