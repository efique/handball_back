import { Controller, Get, Req, Res } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { Request, Response } from 'express';
import { Public } from 'src/decorators/publicdecorator';
import { UsersService } from 'src/services/users.service';
import { RoleAppEnum } from 'src/models/user.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly usersService: UsersService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('firstadmin')
  @Public()
  getFirstAdmin(@Req() req: Request) {
    this.usersService.createUser({username: 'admin', password: 'admin', role: RoleAppEnum.ADMIN});
    return req.user;
  }
}
