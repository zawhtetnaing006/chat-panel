import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';

@WebSocketGateway(4100, { namespace: 'message' })
export class MessageGateway {
  @WebSocketServer()
  server: Server;
  constructor(
    private eventEmitter: EventEmitter2,
    private authService: AuthService,
  ) {}

  async handleConnection(client: Socket) {
    const bearerToken = client.handshake?.headers.authorization;
    console.log(client.id);
    const isAuthenticated = await this.authService.verifyForWs(bearerToken);
    if (!isAuthenticated) client.disconnect();
  }

  @SubscribeMessage('new_message')
  handleMessage(client: any, payload: any): string {
    this.server.emit('new_message', 123);
    return 'Hello world!';
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(client: any, payload: any): string {
    return 'Hello Room!';
  }
}
