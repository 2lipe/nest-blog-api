import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserEntity } from 'src/entities/user.entity';
import { IAuthPayload } from 'src/models/interfaces/auth-payload';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity)
    private _userRepository: Repository<UserEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: IAuthPayload) {
    const { username } = payload;

    const user = this._userRepository.find({ where: { username } });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
