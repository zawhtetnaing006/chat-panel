import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { ApiResponse } from 'src/helper/api-response';
import { UserService } from 'src/user/user.service';

@Controller('auth')
@ApiTags('Auth')
@ApiBearerAuth()
@ApiHeader({
  name: 'clientkey',
  description: 'api-key-for-chat-panel',
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('/init/:id')
  async init(@Body() createAuthDto: CreateAuthDto) {
    const user = await this.userService.findOne(createAuthDto.user_id);
    if (!user) {
      return new ApiResponse(['User not found!'], HttpStatus.NOT_FOUND);
    }
    const jwt_token = await this.authService.init(user);
    return new ApiResponse(['Successfully authenticated!'], HttpStatus.OK, {
      token: jwt_token,
    });
  }
}
