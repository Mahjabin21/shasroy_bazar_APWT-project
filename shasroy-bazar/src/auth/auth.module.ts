import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdministratorModule } from '../administrator/administrator.module.js';
import { MerchantsModule } from '../merchants/merchants.module.js';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    AdministratorModule,
    MerchantsModule,

    PassportModule.register({
      defaultStrategy: 'jwt',
    }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret:
          configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '1d',
        },
      }),
    }),
  ],

controllers: [AuthController],
providers: [AuthService, JwtStrategy],
exports: [JwtModule, PassportModule],
})
export class AuthModule {}