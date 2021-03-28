import {
  Body,
  Controller,
  Get,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
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
  async findUser(@User() user: UserEntity) {
    return await this._userService.findByUsername(user.username);
  }

  @Put()
  @UseGuards(AuthGuard())
  async update(
    @User() user: UserEntity,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    data: UpdateUserDTO,
  ) {
    return await this._userService.updateUser(user.username, data);
  }
}
