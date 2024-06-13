import { ApiProperty } from '@nestjs/swagger';

export class sendMessageDto {
  textMessage: string;
  @ApiProperty({
    type: 'array',
    items: {
      description: 'file message',
      type: 'string',
      format: 'binary',
    },
  })
  fileMessages: Express.Multer.File[];
}
