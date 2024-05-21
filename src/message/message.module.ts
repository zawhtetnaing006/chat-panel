import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { RoomModule } from 'src/room/room.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MessageGateway } from './message.gateway';
import { Listeners } from './listeners';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [RoomModule, PrismaModule, AuthModule],
  controllers: [MessageController],
  providers: [MessageService, MessageGateway, ...Listeners],
})
export class MessageModule {}
