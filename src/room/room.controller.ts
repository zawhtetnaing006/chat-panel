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
  Request,
  HttpException,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { findAllRoomDto } from './dto/find-all-room.dto';
import { Room } from './entities/room.entity';
import { ApiResponse } from 'src/helper/api-response';

@Controller('room')
@ApiTags('Rooms')
@ApiBearerAuth()
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @ApiOkResponse({ type: Room })
  async create(@Body() createRoomDto: CreateRoomDto) {
    const result = await this.roomService.create(createRoomDto);
    if (!result) {
      return new ApiResponse(
        ['Failed to create room! Please confirm that you use valid user ids'],
        HttpStatus.BAD_REQUEST,
      );
    }
    return new ApiResponse(
      ['Room successfully crated!'],
      HttpStatus.CREATED,
      result,
    );
  }

  @Post(':room_id/join')
  async join(@Param('room_id') room_id: string, @Request() req) {
    if (!req.user) {
      throw new HttpException(
        'Invalid token or incomplete client key! Missing user info',
        HttpStatus.BAD_REQUEST,
      );
    }

    const room = await this.roomService.findOne(room_id);
    if (!room) {
      return new ApiResponse(['Room not found!'], HttpStatus.NOT_FOUND);
    }

    const result = await this.roomService.join(req.user.id, room_id);
    if (!result) {
      return new ApiResponse(
        ['Failed to join room!'],
        HttpStatus.EXPECTATION_FAILED,
      );
    }

    return result;
  }

  @Get()
  @ApiOkResponse({ type: Room, isArray: true })
  async findAll(@Query() findAllRoomDto: findAllRoomDto) {
    const page = findAllRoomDto.page;
    const perPage = Number.parseInt(findAllRoomDto.perPage);
    const totalCount = await this.roomService.count();
    const rooms = await this.roomService.findAll(findAllRoomDto);
    return new ApiResponse(['Successfully found all rooms!'], HttpStatus.OK, {
      data: rooms,
      currentPage: page,
      totalPage: Math.ceil(totalCount / perPage),
    });
  }

  @Get(':id')
  @ApiOkResponse({ type: Room })
  async findOne(@Param('id') id: string) {
    const room = await this.roomService.findOne(id);
    if (!room) {
      return new ApiResponse(['Room not found!'], HttpStatus.NOT_FOUND);
    }
    return new ApiResponse(
      ['Successfully found the room!'],
      HttpStatus.OK,
      room,
    );
  }

  @Patch(':id')
  @ApiOkResponse({ type: Room })
  async update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    let room = await this.roomService.findOne(id);
    if (!room) {
      return new ApiResponse(['Room not found!'], HttpStatus.NOT_FOUND);
    }
    room = await this.roomService.update(id, updateRoomDto);
    if (!room) {
      return new ApiResponse(['Room update failed.'], HttpStatus.NOT_MODIFIED);
    }
    return new ApiResponse(
      ['Successfully updated the room!'],
      HttpStatus.OK,
      room,
    );
  }

  @Delete(':id')
  @ApiOkResponse({ type: Room })
  async remove(@Param('id') id: string) {
    let room = await this.roomService.findOne(id);
    if (!room) {
      return new ApiResponse(['Room not found!'], HttpStatus.NOT_FOUND);
    }
    room = await this.roomService.remove(id);
    return room;
  }
}
