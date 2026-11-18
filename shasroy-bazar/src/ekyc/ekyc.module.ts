import { Module } from '@nestjs/common';
import { EkycService } from './ekyc.service.js';
import { EkycController } from './ekyc.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EkycVerification } from './entities/ekyc-verification.entity.js';
import { User } from '../users/entities/user.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([User,EkycVerification])],
  controllers: [EkycController],
  providers: [EkycService],
})
export class EkycModule {}