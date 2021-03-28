import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { UpdateUserDTO } from 'src/models/dtos/user.dto';
import { ProfileViewModel } from 'src/models/view-models/profile.view-model';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private _userRepository: Repository<UserEntity>,
  ) {}

  async findByUsername(username: string, user?: UserEntity): Promise<UserEntity> {
    try {
      const userFound = await (
        await this._userRepository.findOne({ where: { username }, relations: ['followers'] })
      ).toProfile(user);

      if (!userFound) {
        throw new NotFoundException();
      }

      return userFound;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async updateUser(username: string, data: UpdateUserDTO) {
    try {
      await this._userRepository.update({ username }, data);

      const user = await this.findByUsername(username);

      return { user };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async followUser(currentUser: UserEntity, username: string): Promise<ProfileViewModel> {
    try {
      const user = await this._userRepository.findOne({
        where: { username },
        relations: ['followers'],
      });

      user.followers.push(currentUser);

      await user.save();

      return user.toProfile(currentUser);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async unfollowUser(currentUser: UserEntity, username: string): Promise<ProfileViewModel> {
    try {
      const user = await this._userRepository.findOne({
        where: { username },
        relations: ['followers'],
      });

      user.followers = user.followers.filter((follower) => follower !== currentUser);

      await user.save();

      return user.toProfile(currentUser);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
