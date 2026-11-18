import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../../users/entities/user.entity.js';
import { Merchant } from '../../merchants/entities/merchant.entity.js';
import { Administrator } from '../../administrator/entities/administrator.entity.js';

import type { JwtPayload } from '../interfaces/jwt-payload.interface.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(
  private configService: ConfigService,

  @InjectRepository(User)
  private readonly userRepository: Repository<User>,

  @InjectRepository(Merchant)
  private readonly merchantRepository: Repository<Merchant>,

  @InjectRepository(Administrator)
   private readonly administratorRepository: Repository<Administrator>,
) {
       const jwtSecret = configService.get<string>('JWT_SECRET');

  if (!jwtSecret) {
    throw new Error('JWT_SECRET is missing from environment variables');
  }

  super({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    ignoreExpiration: false,
    secretOrKey: jwtSecret,
  });
}
  async validate(payload: JwtPayload) {

  // USER
  if (payload.accountType === 'user') {

    const user = await this.userRepository.findOneBy({
      userId: payload.sub,
    });

    if (!user || user.accountStatus !== 'active') {
      throw new UnauthorizedException('User account is inactive or not found');
    }

    return {
      userId: user.userId,
      mobileNumber: user.mobileNumber,
      role: payload.role,
      accountType: payload.accountType,
    };
  }

  // MERCHANT
  if (payload.accountType === 'merchant') {

    const merchant = await this.merchantRepository.findOne({
      where: {
        merchantId: payload.merchantId,
        user: {
          userId: payload.sub,
        },
      },
      relations: {
        user: true,
      },
    });

    if (!merchant || merchant.status !== 'approved') {
      throw new UnauthorizedException('Merchant account is not approved or not found');
    }

    if (merchant.user.accountStatus !== 'active') {
      throw new UnauthorizedException('Linked user account is inactive');
    }

    return {
      userId: merchant.user.userId,
      merchantId: merchant.merchantId,
      role: payload.role,
      accountType: payload.accountType,
    };
  }

  // ADMINISTRATOR
  if (payload.accountType === 'administrator') {

    const administrator = await this.administratorRepository.findOneBy({
      adminId: payload.sub,
    });

    if (!administrator || administrator.adminStatus !== 'active') {
      throw new UnauthorizedException('Administrator account is inactive or not found');
    }

    return {
      adminId: administrator.adminId,
      email: administrator.email,
      role: payload.role,
      accountType: payload.accountType,
    };
  }

  throw new UnauthorizedException('Invalid account type');
}
}
