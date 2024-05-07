import { Module } from '@nestjs/common';
import { FileMessageService } from './file-message.service';
import { FileMessageController } from './file-message.controller';

@Module({
  controllers: [FileMessageController],
  providers: [FileMessageService],
})
export class FileMessageModule {}
