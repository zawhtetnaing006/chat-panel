import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  async init(user: User) {
    const jwt_token = await this.jwtService.signAsync(user);
    return jwt_token;;
  }

  async verify(token: string) {
    const payload = await this.jwtService.verify(token);
    return payload;
  }
}
