import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { UpdateUserDTO } from 'src/models/dtos/user.dto';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private _userRepository: Repository<UserEntity>,
  ) {}

  async findByUsername(username: string): Promise<UserEntity> {
    try {
      const user = await this._userRepository.findOne({ where: { username } });

      if (!user) {
        throw new NotFoundException();
      }

      return user;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async updateUser(username: string, data: UpdateUserDTO) {
    try {
      await this._userRepository.update({ username }, data);

      return this.findByUsername(username);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
