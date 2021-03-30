import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCommentDTO {
  @IsString()
  @ApiProperty()
  body: string;
}

export class CreateCommentBody {
  @ApiProperty()
  comment: CreateCommentDTO;
}
