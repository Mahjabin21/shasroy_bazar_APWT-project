
import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { ServiceZonesService } from './service-zones.service.js';
import { CreateServiceZoneDto } from './dto/create-service-zone.dto.js';
import { UpdateServiceZoneDto } from './dto/update-service-zone.dto.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';

@ApiBearerAuth('JWT-auth')
@Controller('service-zones')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class ServiceZonesController {
  constructor(
    private readonly serviceZonesService: ServiceZonesService,
  ) {}

  // Create a new service zone
  @ApiBody({
    schema: {
      example: {
        zoneName: 'Dhanmondi',
        boundaryDefinition: 'Dhanmondi service boundary',
        zoneStatus: 'active',
      },
    },
  })
  @Post()
  create(
    @Body() dto: CreateServiceZoneDto,
    @Req() req: any,
  ) {
    return this.serviceZonesService.create(
      dto,
      req.user.adminId,
    );
  }

  // Get all service zones
  @Get()
  findAll() {
    return this.serviceZonesService.findAll();
  }

  // Get one service zone by ID
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.serviceZonesService.findOne(id);
  }

  // Update zone information
  @ApiBody({
    schema: {
      example: {
        zoneName: 'Dhanmondi Updated',
        boundaryDefinition: 'Updated service boundary',
        zoneStatus: 'active',
      },
    },
  })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateServiceZoneDto,
  ) {
    return this.serviceZonesService.update(id, dto);
  }

  // Activate or deactivate a zone
  @ApiBody({
    schema: {
      example: {
        zoneStatus: 'inactive',
      },
    },
  })
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('zoneStatus') status: string,
  ) {
    return this.serviceZonesService.updateStatus(id, status);
  }
}
