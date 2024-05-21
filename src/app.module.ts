import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomModule } from './room/room.module';
import { UserModule } from './user/user.module';
import { MessageModule } from './message/message.module';
import { TextMessageModule } from './text-message/text-message.module';
import { FileMessageModule } from './file-message/file-message.module';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    RoomModule,
    UserModule,
    MessageModule,
    TextMessageModule,
    FileMessageModule,
    AuthModule,
    PrismaModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
