import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service.js';
import { CreateOrganizationDto } from './dto/create-organization.dto.js';
import { UpdateOrganizationDto } from './dto/update-organization.dto.js';
import { Organization } from './entities/organization.entity.js';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post('create-organization')
  async createOrganization(
    @Body() org: CreateOrganizationDto,
  ): Promise<Organization> {
    return await this.organizationsService.createOrganization(org);
  }

  @Get()
  async getAllOrganizations(): Promise<Organization[]> {
    return await this.organizationsService.getAllOrganizations();
  }

  @Get(':id')
  async getOrganizationById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Organization> {
    return await this.organizationsService.getOrganizationById(id);
  }

  @Patch('update-organization/:id')
  async updateOrganization(
    @Param('id', ParseIntPipe) id: number,
    @Body() org: UpdateOrganizationDto,
  ): Promise<string> {
    return await this.organizationsService.updateOrganization(id, org);
  }

  @Patch('verify-organization/:id')
  async verifyOrganization(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<string> {
    return await this.organizationsService.verifyOrganization(id);
  }

  @Delete(':id')
  async deleteOrganization(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<string> {
    return await this.organizationsService.deleteOrganization(id);
  }
}