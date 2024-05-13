import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext) {
    let isAuthenicated = false;
    const req = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(req);
    const { apiSecret, user_id } = this.extractUserFromClientKey(
      req.headers.clientkey,
    );
    if (apiSecret && apiSecret == process.env.API_SECRET) {
      const result = await this.userService.findOne(user_id);
      req.user = result;
      isAuthenicated = true;
    }

    if (token && isAuthenicated === false) {
      try {
        const payload = this.jwtService.verify(token);
        req.user = payload;
        isAuthenicated = true;
      } catch (err) {
        if (err instanceof TokenExpiredError) {
          throw new HttpException('Expired Token!', HttpStatus.UNAUTHORIZED);
        }

        if (err instanceof JsonWebTokenError) {
          throw new HttpException('Invalid Token!', HttpStatus.UNAUTHORIZED);
        }
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
