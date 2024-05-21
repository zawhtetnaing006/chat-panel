import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JoinRoomEvent } from './events/room.join.event';
import { AuthService } from 'src/auth/auth.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@WebSocketGateway(4100)
export class RoomGateway {
  constructor(
    private readonly authService: AuthService,
    private readonly eventEmiiter: EventEmitter2,
  ) {}
  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    const bearerToken = client.handshake?.headers.authorization;
    const authenticatedUser = await this.authService.verifyForWs(bearerToken);
    if (!authenticatedUser) client.disconnect();
    client['user'] = authenticatedUser;
  }

  @SubscribeMessage('new_message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(client: Socket, payload: any) {
    const room_id = JSON.parse(payload).room_id;
    const joinRoomEvent = new JoinRoomEvent(room_id, client['user']?.id);
    this.eventEmiiter.emitAsync('room.join',joinRoomEvent);
    this.server.socketsJoin(payload?.room_id);
  }
}
