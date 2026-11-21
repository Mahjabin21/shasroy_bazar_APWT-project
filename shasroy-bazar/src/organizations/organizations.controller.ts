
import {
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { OrganizationsService } from './organizations.service.js';
import { CreateOrganizationDto } from './dto/create-organization.dto.js';
import { UpdateOrganizationDto } from './dto/update-organization.dto.js';

import { Organization } from './entities/organization.entity.js';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';

@Controller('organizations')
@ApiBearerAuth('JWT-auth')
export class OrganizationsController {
  constructor(
    private readonly organizationsService: OrganizationsService,
  ) {}

  // USER: APPLY FOR ORGANIZATION ACCOUNT
  @ApiBody({
    schema: {
      example: {
        org_name: 'Food Aid Foundation',
        contact_person: 'Karim Ahmed',
        contact_phone: '01712345678',
      },
    },
  })
  @Post('create-organization')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  async createOrganization(
    @Body() org: CreateOrganizationDto,
    @Req() req: any,
  ) {
    return await this.organizationsService.createOrganization(
      org,
      req.user.userId,
    );
  }

  // ADMIN: GET ALL ORGANIZATIONS
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getAllOrganizations(): Promise<Organization[]> {
    return await this.organizationsService.getAllOrganizations();
  }

  // ADMIN: GET ORGANIZATION BY ID
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getOrganizationById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Organization> {
    return await this.organizationsService.getOrganizationById(id);
  }

  // ADMIN: UPDATE ORGANIZATION
  @ApiBody({
    schema: {
      example: {
        org_name: 'Food Aid Foundation Updated',
        contact_person: 'Karim Ahmed',
        contact_phone: '01712345678',
      },
    },
  })
  @Patch('update-organization/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updateOrganization(
    @Param('id', ParseIntPipe) id: number,
    @Body() org: UpdateOrganizationDto,
  ): Promise<string> {
    return await this.organizationsService.updateOrganization(id, org);
  }

  // ADMIN: VERIFY ORGANIZATION
  @Patch('verify-organization/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async verifyOrganization(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ): Promise<string> {
    return await this.organizationsService.verifyOrganization(
      id,
      req.user.adminId,
    );
  }

  // ADMIN: DELETE ORGANIZATION
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async deleteOrganization(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<string> {
    return await this.organizationsService.deleteOrganization(id);
  }
}
