import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';

import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly reflector: Reflector,
  ) {}
  readonly logger = new Logger(AuthGuard.name);
  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }

    let isAuthenicated = false;
    const req = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(req);
    const { apiSecret, user_id } = this.extractUserFromClientKey(
      req.headers.clientkey,
    );
    if (apiSecret && apiSecret == process.env.API_SECRET) {
      if (user_id) {
        const result = await this.userService.findOne(user_id);
        if (result?.deleted_at) {
          throw new HttpException(
            'This user is suspended!',
            HttpStatus.UNAUTHORIZED,
          );
        }
        req.user = result;
      }
      isAuthenicated = true;
    }

    if (token && isAuthenicated === false) {
      try {
        const payload = this.jwtService.verify(token);
        req.user = payload;
        isAuthenicated = true;
      } catch (err) {
        this.logger.log(err);
        isAuthenicated = false;
      }
    }
    return isAuthenicated;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private extractUserFromClientKey(clientkey: string) {
    const [apiSecret, user_id] = clientkey?.split('.') ?? [];
    return {
      apiSecret,
      user_id,
    };
  }
}
