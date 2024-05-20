import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RoomGateway } from './room.gateway';

@Module({
  imports: [PrismaModule],
  controllers: [RoomController],
  exports: [RoomService],
  providers: [RoomService, RoomGateway],
})
export class RoomModule {}
