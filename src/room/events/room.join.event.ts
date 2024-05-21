export class JoinRoomEvent {
  constructor(
    public room_id: string,
    public user_id: string,
  ) {}
}
