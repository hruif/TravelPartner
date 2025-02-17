import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserDto {
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
