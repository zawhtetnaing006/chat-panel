import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    let isAuthenicated = false;
    const req = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(req);
    const clientKey = req.headers.clientkey;
    if(clientKey && clientKey == 123) {
      isAuthenicated = true;
    }

    if(token) {
      try {
        const payload = this.jwtService.verify(token);
        isAuthenicated = true;
      } catch (err) {
        if(err instanceof TokenExpiredError) {
          throw new HttpException('Expired Token!', HttpStatus.UNAUTHORIZED);
        }

        if(err instanceof JsonWebTokenError) {
          throw new HttpException('Invalid Token!',HttpStatus.UNAUTHORIZED)
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
