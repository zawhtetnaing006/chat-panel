import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  private user: User;
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}
  async init(user: User) {
    const jwt_token = await this.jwtService.signAsync(user);
    return jwt_token;
  }

  async verify(token: string) {
    const payload = await this.jwtService.verify(token);
    return payload;
  }
}
