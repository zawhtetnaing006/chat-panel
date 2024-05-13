import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { RoomModule } from 'src/room/room.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [RoomModule, PrismaModule],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
