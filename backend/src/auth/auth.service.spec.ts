import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import {
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { MikroORM, EntityManager } from '@mikro-orm/postgresql';
import { User } from '../users/user.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let entityManager: EntityManager;

  beforeEach(async () => {
    const mockOrm = {
      em: {
        findOne: jest.fn(),
        persist: jest.fn(),
        flush: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mocked_token'),
          },
        },
        {
          provide: MikroORM,
          useValue: mockOrm,
        },
        {
          provide: EntityManager,
          useFactory: (orm: MikroORM) => orm.em,
          inject: [MikroORM],
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    entityManager = module.get<EntityManager>(EntityManager);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should return a token if credentials are valid', async () => {
      const mockUser = {
        email: 'test@example.com',
        password: 'password',
      } as User;
      jest.spyOn(entityManager, 'findOne').mockResolvedValue(mockUser);

      const result = await authService.login({
        email: 'test@example.com',
        password: 'password',
      });

      expect(result).toEqual({ access_token: 'mocked_token' });
      expect(entityManager.findOne).toHaveBeenCalledWith(User, {
        email: 'test@example.com',
      });
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(entityManager, 'findOne').mockResolvedValue(null);

      await expect(
        authService.login({ email: 'test@example.com', password: 'password' }),
      ).rejects.toThrow(NotFoundException);

      expect(entityManager.findOne).toHaveBeenCalledWith(User, {
        email: 'test@example.com',
      });
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const mockUser = {
        email: 'test@example.com',
        password: 'correct_password',
      } as User;
      jest.spyOn(entityManager, 'findOne').mockResolvedValue(mockUser);

      await expect(
        authService.login({
          email: 'test@example.com',
          password: 'wrong_password',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('signup', () => {
    it('should create a new user and return a token', async () => {
      jest.spyOn(entityManager, 'findOne').mockResolvedValue(null);
      jest.spyOn(entityManager, 'persist').mockImplementation();
      jest.spyOn(entityManager, 'flush').mockImplementation();

      const result = await authService.signup({
        email: 'test@example.com',
        password: 'password',
      });

      expect(result).toEqual({ access_token: 'mocked_token' });
      expect(entityManager.persist).toHaveBeenCalled();
      expect(entityManager.flush).toHaveBeenCalled();
    });

    it('should throw ConflictException if user already exists', async () => {
      const existingUser = {
        email: 'test@example.com',
        password: 'password',
      } as User;
      jest.spyOn(entityManager, 'findOne').mockResolvedValue(existingUser);

      await expect(
        authService.signup({ email: 'test@example.com', password: 'password' }),
      ).rejects.toThrow(ConflictException);
    });
  });
});
