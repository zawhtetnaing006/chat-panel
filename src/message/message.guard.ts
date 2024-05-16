import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessageGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    if (!req.user) {
      throw new HttpException(
        'Invalid token or incomplete client key! Missing user info',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!req.params.room_id) {
      throw new HttpException('Invalid room!', HttpStatus.BAD_REQUEST);
    }

    const room = await this.prismaService.room.findFirst({
      where: {
        id: req.params.roomd_id,
        users: {
          every: {
            user_id: req.user.id,
          },
        },
      },
    });
    if (!room)
      throw new HttpException(
        'The room does not belong to the logged in user',
        HttpStatus.FORBIDDEN,
      );
    return true;
  }
}
