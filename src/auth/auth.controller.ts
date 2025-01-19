import { Controller, Post, UseGuards, Get, Req, Res } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { Public } from 'src/decorators/publicdecorator';
import { LocalAuthGuard } from './guards/local.guard';
import { Request, Response } from 'express';
import { Throttle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
import { RefreshTokenGuard } from './guards/refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Throttle({ short: { limit: 2, ttl: 1000 }, long: { limit: 5, ttl: 60000 } })
  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  async login(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    try {
      const tokens = await this.authService.getTokens(
        req.user.id,
        req.user.username,
      );
      res
        .cookie('auth-cookie', tokens, {
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
        })
        .send({
          status: 'Logged in successfully',
          // user: {
          //   id: req.user.id,
          //   username: req.user.username,
          //   role: req.user.role,
          // },
        });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }

  @Get('logout')
  logout(@Res() res: Response) {
    try {
      res
        .clearCookie('auth-cookie')
        .send({ status: 'Logged out successfully' });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }

  @Get('profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }

  @Get('refresh')
  @UseGuards(RefreshTokenGuard)
  @Public()
  async refreshToken(@Req() req: Request, @Res() res: Response): Promise<void> {
    try {
      const tokens = await this.authService.getTokens(
        req.user.id,
        req.user.username,
      );

      res
        .cookie('auth-cookie', tokens, {
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
        })
        .send({
          status: 'Tokens refreshed successfully',
        });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
}
