import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { MessageService } from './message.service';
import { NewMessageSuccessEvent } from './events/message.new.success.event';

@WebSocketGateway()
export class MessageGateway {
  @WebSocketServer()
  server: Server;
  private readonly logger = new Logger(MessageGateway.name);

  constructor(
    private eventEmitter: EventEmitter2,
    private messageService: MessageService,
  ) {}

  @SubscribeMessage('send_message')
  async handleMessage(client: Socket, payload: any) {
    try {
      const parsedPayload = JSON.parse(payload);
      if (!parsedPayload || !parsedPayload.room_id) {
        throw new Error('Invalid payload format');
      }

      const room_id = parsedPayload.room_id;
      const user_id = client['user']?.id;

      const message = await this.messageService.sendMessage(
        room_id,
        user_id,
        parsedPayload.text_message,
      );
      if (!message) throw new Error("Can't create message");

      const newMessageSuccessEvent = new NewMessageSuccessEvent(message);
      this.eventEmitter.emit('message.new.success', newMessageSuccessEvent);
    } catch (error) {
      this.logger.error('Error handling new_message', error);
      client.emit('error', 'An error occurred while processing your message');
    }
  }
}
