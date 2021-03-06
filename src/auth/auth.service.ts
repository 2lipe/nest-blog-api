import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { LoginDTO, RegisterDTO } from 'src/models/dtos/user.dto';
import { IAuthResponse } from 'src/models/interfaces/auth';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private _userRepository: Repository<UserEntity>,
    private _jwtService: JwtService,
  ) {}

  async register(data: RegisterDTO): Promise<IAuthResponse> {
    try {
      const user = this._userRepository.create(data);

      const token = await this.jwtToken(user);

      await user.save();

      return { ...user.toJSON(), token };
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username or Email has already been taken');
      }

      throw new InternalServerErrorException();
    }
  }

  async login(data: LoginDTO): Promise<IAuthResponse> {
    try {
      const user = await this._userRepository.findOne({
        where: { email: data.email },
      });

      const passwordIsValid = await user.comparePassword(data.password);

      if (!passwordIsValid) {
        throw new UnauthorizedException();
      }

      const token = await this.jwtToken(user);

      return { ...user.toJSON(), token };
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async findCurrentUser(username: string): Promise<IAuthResponse> {
    try {
      const user = await this._userRepository.findOne({ where: { username } });

      const payload = { username };

      const token = this._jwtService.sign(payload);

      return { ...user.toJSON(), token };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  private async jwtToken(user: UserEntity): Promise<string> {
    const payload = { username: user.username };

    return await this._jwtService.signAsync(payload);
  }
}
