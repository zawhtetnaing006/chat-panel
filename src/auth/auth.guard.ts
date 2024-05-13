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
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    let isAuthenicated = false;
    const req = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(req);
    const clientKey = req.headers.clientkey;
    if (clientKey && clientKey == process.env.CLIENT_KEY) {
      isAuthenicated = true;
    }

    if (token && isAuthenicated === false) {
      try {
        const payload = this.jwtService.verify(token);
        this.authService.setUser(payload);
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
}
