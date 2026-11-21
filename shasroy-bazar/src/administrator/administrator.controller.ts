import {
  Controller,
  UseGuards,
  Get,
  Patch,
  Param,
  Body,
  ParseIntPipe,
  Request as NestRequest,
} from '@nestjs/common';

import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import type { Request } from 'express';

import { AdministratorService } from './administrator.service.js';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { RejectMerchantDto } from './dto/reject-merchant.dto.js';
import { UpdateEkycStatusDto } from './dto/update-ekyc-status.dto.js';

type AuthenticatedAdminRequest = Request & {
  user: {
    adminId: number;
    email: string;
    role: string;
    accountType: string;
  };
};

@ApiBearerAuth('JWT-auth')
@Controller('administrator')
export class AdministratorController {
  constructor(
    private readonly administratorService: AdministratorService,
  ) {}

  // ADMIN TEST
  @Get('admin-test')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  adminTest() {
    return {
<<<<<<< HEAD
      message: 'Administrators accessed this route',
=======
      message: 'Only administrators can access this route',
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
    };
  }

  // VIEW PENDING MERCHANTS
  @Get('merchants/pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getPendingMerchants() {
    return this.administratorService.getPendingMerchants();
  }

  // APPROVE MERCHANT
  @Patch('merchants/:id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  approveMerchant(
    @Param('id', ParseIntPipe) merchantId: number,
    @NestRequest() req: AuthenticatedAdminRequest,
  ) {
    return this.administratorService.approveMerchant(
      merchantId,
      req.user.adminId,
    );
  }

  // REJECT MERCHANT APPLICATION
  @ApiBody({
  schema: {
    example: {
      reason: 'Submitted documents are incomplete.',
    },
  },
})
  @Patch('merchants/:id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  rejectMerchant(
    @Param('id', ParseIntPipe) merchantId: number,
    @NestRequest() req: AuthenticatedAdminRequest,
    @Body() rejectMerchantDto: RejectMerchantDto,
  ) {
    return this.administratorService.rejectMerchant(
      merchantId,
      req.user.adminId,
      rejectMerchantDto,
    );
  }

  @Get('merchants')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getAllMerchants() {
    return this.administratorService.getAllMerchants();
  }

  //..... eKYC VERIFICATION

  // VIEW PENDING eKYC APPLICATIONS
  @Get('ekyc/pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getPendingEkyc() {
    return this.administratorService.getPendingEkyc();
  }

  // VIEW ONE eKYC APPLICATION
  @Get('ekyc/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getEkycById(@Param('id', ParseIntPipe) ekycId: number) {
    return this.administratorService.getEkycById(ekycId);
  }

  // APPROVE OR REJECT AN eKYC APPLICATION
  @ApiBody({
  schema: {
    example: {
      status: 'verified',
    },
  },
})
  @Patch('ekyc/:id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  updateEkycStatus(
    @Param('id', ParseIntPipe) ekycId: number,
    @Body() updateEkycStatusDto: UpdateEkycStatusDto,
  ) {
    return this.administratorService.updateEkycStatus(
      ekycId,
      updateEkycStatusDto,
    );
  }
}