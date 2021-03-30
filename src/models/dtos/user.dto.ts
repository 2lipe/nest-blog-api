import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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

export class RegisterBody {
  @ApiProperty()
  user: RegisterDTO;
}

export class UpdateUserBody {
  @ApiProperty()
  user: UpdateUserDTO;
}

export class LoginBody {
  @ApiProperty()
  user: LoginDTO;
}
