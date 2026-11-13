import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { Body,Post } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  //register endpoint
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }


  //login endpoint
  @Post('login')
  login(@Body() loginDto: LoginDto) {
  return this.authService.login(loginDto);
}
}
