import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FileMessageService } from './file-message.service';
import { CreateFileMessageDto } from './dto/create-file-message.dto';
import { UpdateFileMessageDto } from './dto/update-file-message.dto';

@Controller('file-message')
export class FileMessageController {
  constructor(private readonly fileMessageService: FileMessageService) {}

  @Post()
  create(@Body() createFileMessageDto: CreateFileMessageDto) {
    return this.fileMessageService.create(createFileMessageDto);
  }

  @Get()
  findAll() {
    return this.fileMessageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fileMessageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFileMessageDto: UpdateFileMessageDto) {
    return this.fileMessageService.update(+id, updateFileMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fileMessageService.remove(+id);
  }
}
