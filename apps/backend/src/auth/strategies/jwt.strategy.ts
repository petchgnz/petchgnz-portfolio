import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService, UserWithoutPassword } from 'src/users/users.service';
import { JwtPayload } from 'src/auth/interfaces/auth.interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      // get the token from - Authorization: Bearer <token> header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // set this to false to reject the expired token
      ignoreExpiration: false,

      secretOrKey: configService.get<string>('JWT_SECRET') as string,
    });
  }

  async validate(payload: JwtPayload): Promise<UserWithoutPassword> {
    const user = await this.usersService.findById(payload.sub);

    if (!user) throw new UnauthorizedException('User no longer exist');

    // the return value will be automatically bound to request.user by passport
    return user;
  }
}
