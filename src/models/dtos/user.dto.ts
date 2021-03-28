import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDTO {
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  username: string;

  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  @MinLength(4)
  password: string;
}

export class LoginDTO {
  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  @MinLength(4)
  password: string;
}

export class UpdateUserDTO {
  @IsEmail()
  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  image: string;

  @IsOptional()
  @IsString()
  bio: string;
}
