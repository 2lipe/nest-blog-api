import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateArticleDTO {
  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty()
  body: string;

  @IsString()
  @ApiProperty()
  description: string;

  @IsArray()
  @ApiProperty()
  tagList: string[];
}

export class CreateArticleBody {
  @ApiProperty()
  article: CreateArticleDTO;
}

export class UpdateArticleDTO {
  @IsString()
  @IsOptional()
  @ApiProperty()
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  body: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  description: string;

  @IsArray()
  @IsOptional()
  @ApiProperty()
  tagList: string[];
}

export class UpdateArticleBody {
  @ApiProperty()
  article: UpdateArticleDTO;
}
