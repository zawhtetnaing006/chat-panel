import {
  Controller,
  Post,
  Body,
  Param,
  Request,
  HttpException,
  HttpStatus,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { sendMessageDto } from './dto/send-message.dto';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { RoomService } from 'src/room/room.service';
import { ApiResponse } from 'src/helper/api-response';
import { findAllMessageDto } from './dto/find-all-message.dto';
import { MessageGuard } from './message.guard';

@Controller('room/:room_id/message')
@ApiTags('Message')
@ApiBearerAuth()
@ApiHeader({
  name: 'clientkey',
  description: 'api-key-for-chat-panel',
})
@UseGuards(MessageGuard)
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly roomService: RoomService,
  ) {}

  @Post('send')
  async create(
    @Param('room_id') room_id: string,
    @Body() sendMessageDto: sendMessageDto,
    @Request() req,
  ) {
    const room = await this.roomService.findOne(room_id);
    if (!room) {
      return new ApiResponse(['Room not found!'], HttpStatus.NOT_FOUND);
    }

    const message = await this.messageService.sendMessage(
      room_id,
      req.user.id,
      sendMessageDto,
    );
    return new ApiResponse(
      ['Successfully sent message!'],
      HttpStatus.OK,
      message,
    );
  }

  @Get()
  async findAll(
    @Param('room_id') room_id: string,
    @Query() findAllMessageDto: findAllMessageDto,
  ) {
    const messages = await this.messageService.findAll(
      room_id,
      findAllMessageDto,
    );
    return new ApiResponse(['Found all messages!'], HttpStatus.OK, messages);
  }
}
