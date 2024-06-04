import { Logger } from '@nestjs/common';
import { OnGatewayConnection, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthService } from './auth.service';

@WebSocketGateway()
export class AuthGateway implements OnGatewayConnection {
  constructor(private readonly authService: AuthService) {}

  private readonly logger = new Logger(AuthGateway.name);
  async handleConnection(client: Socket) {
    try {
      const bearerToken = client.handshake?.headers.authorization;
      if (!bearerToken) {
        throw new Error('Authorization header is missing');
      }

      const authenticatedUser = await this.authService.verifyForWs(bearerToken);
      if (!authenticatedUser) {
        throw new Error('User authentication failed');
      }
      client['user'] = authenticatedUser;
    } catch (error) {
      this.logger.error('Error handling handshake', error);
      client.disconnect();
    }
  }
}
