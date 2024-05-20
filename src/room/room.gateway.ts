import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway(4100, { namespace: 'rooms' })
export class RoomGateway {
  @SubscribeMessage('new_message')
  handleMessage(client: any, payload: any): string {
    console.log('from room namespace');
    console.log(payload);
    return 'Hello world!';
  }
}
