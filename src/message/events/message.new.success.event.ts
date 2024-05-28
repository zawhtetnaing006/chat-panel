import { Message } from '@prisma/client';

export class NewMessageSuccessEvent {
  constructor(public readonly message: Message) {}
}
