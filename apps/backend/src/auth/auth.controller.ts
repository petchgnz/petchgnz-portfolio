import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LoginDto } from 'src/auth/dto/login.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { JwtRefreshGuard } from 'src/auth/guards/jwt-refresh.guard';
import { JwtRefreshPayload } from 'src/auth/interfaces/auth.interfaces';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserWithoutPassword } from 'src/users/users.service';

interface RequestWithUser extends Request {
  user: UserWithoutPassword;
}

interface RequestWithRefresh extends Request {
  user: JwtRefreshPayload;
}
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // -- POST /auth/register -------------------------------------------------
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  // -- POST /auth/login ----------------------------------------------------
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // -- POST /auth/logout ---------------------------------------------------
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard) // use this guard becuz we need to send refreshToken
  logout(@Req() req: RequestWithRefresh) {
    return this.authService.logout(req.user.refreshToken);
  }

  // -- POST /auth/logout-all -----------------------------------------------
  @Post('logout-all')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard) // use this guard becuz we need to use accessToken
  logoutAll(@Req() req: RequestWithUser) {
    return this.authService.logoutAll(req.user.id);
  }

  // -- POST /auth/refresh --------------------------------------------------
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard) // use this becuz we need to send refreshToken to regenerate new tokens
  refresh(@Req() req: RequestWithRefresh) {
    return this.authService.refreshTokens(req.user.sub, req.user.refreshToken);
  }
}
