import { ApiProperty } from '@nestjs/swagger';

export class sendMessageDto {
  textMessage?: string;
  @ApiProperty({
    required: false,
    type: 'array',
    items: {
      description: 'file message',
      type: 'string',
      format: 'binary',
    },
  })
  fileMessages: Express.Multer.File[];
}
