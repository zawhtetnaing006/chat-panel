import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { findAllRoomDto } from './dto/find-all-room.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}
  async create(createRoomDto: CreateRoomDto) {
    const data = {
      name: createRoomDto.name,
      users: {
        create: createRoomDto.users.map((user) => {
          return {
            user: {
              connect: {
                id: user,
              },
            },
          };
        }),
      },
    };
    let room;
    try {
      room = await this.prisma.room.create({
        data: data,
        include: {
          users: true,
        },
      });
    } catch ({ name, message }) {
      room = null;
    }
    return room;
  }

  async findAll(findAllRoomDto: findAllRoomDto) {
    const page = Number.parseInt(findAllRoomDto.page);
    const perPage = Number.parseInt(findAllRoomDto.perPage);
    const skip = (page - 1) * perPage;
    const rooms = await this.prisma.room.findMany({
      skip,
      take: perPage,
      orderBy: {
        created_at: Prisma.SortOrder.desc,
      },
      include: {
        users: {
          select: {
            user: {
              select: {
                id: true,
                nickname: true,
              },
            },
            created_at: true,
          },
        },
      },
    });
    return rooms;
  }

  findOne(id: string) {
    const room = this.prisma.room.findUnique({
      where: {
        id,
      },
      include: {
        users: {
          select: {
            user: {
              select: {
                id: true,
                nickname: true,
              },
            },
            created_at: true,
          },
        },
      },
    });
    return room;
  }

  async update(id: string, updateRoomDto: UpdateRoomDto) {
    const result = await this.prisma.room.update({
      where: {
        id: id,
      },
      data: updateRoomDto,
      include: {
        users: {
          select: {
            user: {
              select: {
                id: true,
                nickname: true,
              },
            },
            created_at: true,
          },
        },
      },
    });
    return result;
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }
}
