import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { NewMessageEvent } from './events/message.new.event';

@WebSocketGateway()
export class MessageGateway {
  @WebSocketServer()
  server: Server;
  private readonly logger = new Logger(MessageGateway.name);

  constructor(private eventEmitter: EventEmitter2) {}

  @SubscribeMessage('send_message')
  handleMessage(client: Socket, payload: any) {
    try {
      const parsedPayload = JSON.parse(payload);
      if (!parsedPayload || !parsedPayload.room_id) {
        throw new Error('Invalid payload format');
      }

      if (!parsedPayload.text_message || parsedPayload.text_message == '') {
        throw new Error('Messge is empty');
      }

      const room_id = parsedPayload.room_id;
      const user_id = client['user']?.id;

      const newMessageEvent = new NewMessageEvent(
        user_id,
        room_id,
        parsedPayload.text_message,
      );
      this.eventEmitter.emit('message.new', newMessageEvent);
    } catch (error) {
      this.logger.error('Error handling new_message', error);
      client.emit('error', 'An error occurred while processing your message');
    }
  }
}
