import { Body, Controller, Post } from '@nestjs/common';
import { Public } from './constants';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  async signup(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ access_token: string }> {
    console.log('testing' + createUserDto);
    return this.authService.signup(createUserDto);
  }
}
