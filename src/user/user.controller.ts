import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { findAllUserDto } from './dto/find-all-user.dto';
import { ApiResponse } from 'src/helper/api-response';
import { User } from './entities/user.entity';

@Controller('user')
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOkResponse({ type: User })
  async create(@Body() createUserDto: CreateUserDto) {
    const result = await this.userService.create(createUserDto);
    return new ApiResponse(
      ['Successfully created user.'],
      HttpStatus.CREATED,
      result,
    );
  }

  @Get()
  @ApiOkResponse({ type: User, isArray: true })
  async findAll(@Query() findAllUserDto: findAllUserDto) {
    const page = findAllUserDto.page;
    const perPage = Number.parseInt(findAllUserDto.perPage);
    const users = await this.userService.findAll(findAllUserDto);
    const totalCount = await this.userService.count();
    return new ApiResponse(['Successfully found all users.'], HttpStatus.OK, {
      data: users,
      currentPage: page,
      totalPage: Math.ceil(totalCount / perPage),
    });
  }

  @Get(':id')
  @ApiOkResponse({ type: User })
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(id);
    if (!user) {
      return new ApiResponse(['User not found'], HttpStatus.NOT_FOUND);
    }
    return new ApiResponse(
      ['Successfully found the user.'],
      HttpStatus.OK,
      user,
    );
  }

  @Patch(':id')
  @ApiOkResponse({ type: User })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    let user = await this.userService.findOne(id);
    if (!user) {
      return new ApiResponse(['User not found'], HttpStatus.NOT_FOUND);
    }
    user = await this.userService.update(id, updateUserDto);
    if (user) {
      return new ApiResponse(
        ['Successfully updated user.'],
        HttpStatus.OK,
        user,
      );
    } else {
      return new ApiResponse(['User update failed.'], HttpStatus.NOT_MODIFIED);
    }
  }

  @Delete(':id')
  @ApiOkResponse({ type: User })
  async remove(@Param('id') id: string) {
    let user = await this.userService.findOne(id);
    if (!user) {
      return new ApiResponse(['User not found'], HttpStatus.NOT_FOUND);
    }
    user = await this.userService.remove(id);
    if (user) {
      return new ApiResponse(
        ['Successfully deleted user.'],
        HttpStatus.OK,
        user,
      );
    } else {
      return new ApiResponse(['User delete failed.'], HttpStatus.NOT_MODIFIED);
    }
  }
}
