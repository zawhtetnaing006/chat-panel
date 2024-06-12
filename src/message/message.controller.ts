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
  Logger,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { sendMessageDto } from './dto/send-message.dto';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { ApiResponse } from 'src/helper/api-response';
import { findAllMessageDto } from './dto/find-all-message.dto';
import { MessageGuard } from './message.guard';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NewMessageSuccessEvent } from './events/message.new.success.event';

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
    private readonly eventEmitter: EventEmitter2,
  ) {}
  private logger = new Logger(MessageController.name);

  @Post('send')
  async create(
    @Param('room_id') room_id: string,
    @Body() sendMessageDto: sendMessageDto,
    @Request() req,
  ) {
    const response = new ApiResponse();
    try {
      const message = await this.messageService.sendMessage(
        room_id,
        req.user.id,
        sendMessageDto.textMessage,
      );
      if (!message) throw new Error("Can't create message");

      const newMessageSuccessEvent = new NewMessageSuccessEvent(message);
      this.eventEmitter.emit('message.new.success', newMessageSuccessEvent);

      response.statusCode = HttpStatus.OK;
      response.message = ['Successfully sent message'];
      response.content = message;
    } catch (error) {
      this.logger.error(error);
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
