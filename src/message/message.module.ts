import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { RoomModule } from 'src/room/room.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MessageGateway } from './message.gateway';

@Module({
  imports: [RoomModule, PrismaModule],
  controllers: [MessageController],
  providers: [MessageService, MessageGateway],
})
export class MessageModule {}
