import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {

  @IsEmail({}, { message: 'Please provide a valid email.' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must have at least 6 characters.' })
  @MaxLength(12, { message: 'Password maximum length can be 12 only.' })
  password: string;

}
