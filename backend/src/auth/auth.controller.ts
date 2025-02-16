import { Body, Controller, Post } from '@nestjs/common';
import { Public } from './constants';
import { UserDto } from './dto/user.dto';
import { AuthService } from './auth.service';

/**
 * Controller for handling authentication-related requests.
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Signup a user with the given credentials and return an access token.
   *
   * @throws {201} Created user and access token
   * @throws {409} User already exists
   */
  @Public()
  @Post('signup')
  async signup(
    @Body() createUserDto: UserDto,
  ): Promise<{ access_token: string }> {
    return this.authService.signup(createUserDto);
  }

  /**
   * Login a user with the given credentials and return an access token.
   *
   * @throws {201} Created access token
   * @throws {401} Invalid password
   * @throws {404} User not found
   */
  @Public()
  @Post('login')
  async login(
    @Body() createUserDto: UserDto,
  ): Promise<{ access_token: string }> {
    return this.authService.login(createUserDto);
  }
}
