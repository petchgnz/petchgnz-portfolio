import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { JwtRefreshPayload } from 'src/auth/interfaces/auth.interfaces';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET') as string,

      // this will pass raw request into the validate() below
      // cuz we need to check the refreshToken
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    payload: JwtRefreshPayload,
  ): Promise<JwtRefreshPayload> {
    const authHeader = req.headers.authorization;

    if (!authHeader) throw new UnauthorizedException('No authorization header');

    // del 'bearer ' and we will get only refreshToken
    const refreshToken = authHeader.replace('Bearer ', '').trim();

    // this will put into the request.user
    return {
      sub: payload.sub,
      email: payload.email,
      refreshToken,
    };
  }
}
