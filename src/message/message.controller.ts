import {
  Controller,
  Post,
  Body,
  Param,
  Request,
  HttpStatus,
  Get,
  Query,
  UseGuards,
  HttpException,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { sendMessageDto } from './dto/send-message.dto';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { RoomService } from 'src/room/room.service';
import { ApiResponse } from 'src/helper/api-response';
import { findAllMessageDto } from './dto/find-all-message.dto';
import { MessageGuard } from './message.guard';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NewMessageEvent } from './events/message.new.event';
import { ListenerResponse } from 'src/helper/listener-response';

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
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post('send')
  async create(
    @Param('room_id') room_id: string,
    @Body() sendMessageDto: sendMessageDto,
    @Request() req,
  ) {
    const response = new ApiResponse();
    const newMessageEvent = new NewMessageEvent(
      req.user.id,
      room_id,
      sendMessageDto.textMessage,
    );

    try {
      const results = await this.eventEmitter.emitAsync(
        'message.new',
        newMessageEvent,
      );

      if (!results.every((result) => result instanceof ListenerResponse)) {
        throw new HttpException(
          'Invalid response from listeners',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const mainResult = results.find((result) => result.type === 'main');

      if (!mainResult) {
        throw new HttpException(
          'There must be one main listener',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      response.statusCode = HttpStatus.OK;
      response.message = ['Successfully sent message'];
      response.content = mainResult.content;
    } catch (error) {
      throw new HttpException(
        'Failed to process message',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return response;
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
