import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { LoginDTO, RegisterDTO } from 'src/models/user.dto';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private _userRepository: Repository<UserEntity>,
  ) {}

  async register(data: RegisterDTO) {
    try {
      const user = this._userRepository.create(data);

      await user.save();

      return user;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username or Email has already been taken');
      }

      throw new InternalServerErrorException();
    }
  }

  async login(data: LoginDTO) {
    try {
      const user = await this._userRepository.findOne({
        where: { email: data.email },
      });

      const passwordIsValid = await user.comparePassword(data.password);

      if (!passwordIsValid) {
        return new UnauthorizedException('Invalid credentials');
      }

      return user;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
