import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuid } from 'uuid';
import { findAllUserDto } from './dto/find-all-user.dto';
import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger(UserService.name);
  async create(createUserDto: CreateUserDto) {
    const user = {
      id: uuid(),
      nickname: createUserDto.nickname,
    };
    const result = await this.prisma.user.create({ data: user });
    return result;
  }

  async findAll(findAllUserDto: findAllUserDto) {
    const page = Number.parseInt(findAllUserDto.page);
    const perPage = Number.parseInt(findAllUserDto.perPage);
    const skip = (page - 1) * perPage;
    const users = await this.prisma.user.findMany({
      skip,
      take: perPage,
      orderBy: {
        created_at: Prisma.SortOrder.desc,
      },
    });
    return users;
  }

  async count() {
    const count = await this.prisma.user.count();
    return count;
  }

  async findOne(id: string) {
    let user;
    try {
      user = await this.prisma.user.findUnique({
        where: {
          id,
        },
      });
    } catch (e) {
      this.logger.log('Error while finding user!', e);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const result = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: updateUserDto,
    });
    return result;
  }

  async remove(id: string) {
    const result = await this.prisma.user.update({
      where: { id },
      data: { deleted_at: new Date() },
    });

    return result;
  }
}
