import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway(4100, { namespace: 'message' })
export class MessageGateway {
  @SubscribeMessage('new_message')
  handleMessage(client: any, payload: any): string {
    console.log('from message namespace');
    console.log(payload);
    return 'Hello world!';
  }
}
