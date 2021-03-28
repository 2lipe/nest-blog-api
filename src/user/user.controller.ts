import { Body, Controller, Get, Put, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.decorator';
import { UserEntity } from 'src/entities/user.entity';
import { UpdateUserDTO } from 'src/models/dtos/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private _userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard())
  async findUser(@User() { username }: UserEntity) {
    const user = await this._userService.findByUsername(username);

    return { user };
  }

  @Put()
  @UseGuards(AuthGuard())
  async update(
    @User() { username }: UserEntity,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    data: { user: UpdateUserDTO },
  ) {
    const user = await this._userService.updateUser(username, data.user);

    return { user };
  }
}
