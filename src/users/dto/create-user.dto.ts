import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email!: string; // Added ! here

  @IsNotEmpty()
  @IsString()
  name!: string; // Added ! here

  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password!: string; // Added ! here
}