import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.decorator';
import { UserEntity } from 'src/entities/user.entity';
import { ProfileViewModel } from 'src/models/view-models/profile.view-model';
import { UserService } from './user.service';

@Controller('profiles')
export class ProfileController {
  constructor(private _userService: UserService) {}

  @Get('/:username')
  async findProfile(@Param('username') username: string): Promise<UserEntity> {
    const user = await this._userService.findByUsername(username);

    return user;
  }

  @Post('/:username/follow')
  @UseGuards(AuthGuard())
  async followUser(@User() user: UserEntity, @Param('username') username: string): Promise<ProfileViewModel> {
    const profile = await this._userService.followUser(user, username);

    return profile;
  }

  @Delete('/:username/follow')
  @UseGuards(AuthGuard())
  async unfollowUser(@User() user: UserEntity, @Param('username') username: string): Promise<ProfileViewModel> {
    const profile = await this._userService.unfollowUser(user, username);

    return profile;
  }
}
