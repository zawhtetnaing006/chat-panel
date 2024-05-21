import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { findAllMessageDto } from './dto/find-all-message.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class MessageService {
  constructor(private readonly prismaService: PrismaService) {}
  async sendMessage(room_id: string, user_id: string, text_message: string) {
    const message = await this.prismaService.message.create({
      data: {
        user: {
          connect: {
            id: user_id,
          },
        },
        room: {
          connect: {
            id: room_id,
          },
        },
        text_message: {
          create: {
            content: text_message,
          },
        },
      },
      include: {
        text_message: {
          select: {
            content: true,
          },
        },
      },
    });
    return message;
  }

  async findAll(room_id: string, findAllMessageDto: findAllMessageDto) {
    const page = Number.parseInt(findAllMessageDto.page);
    const take = Number.parseInt(findAllMessageDto.perPage);
    const skip = take * (page - 1);
    const result = this.prismaService.message.findMany({
      where: {
        room_id: room_id,
      },
      include: {
        text_message: {
          select: {
            content: true,
          },
        },
      },
      take,
      skip,
      orderBy: {
        created_at: Prisma.SortOrder.desc,
      },
    });
    return result;
  }
}
