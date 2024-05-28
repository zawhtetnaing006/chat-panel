import { OnEvent } from '@nestjs/event-emitter';
import { Injectable, Logger } from '@nestjs/common';
import { NewMessageSuccessEvent } from 'src/message/events/message.new.success.event';

@Injectable()
export class NewMessageNotiListener {
  private readonly logger = new Logger(NewMessageNotiListener.name);
  @OnEvent('message.new.success')
  async handle(newMessageSuccessEvent: NewMessageSuccessEvent) {
    console.log(newMessageSuccessEvent);
    console.log('TODO: Send noti for success message!');
  }
}
