import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../modules/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwtrefreshtoken.strategy';
import { AuthGuardProvider } from './guards/jwt.guard';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtService,
    JwtStrategy,
    JwtRefreshStrategy,
    AuthGuardProvider,
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
