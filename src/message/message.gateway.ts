import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';

@WebSocketGateway(4100)
export class MessageGateway {
  @WebSocketServer()
  server: Server;
  constructor(
    private eventEmitter: EventEmitter2,
    private authService: AuthService,
  ) {}

  async handleConnection(client: Socket) {
    const bearerToken = client.handshake?.headers.authorization;
    const authenticatedUser = await this.authService.verifyForWs(bearerToken);
    if (!authenticatedUser) client.disconnect();
    client['user'] = authenticatedUser;
  }

  @SubscribeMessage('new_message')
  handleMessage(client: Socket, payload: any): string {
    console.log(client);
    this.server.to(payload.room_id).emit('new_message', 123);
    return 'Hello world!';
  }
}
