import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthTokens, JwtPayload } from 'src/auth/interfaces/auth.interfaces';
import { LoginDto } from 'src/auth/dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // region Register
  async register(dto: CreateUserDto) {
    const user = await this.usersService.create(dto);
    return this.generateTokens(user.id, user.email)
  }

  // region Login
  async login(dto: LoginDto): Promise<AuthTokens> {
    // use findByEmail because it's return user's password
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) throw new UnauthorizedException('Invalid credential');

    // check if the password is correct or not
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    return this.generateTokens(user.id, user.email);
  }

  // region Logout (single device)
  async logout(refreshToken: string): Promise<void> {
    // delete only incoming refreshToken (only 1 device)
    await this.prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
  }

  // region Logout All Device
  async logoutAll(userId: string): Promise<void> {
    // delete all refreshTokens from incoming userId
    await this.prisma.refreshToken.deleteMany({ where: { userId } });
  }

  // region Refresh Token
  async refreshTokens(
    userId: string,
    refreshToken: string,
  ): Promise<AuthTokens> {
    // find refreshToken in db
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (
      !storedToken ||
      storedToken.userId !== userId ||
      storedToken.expiresAt < new Date()
    )
      throw new UnauthorizedException('Invalid or Expired refresh token');

    // delete old tokens in db
    await this.prisma.refreshToken.delete({ where: { id: storedToken.id } });

    // return this function to generate the new token
    return this.generateTokens(storedToken.user.id, storedToken.user.email);
  }

  // region Helpers
  // Helpers: Generate Tokens
  private async generateTokens(
    userId: string,
    email: string,
  ): Promise<AuthTokens> {
    const payload: JwtPayload = { sub: userId, email };

    const accessTokenOptions: JwtSignOptions = {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN') as any,
    }

    const refreshTokenOptions: JwtSignOptions = {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') as any,
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({...payload}, accessTokenOptions),
      this.jwtService.signAsync({...payload}, refreshTokenOptions),
    ]);

    const refreshExpiresIn = this.configService.get<string>(
      'JWT_REFRESH_EXPIRES_IN',
    );
    const expiresAt = new Date();

    // Calculate expires date
    expiresAt.setDate(expiresAt.getDate() + parseInt(refreshExpiresIn!));

    // save to 'refreshTokens' table in db
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt,
      },
    });

    return { accessToken, refreshToken };
  }
}
