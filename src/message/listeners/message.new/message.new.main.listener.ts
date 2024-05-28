import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Injectable, Logger } from '@nestjs/common';
import { NewMessageEvent } from '../../events/message.new.event';
import { MessageService } from '../../message.service';
import { ListenerResponse } from 'src/helper/listener-response';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { NewMessageSuccessEvent } from 'src/message/events/message.new.success.event';

@Injectable()
@WebSocketGateway(4100)
export class NewMessageListener {
  private readonly logger = new Logger(NewMessageListener.name);
  constructor(
    private readonly messageService: MessageService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @WebSocketServer()
  server: Server;

  @OnEvent('message.new')
  async handle(newMessageEvent: NewMessageEvent): Promise<ListenerResponse> {
    try {
      const message = await this.messageService.sendMessage(
        newMessageEvent.room_id,
        newMessageEvent.user_id,
        newMessageEvent.text_message,
      );
      if (!message) throw new Error("Can't create message");

      const newMessageSuccessEvent = new NewMessageSuccessEvent(message);

      this.eventEmitter.emit('message.new.success', newMessageSuccessEvent);
      this.server.to(newMessageEvent.room_id).emit('new_message', message);
      return new ListenerResponse('main', message);
    } catch (error) {
      this.logger.error('Error while handling new message', error);
    }
  }
}
