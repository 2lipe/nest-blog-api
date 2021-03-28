import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('profiles')
export class ProfileController {
  constructor(private _userService: UserService) {}

  @Get('/:username')
  async findProfile(@Param('username') username: string) {
    return await this._userService.findByUsername(username);
  }
}
