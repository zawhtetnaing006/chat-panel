import { Module } from '@nestjs/common';
import { TextMessageService } from './text-message.service';
import { TextMessageController } from './text-message.controller';

@Module({
  controllers: [TextMessageController],
  providers: [TextMessageService],
})
export class TextMessageModule {}
