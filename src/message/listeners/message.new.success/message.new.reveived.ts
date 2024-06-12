import { OnEvent } from '@nestjs/event-emitter';
import { Injectable, Logger } from '@nestjs/common';
import { NewMessageSuccessEvent } from 'src/message/events/message.new.success.event';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@Injectable()
@WebSocketGateway()
export class NewMessageReveivedListener {
  @WebSocketServer()
  server: Server;
  private readonly logger = new Logger(NewMessageReveivedListener.name);
  @OnEvent('message.new.success')
  async handle(newMessageSuccessEvent: NewMessageSuccessEvent) {
    this.server
      .to(newMessageSuccessEvent.message.room_id)
      .emit('new_message', newMessageSuccessEvent.message);
  }
}
