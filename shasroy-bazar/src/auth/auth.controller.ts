import { Controller, Body, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { AdminLoginDto } from './dto/admin-login.dto.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { ApiBody } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}



  @ApiBody({
  schema: {
    example: {
      fullName: 'Test Customer',
      mobileNumber: '01712345678',
      dateOfBirth: '2002-05-15',
      pin: '1234',
      termsConsent: true,
    },
  },
})
  // User registration endpoint
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  // User login endpoint
  @ApiBody({
  schema: {
    example: {
      mobileNumber: '01712345678',
      pin: '1234',
    },
  },
})
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // Merchant login endpoint
  @ApiBody({
  schema: {
    example: {
      mobileNumber: '01712345678',
      pin: '1234',
    },
  },
})
@Post('merchant-login')
  @Post('merchant-login')
  merchantLogin(@Body() loginDto: LoginDto) {
    return this.authService.merchantLogin(loginDto);
  }

  // Administrator login endpoint
  @ApiBody({
  schema: {
    example: {
      email: 'admin@example.com',
      password: 'Admin@123',
    },
  },
})
  @Post('admin-login')
  adminLogin(@Body() adminLoginDto: AdminLoginDto) {
    return this.authService.adminLogin(adminLoginDto);
  }

  // Logout endpoint (works for user, merchant and administrator tokens).
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  logout() {
    return {
      message: 'Logout successful. Please delete the access token on the client.',
    };
  }
}