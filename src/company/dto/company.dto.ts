import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsInt,
  IsOptional,
  ArrayNotEmpty,
  ArrayUnique,
} from 'class-validator';

export class CompanyDto {
  @IsString()
  @MinLength(2, { message: 'Name must have at least 2 characters.' })
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @MinLength(2, { message: 'CEO must have at least 2 characters.' })
  ceo: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please provide valid Email.' })
  email: string;

   @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  userIds?: number[];
}

