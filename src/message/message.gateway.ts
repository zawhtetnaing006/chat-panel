import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway(4100)
export class MessageGateway {
  @WebSocketServer()
  server: Server;
  private readonly logger = new Logger(MessageGateway.name);

  constructor(private eventEmitter: EventEmitter2) {}

  @SubscribeMessage('new_message')
  handleMessage(client: Socket, payload: any) {
    try {
      this.logger.log(client['user']);
      const parsedPayload = JSON.parse(payload);
      if (!parsedPayload || !parsedPayload.room_id) {
        throw new Error('Invalid payload format');
      }

      const room_id = parsedPayload.room_id;
      this.server.to(room_id).emit('new_message', payload);
    } catch (error) {
      this.logger.error('Error handling new_message', error);
      client.emit('error', 'An error occurred while processing your message');
    }
  }
}
