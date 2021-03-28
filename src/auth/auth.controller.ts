import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { LoginDTO, RegisterDTO } from 'src/models/dtos/user.dto';
import { AuthService } from './auth.service';

@Controller('users')
export class AuthController {
  constructor(private _authService: AuthService) {}

  @Post()
  register(@Body(ValidationPipe) credentials: RegisterDTO) {
    const user = this._authService.register(credentials);

    return user;
  }

  @Post('/login')
  login(@Body(ValidationPipe) credentials: LoginDTO) {
    const user = this._authService.login(credentials);

    return user;
  }
}
