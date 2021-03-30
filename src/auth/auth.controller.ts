import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiUnauthorizedResponse, ApiBody } from '@nestjs/swagger';
import { ResponseObject } from 'src/models/dtos/response-base.dto';
import { LoginBody, LoginDTO, RegisterBody, RegisterDTO } from 'src/models/dtos/user.dto';
import { IAuthResponse } from 'src/models/interfaces/auth';

import { AuthService } from './auth.service';

@Controller('users')
export class AuthController {
  constructor(private _authService: AuthService) {}

  @Post()
  @ApiCreatedResponse({ description: 'User Registration' })
  @ApiBody({ type: RegisterBody })
  async register(@Body(ValidationPipe) credentials: RegisterDTO): Promise<ResponseObject<'user', IAuthResponse>> {
    const user = await this._authService.register(credentials);

    return { user };
  }

  @Post('/login')
  @ApiOkResponse({ description: 'User Login' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiBody({ type: LoginBody })
  async login(@Body('user', ValidationPipe) credentials: LoginDTO): Promise<ResponseObject<'user', IAuthResponse>> {
    const user = await this._authService.login(credentials);

    return { user };
  }
}
