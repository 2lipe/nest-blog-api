import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { LoginDTO, RegisterDTO } from 'src/models/dtos/user.dto';
import { AuthService } from './auth.service';

@Controller('users')
export class AuthController {
  constructor(private _authService: AuthService) {}

  @Post()
  register(@Body(ValidationPipe) credentials: RegisterDTO) {
    return this._authService.register(credentials);
  }

  @Post('/login')
  login(@Body(ValidationPipe) credentials: LoginDTO) {
    return this._authService.login(credentials);
  }
}
