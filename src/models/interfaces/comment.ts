import { UserEntity } from 'src/entities/user.entity';
import { IProfileResponse } from './profile';

export interface ICommentResponse {
  id: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  body: string;
  author: IProfileResponse | UserEntity;
}
