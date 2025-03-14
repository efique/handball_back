import { Controller, Get, HttpStatus, Req, Res } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { Request, Response } from 'express';
import { Public } from 'src/decorators/publicdecorator';
import { UsersService } from 'src/services/users.service';
import { RoleAppEnum } from 'src/models/user.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly usersService: UsersService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('firstadmin')
  @Public()
  async getFirstAdmin(@Res({ passthrough: true }) res: Response) {
    const user = await this.usersService.createUser({ username: process.env.ADMIN_USERNAME, password: process.env.ADMIN_PASSWORD, role: RoleAppEnum.ADMIN });
    res.status(HttpStatus.CREATED);
    return user;
  }
}
