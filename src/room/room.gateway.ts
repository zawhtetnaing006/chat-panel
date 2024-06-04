import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JoinRoomEvent } from './events/room.join.event';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Logger } from '@nestjs/common';

@WebSocketGateway()
export class RoomGateway {
  constructor(private readonly eventEmiiter: EventEmitter2) {}
  private readonly logger = new Logger(RoomGateway.name);
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join_room')
  handleJoinRoom(client: Socket, payload: any) {
    try {
      const parsedPayload = JSON.parse(payload);
      if (!parsedPayload || !parsedPayload.room_id) {
        throw new Error('Invalid payload format');
      }
      const room_id = parsedPayload.room_id;
      const joinRoomEvent = new JoinRoomEvent(room_id, client['user']?.id);

      this.eventEmiiter.emitAsync('room.join', joinRoomEvent);
      this.server.socketsJoin(room_id);
    } catch (error) {
      this.logger.error('Error handling join_room', error);
      client.emit('error', 'An error occured while joining the room');
    }
  }
}
