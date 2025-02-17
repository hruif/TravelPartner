import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const mockAuthService = {
      signup: jest.fn().mockResolvedValue({ access_token: 'mockAccessToken' }),
      login: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should return an access token', async () => {
      const result = await controller.signup({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result).toEqual({ access_token: 'mockAccessToken' });
      expect(authService.signup).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  describe('login', () => {
    it('should return an access token when credentials are correct', async () => {
      authService.login = jest
        .fn()
        .mockResolvedValue({ access_token: 'mockAccessToken' });

      const result = await controller.login({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result).toEqual({ access_token: 'mockAccessToken' });
      expect(authService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should throw NotFoundException if user is not found', async () => {
      authService.login = jest
        .fn()
        .mockRejectedValue(new NotFoundException('User not found'));

      await expect(
        controller.login({
          email: 'notfound@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow(NotFoundException);
      expect(authService.login).toHaveBeenCalledWith({
        email: 'notfound@example.com',
        password: 'password123',
      });
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      authService.login = jest
        .fn()
        .mockRejectedValue(new UnauthorizedException('Invalid password'));

      await expect(
        controller.login({
          email: 'test@example.com',
          password: 'wrongpassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
      expect(authService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'wrongpassword',
      });
    });
  });
});
