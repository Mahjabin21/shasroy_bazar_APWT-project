import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { User } from '../users/entities/user.entity.js';
import { Administrator } from '../administrator/entities/administrator.entity.js';

import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { AdminLoginDto } from './dto/admin-login.dto.js';

import { Merchant } from '../merchants/entities/merchant.entity.js';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Administrator)
    private readonly administratorRepository: Repository<Administrator>,

    @InjectRepository(Merchant)
    private readonly merchantRepository: Repository<Merchant>,

    private readonly jwtService: JwtService,
  ) {}

  // USER REGISTRATION
  async register(registerDto: RegisterDto) {

    // Check whether the mobile number already exists
    const existingUser = await this.userRepository.findOne({
      where: {
        mobileNumber: registerDto.mobileNumber,
      },
    });

    if (existingUser) {
      throw new BadRequestException(
        'Mobile number is already registered',
      );
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

  // USER LOGIN
  async login(loginDto: LoginDto) {

    // Find the user using the mobile number
    const user = await this.userRepository.findOne({
      where: {
        mobileNumber: loginDto.mobileNumber,
      },
    });

    // Check whether the user exists
    if (!user) {
      throw new UnauthorizedException(
        'Invalid mobile number or PIN',
      );
    }
    // Check whether the user account is active
    if (user.accountStatus !== 'active') {
    throw new UnauthorizedException(
         'User account is inactive',
    );
   }

    // Compare entered PIN with stored hashed PIN
    const isPinValid = await bcrypt.compare(
      loginDto.pin,
      user.pinHash,
    );

    if (!isPinValid) {
      throw new UnauthorizedException(
        'Invalid mobile number or PIN',
      );
    }

    // Information stored inside the User JWT token
    const payload = {
      sub: user.userId,
      mobileNumber: user.mobileNumber,
      role: 'user',
      accountType: 'user',
    };

    // Generate JWT token
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      message: 'Login successful',
      accessToken,
    };
  }


  
// MERCHANT LOGIN
async merchantLogin(loginDto: LoginDto) {

  // Find the user using the mobile number
  const user = await this.userRepository.findOne({
    where: {
      mobileNumber: loginDto.mobileNumber,
    },
  });

  // Check whether the user exists
  if (!user) {
    throw new UnauthorizedException(
      'Invalid mobile number or PIN',
    );
  }

  // Check whether the linked User account is active
  if (user.accountStatus !== 'active') {
    throw new UnauthorizedException(
      'User account is inactive',
    );
  }

  // Verify the PIN
  const isPinValid = await bcrypt.compare(
    loginDto.pin,
    user.pinHash,
  );

  if (!isPinValid) {
    throw new UnauthorizedException(
      'Invalid mobile number or PIN',
    );
  }

  // Find the merchant linked to this user
  const merchant = await this.merchantRepository.findOne({
    where: {
      user: {
        userId: user.userId,
      },
    },
  });

  // Check whether merchant registration exists
  if (!merchant) {
    throw new UnauthorizedException(
      'Merchant account not found',
    );
  }

  // Check merchant approval status
  if (merchant.status !== 'approved') {
    throw new UnauthorizedException(
      `Merchant account is ${merchant.status}`,
    );
  }

  // Create Merchant JWT payload
  const payload = {
    sub: user.userId,
    merchantId: merchant.merchantId,
    role: 'merchant',
    accountType: 'merchant',
  };

  // Generate JWT token
  const accessToken = await this.jwtService.signAsync(payload);

  return {
    message: 'Merchant login successful',
    accessToken,
    merchant: {
      merchantId: merchant.merchantId,
      businessName: merchant.businessName,
      businessCategory: merchant.businessCategory,
    },
  };
}


  // ADMINISTRATOR LOGIN
  async adminLogin(adminLoginDto: AdminLoginDto) {

    // Find administrator using email
    const administrator = await this.administratorRepository.findOne({
      where: {
        email: adminLoginDto.email,
      },
    });

    // Check whether administrator exists
    if (!administrator) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    // Check administrator account status
    if (administrator.adminStatus !== 'active') {
      throw new UnauthorizedException(
        'Administrator account is inactive',
      );
    }

    // Compare entered password with stored password hash
    const isPasswordValid = await bcrypt.compare(
      adminLoginDto.password,
      administrator.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    // Information stored inside the Administrator JWT token
    const payload = {
      sub: administrator.adminId,
      role: 'admin',
      email: administrator.email,
      accountType: 'administrator',
    };

    // Generate JWT token
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      message: 'Administrator login successful',
      accessToken,
    };
  }
}
