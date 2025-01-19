import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWTFromCookie,
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  private static extractJWTFromCookie(req: Request): string | null {
    if (
      req?.cookies['auth-cookie'] &&
      req?.cookies['auth-cookie'].access_token
    ) {
      return req?.cookies['auth-cookie'].access_token;
    }
    return null;
  }

  async validate(payload: any) {
    if (payload == null) {
      throw new UnauthorizedException();
    }

    return { userId: payload.sub, username: payload.username };
  }
}
