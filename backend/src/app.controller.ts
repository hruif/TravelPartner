import { Controller, Get, Request, Post } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import {Public} from "./auth/constants";

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Public()
  @Get()
  getHello(): string {
    return 'very nice!';
  }
}
