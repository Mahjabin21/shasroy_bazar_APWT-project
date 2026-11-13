import {BadRequestException,Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Check whether the mobile number already exists
    const existingUser = await this.userRepository.findOne({
      where: {
        mobileNumber: registerDto.mobileNumber,
      },
    });

    if (existingUser) {
      throw new BadRequestException('Mobile number is already registered');
    }

    // Hash the PIN before saving it
    const pinHash = await bcrypt.hash(registerDto.pin, 10);

    // Create the new user
    const user = this.userRepository.create({
      fullName: registerDto.fullName,
      mobileNumber: registerDto.mobileNumber,
      dateOfBirth: registerDto.dateOfBirth,
      pinHash: pinHash,
      termsConsent: registerDto.termsConsent,
    });

    // Save the user to the database
    const savedUser = await this.userRepository.save(user);

    // Never return the PIN or PIN hash
    return {
      message: 'User registered successfully',
      userId: savedUser.userId,
      fullName: savedUser.fullName,
      mobileNumber: savedUser.mobileNumber,
    };
  }

   //..............
  //login process
  async login(loginDto: LoginDto) {
  // Find the user using the mobile number
  const user = await this.userRepository.findOne({
    where: {
      mobileNumber: loginDto.mobileNumber,
    },
  });

  // Check whether the user exists
  if (!user) {
    throw new UnauthorizedException('Invalid mobile number or PIN',);
  }

  // Compare the entered PIN with the stored hashed PIN
  const isPinValid = await bcrypt.compare(
    loginDto.pin,
    user.pinHash,
  );

  //if invalid mobile number or pin occurs
  if (!isPinValid) {
    throw new UnauthorizedException('Invalid mobile number or PIN',);
  }

  // Information stored inside the JWT token
  const payload = {
    sub: user.userId,
    mobileNumber: user.mobileNumber,
    role: user.role,
  };

  // Generate JWT token
  const accessToken = await this.jwtService.signAsync(payload);

  return {
    message: 'Login successful',
    accessToken,
  };
}
}