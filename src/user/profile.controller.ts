import { Controller, Delete, Get, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OptionalAuthGuard } from 'src/auth/configs/optional-auth.guard';
import { User } from 'src/auth/user.decorator';
import { UserEntity } from 'src/entities/user.entity';
import { UserService } from './user.service';

@Controller('profiles')
export class ProfileController {
  constructor(private _userService: UserService) {}

  @Get('/:username')
  @UseGuards(new OptionalAuthGuard())
  async findProfile(@Param('username') username: string, @User() user: UserEntity) {
    const profile = await this._userService.findByUsername(username, user);

    return { profile };
  }

  @Post('/:username/follow')
  @HttpCode(200)
  @UseGuards(AuthGuard())
  async followUser(@User() user: UserEntity, @Param('username') username: string) {
    const profile = await this._userService.followUser(user, username);

    return { profile };
  }

  @Delete('/:username/follow')
  @UseGuards(AuthGuard())
  async unfollowUser(@User() user: UserEntity, @Param('username') username: string) {
    const profile = await this._userService.unfollowUser(user, username);

    return { profile };
  }
}
