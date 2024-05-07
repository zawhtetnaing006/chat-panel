import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TextMessageService } from './text-message.service';
import { CreateTextMessageDto } from './dto/create-text-message.dto';
import { UpdateTextMessageDto } from './dto/update-text-message.dto';

@Controller('text-message')
export class TextMessageController {
  constructor(private readonly textMessageService: TextMessageService) {}

  @Post()
  create(@Body() createTextMessageDto: CreateTextMessageDto) {
    return this.textMessageService.create(createTextMessageDto);
  }

  @Get()
  findAll() {
    return this.textMessageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.textMessageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTextMessageDto: UpdateTextMessageDto) {
    return this.textMessageService.update(+id, updateTextMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.textMessageService.remove(+id);
  }
}
