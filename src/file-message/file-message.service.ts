import { Injectable } from '@nestjs/common';
import { CreateFileMessageDto } from './dto/create-file-message.dto';
import { UpdateFileMessageDto } from './dto/update-file-message.dto';

@Injectable()
export class FileMessageService {
  create(createFileMessageDto: CreateFileMessageDto) {
    return 'This action adds a new fileMessage';
  }

  findAll() {
    return `This action returns all fileMessage`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fileMessage`;
  }

  update(id: number, updateFileMessageDto: UpdateFileMessageDto) {
    return `This action updates a #${id} fileMessage`;
  }

  remove(id: number) {
    return `This action removes a #${id} fileMessage`;
  }
}
