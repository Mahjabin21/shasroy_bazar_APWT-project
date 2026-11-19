import { UsersService } from './users.service.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import type { Request } from 'express';
import { SelectZoneDto } from './dto/select-zone.dto.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Patch,
  UseGuards,
  Request as NestRequest,
  Body,
  Req,
} from '@nestjs/common';

type AuthenticatedRequest = Request & {
  user: {
    userId: number;
    mobileNumber: string;
    role: string;
  };
};

@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@NestRequest() req: AuthenticatedRequest) {
    return {
      message: 'Protected profile route',
      user: req.user,
    };
  }

  // List active service zones (regular users only)
  @Get('zones')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  getActiveZones() {
    return this.usersService.getActiveZones();
  }

  @ApiBody({
  schema: {
    example: {
      zoneId: 1,
    },
  },
})
  @Patch('select-zone')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  selectZone(@Req() req: any, @Body() dto: SelectZoneDto) {
    return this.usersService.selectZone(req.user.userId, dto);
  }

  @Get('selected-zone')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  getSelectedZone(@NestRequest() req: AuthenticatedRequest) {
    return this.usersService.getSelectedZone(req.user.userId);
  }
}