import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtRefreshStrategy.extractJWTFromCookie,
      ]),
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: process.env.JWT_REFRESH_SECRET,
    });
  }

  private static extractJWTFromCookie(req: Request): string | null {
    if (
      req?.cookies['auth-cookie'] &&
      req?.cookies['auth-cookie'].refresh_token
    ) {
      return req?.cookies['auth-cookie'].refresh_token;
    }
    return null;
  }

  async validate(req: Request, payload: any) {
    if (!req?.cookies['auth-cookie'].refresh_token) {
      throw new UnauthorizedException();
    }
    if (payload == null) {
      throw new UnauthorizedException();
    }

    return { userId: payload.sub, username: payload.username };
  }
}
