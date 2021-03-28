import { UserEntity } from 'src/entities/user.entity';

export class ProfileViewModel {
  username: string;
  bio: string;
  image: string;
  following: UserEntity[];
}
