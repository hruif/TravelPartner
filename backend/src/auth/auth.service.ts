import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from './dto/user.dto';
import { EntityManager, MikroORM } from '@mikro-orm/postgresql';
import { User } from '../users/user.entity';

/**
 * Service for handling authentication.
 */
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
  ) {}

  /**
   * Validates a user's credentials.
   *
   * @param {string} uuid - The uuid of the user.
   * @param {string} pass - The password of the user.
   * @returns {Promise<any>} A user object without the password if valid, otherwise null.
   */
  async validateUser(uuid: string, pass: string): Promise<any> {
    const user = await this.em.findOne<User>(User, { uuid });
    if (user && user.password === pass) {
      const { uuid, ...result } = user; // Remove password from result
      return result;
    }
    return null;
  }

  /**
   * Authenticates a user and returns an access token.
   *
   * @param {UserDto} userDto - The login credentials (email and password).
   * @returns {Promise<{ access_token: string }>} A JWT access token.
   * @throws {NotFoundException} If the user with the given email is not found.
   * @throws {UnauthorizedException} If the password is incorrect.
   */
  async login(userDto: UserDto): Promise<{ access_token: string }> {
    const { email, password } = userDto;

    // Find user by email
    const user = await this.em.findOne<User>(User, { email });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.password !== password) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = { uuid: user.uuid };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * Registers a new user and returns an access token.
   *
   * @param {UserDto} createUserDto - The user's registration details.
   * @returns {Promise<{ access_token: string }>} A JWT access token upon successful registration.
   * @throws {ConflictException} If a user with the same email already exists.
   */
  async signup(createUserDto: UserDto): Promise<{ access_token: string }> {
    const existingUser = await this.em.findOne(User, {
      email: createUserDto.email,
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const user = new User(createUserDto.email, createUserDto.password);
    this.em.persist(user);
    await this.em.flush();

    const payload = { uuid: user.uuid };
    return { access_token: this.jwtService.sign(payload) };
  }
}
