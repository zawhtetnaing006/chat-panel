export class NewMessageEvent {
  constructor(
    public readonly user_id: string,
    public readonly room_id: string,
    public readonly text_message: string,
  ) {}
}
