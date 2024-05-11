import { User } from 'src/user/entities/user.entity';

export class Room {
  id: string;
  name: string;
  users: {
    user: User;
    created_at: Date;
  };
}
