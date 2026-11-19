import { Body, Controller, Get, Post, Request as NestRequest, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import type { Request } from 'express';
import { EkycService } from './ekyc.service.js';
import { SubmitEkycDto } from './dto/submit-ekyc.dto.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';

type AuthenticatedRequest = Request & {
  user: {
    userId: number;
  };
};

@ApiBearerAuth('JWT-auth')
@Controller('ekyc')
export class EkycController {
  constructor(private readonly ekycService: EkycService) {}

  // Submit eKYC (regular users only)
  @Post('submit')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  submitEkyc(
    @NestRequest() req: AuthenticatedRequest,
    @Body() submitEkycDto: SubmitEkycDto,
  ) {
    return this.ekycService.submitEkyc(req.user.userId, submitEkycDto);
  }

  // Check the logged-in user's own eKYC status
  @Get('status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  getVerificationStatus(@NestRequest() req: AuthenticatedRequest) {
    return this.ekycService.getVerificationStatus(req.user.userId);
  }
}