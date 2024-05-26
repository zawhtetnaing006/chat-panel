import { Injectable, Logger } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { findAllRoomDto } from './dto/find-all-room.dto';
import { Prisma, Room, User } from '@prisma/client';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger(RoomService.name);
  async create(createRoomDto: CreateRoomDto): Promise<Room | null> {
    const data: any = {
      name: createRoomDto.name
    };
    if(Array.isArray(createRoomDto.users) && createRoomDto.users.length > 0) {
      data.users = {
        create: createRoomDto.users.map((user) => {
          return {
            user: {
              connect: {
                id: user,
              },
            },
          };
        }),
      }
    }
    let room;
    try {
      room = await this.prisma.room.create({
        data: data,
        include: {
          users: true,
        },
      });
    } catch (error) {
      this.logger.error('Error while creating room!',error);
      room = null;
    }
    return room;
  }

  async findAll(findAllRoomDto: findAllRoomDto): Promise<Room[]> {
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

  async count(): Promise<number> {
    const count = await this.prisma.room.count();
    return count;
  }

  async findOne(id: string, messageCount: string = '10'): Promise<Room | null> {
    const room = await this.prisma.room.findUnique({
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
          orderBy: {
            created_at: Prisma.SortOrder.desc,
          },
        },
        messages: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                nickname: true,
              },
            },
            text_message: {
              select: {
                content: true,
              },
            },
          },
          take: Number.parseInt(messageCount),
          orderBy: {
            created_at: Prisma.SortOrder.desc,
          },
        },
      },
    });
    return room;
  }

  async update(id: string, updateRoomDto: UpdateRoomDto): Promise<Room | null> {
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

  async remove(id: string): Promise<Room | null> {
    const result = await this.prisma.room.update({
      where: { id },
      data: { deleted_at: new Date() },
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
        messages: true,
      },
    });

    return result;
  }

  async join(user_id: User['id'], room_id: Room['id']): Promise<Room | null> {
    const existingRoom = await this.prisma.userRoom.findFirst({
      where: {
        room_id,
        user_id,
      },
    });

    if (!existingRoom) {
      const result = await this.prisma.userRoom.create({
        data: {
          user_id,
          room_id,
        },
      });
      if (!result) {
        return null;
      }
    }

    const room = await this.prisma.room.findFirst({
      where: {
        id: room_id,
      },
      include: {
        users: true,
        messages: true,
      },
    });
    return room;
  }
}
