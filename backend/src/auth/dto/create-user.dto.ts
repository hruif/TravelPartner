import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  /**
   * Valid email address
   */
  @IsEmail()
  email: string;

  /**
   * 8 characters long password
   */
  @IsNotEmpty()
  password: string;
}
