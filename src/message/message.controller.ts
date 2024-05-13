import { Controller, Post, Body, Param, Request } from '@nestjs/common';
import { MessageService } from './message.service';
import { sendMessageDto } from './dto/send-message.dto';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { RoomService } from 'src/room/room.service';

@Controller('message')
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

  @Post('send/:room_id')
  create(
    @Param('room_id') room_id: string,
    @Body() sendMessageDto: sendMessageDto,
    @Request() req,
  ) {
    console.log(req.user);
    return this.messageService.sendMessage(room_id, sendMessageDto);
  }
}
