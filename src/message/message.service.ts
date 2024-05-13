import { Injectable } from '@nestjs/common';
import { sendMessageDto } from './dto/send-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { send } from 'process';

@Injectable()
export class MessageService {
  constructor(private readonly prismaService: PrismaService) {}
  async sendMessage(room_id: string, user_id: string, sendMessageDto: sendMessageDto) {
    const message = await this.prismaService.message.create({
      data: {
        user: {
          connect: {
            id: user_id
          }
        },
        room: {
          connect: {
            id: room_id
          }
        },
        text_message: {
          create: {
            content: sendMessageDto.textMessage
          }
        }
      },
      include: {
        text_message: {
          select: {
            content: true
          }
        },
      },
    });
    return message;
  }
}
