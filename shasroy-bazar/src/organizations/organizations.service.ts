import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity.js';
import { CreateOrganizationDto } from './dto/create-organization.dto.js';
import { UpdateOrganizationDto } from './dto/update-organization.dto.js';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private readonly orgRepo: Repository<Organization>,
  ) {}

  async createOrganization(org: CreateOrganizationDto): Promise<Organization> {
    try {
      const newOrg = await this.orgRepo.create(org);
      return await this.orgRepo.save(newOrg);
    } catch {
      throw new BadRequestException('Organization creation failed');
    }
  }

  async getAllOrganizations(): Promise<Organization[]> {
    return await this.orgRepo.find();
  }

  async getOrganizationById(id: number): Promise<Organization> {
    const org = await this.orgRepo.findOne({
      where: {
        org_id: id,
      },
    });
    if (!org) {
      throw new NotFoundException(`Organization with id ${id} not found`);
    }
    return org;
  }

  async updateOrganization(
    id: number,
    org: UpdateOrganizationDto,
  ): Promise<string> {
    const result = (await this.orgRepo.update(id, org)).affected;
    if (result != undefined && result > 0) {
      return `Organization updated with id ${id}`;
    } else {
      throw new NotFoundException(`Organization with id ${id} not found`);
    }
  }

  async verifyOrganization(id: number): Promise<string> {
    const result = (
      await this.orgRepo.update(id, {
        organization_status: 'verified',
        verified_at: new Date(),
      })
    ).affected;
    if (result != undefined && result > 0) {
      return `Organization verified with id ${id}`;
    } else {
      throw new NotFoundException(`Organization with id ${id} not found`);
    }
  }

  async deleteOrganization(id: number): Promise<string> {
    const result = (await this.orgRepo.delete(id)).affected;
    if (result != null && result > 0) {
      return `Organization deleted with id ${id}`;
    } else {
      throw new NotFoundException(`Organization with id ${id} not found`);
    }
  }
}