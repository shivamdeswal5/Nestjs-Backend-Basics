import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @MinLength(10)
  body: string;

  @IsNotEmpty()
  image: string;

  @IsArray()
  @ArrayMinSize(2)
  tags: string[];

  @IsNotEmpty()
  userId: number;
}
