import { Injectable } from '@nestjs/common';
import { RoomService } from '../room.service';
import { OnEvent } from '@nestjs/event-emitter';
import { JoinRoomEvent } from '../events/room.join.event';
import { ListenerResponse } from 'src/helper/listener-response';

@Injectable()
export class JoinRoomListener {
  constructor(private roomService: RoomService) {}

  @OnEvent('room.join')
  async handle(joinRoomEvent: JoinRoomEvent): Promise<ListenerResponse> {
    try {
      const room = await this.roomService.join(
        joinRoomEvent.user_id,
        joinRoomEvent.room_id,
      );
      return new ListenerResponse('main', room);
    } catch (error) {
      console.log(error);
    }
  }
}
