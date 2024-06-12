import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Logger } from '@nestjs/common';
import { RoomService } from './room.service';

@WebSocketGateway()
export class RoomGateway {
  constructor(
    private readonly eventEmiiter: EventEmitter2,
    private readonly roomService: RoomService,
  ) {}
  private readonly logger = new Logger(RoomGateway.name);
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join_room')
  async handleJoinRoom(client: Socket, payload: any) {
    try {
      const parsedPayload = JSON.parse(payload);
      if (!parsedPayload || !parsedPayload.room_id) {
        throw new Error('Invalid payload format');
      }

      const room_id = parsedPayload.room_id;
      const user_id = client['user']?.id;

      const room = await this.roomService.join(user_id, room_id);
      if (!room) {
        throw new Error('Room join failed!');
      }

      this.server.socketsJoin(room_id);
    } catch (error) {
      this.logger.error('Error handling join_room', error);
      client.emit('error', 'An error occured while joining the room');
    }
  }
}
