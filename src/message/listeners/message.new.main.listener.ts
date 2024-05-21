import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { NewMessageEvent } from '../events/message.new.event';
import { MessageService } from '../message.service';
import { ListenerResponse } from 'src/helper/listener-response';

@Injectable()
export class NewMessageListener {
  constructor(private readonly messageService: MessageService) {}

  @OnEvent('message.new')
  async handle(newMessageEvent: NewMessageEvent): Promise<ListenerResponse> {
    try {
      const message = await this.messageService.sendMessage(
        newMessageEvent.room_id,
        newMessageEvent.user_id,
        newMessageEvent.text_message,
      );
      return new ListenerResponse('main', message);
    } catch (error) {
      throw error;
    }
  }
}
