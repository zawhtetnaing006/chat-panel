import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}
  create(createRoomDto: CreateRoomDto) {
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
    return this.prisma.room.create({
      data: data,
      include: {
        users: true,
      },
    });
    return 'This action adds a new room';
  }

  findAll() {
    return `This action returns all room`;
  }

  findOne(id: number) {
    return `This action returns a #${id} room`;
  }

  update(id: number, updateRoomDto: UpdateRoomDto) {
    return `This action updates a #${id} room`;
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }
}
