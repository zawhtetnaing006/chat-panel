import { Controller, Post, Body, Param, Request, HttpException, HttpStatus } from '@nestjs/common';
import { MessageService } from './message.service';
import { sendMessageDto } from './dto/send-message.dto';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { RoomService } from 'src/room/room.service';
import { ApiResponse } from 'src/helper/api-response';

@Controller('room/:room_id/message')
@ApiTags('Message')
@ApiBearerAuth()
@ApiHeader({
  name: 'clientkey',
  description: 'api-key-for-chat-panel',
})
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
    if(!req.user) {
      throw new HttpException('Invalid token or incomplete client key!',HttpStatus.BAD_REQUEST)
    }

    const room = await this.roomService.findOne(room_id);
    if(!room) {
      return new ApiResponse(['Room not found!'],HttpStatus.NOT_FOUND);
    }

    const message = await this.messageService.sendMessage(room_id,req.user.id, sendMessageDto);
    return new ApiResponse(['Successfully sent message!'],HttpStatus.OK,message);
  }
}
