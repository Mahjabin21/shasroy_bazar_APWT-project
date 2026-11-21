
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Organization } from './entities/organization.entity.js';
import { Administrator } from '../administrator/entities/administrator.entity.js';
import { User } from '../users/entities/user.entity.js';

import { CreateOrganizationDto } from './dto/create-organization.dto.js';
import { UpdateOrganizationDto } from './dto/update-organization.dto.js';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private readonly orgRepo: Repository<Organization>,

    @InjectRepository(Administrator)
    private readonly adminRepo: Repository<Administrator>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // CREATE ORGANIZATION APPLICATION BY USER
  async createOrganization(
    org: CreateOrganizationDto,
    userId: number,
  ) {
    const user = await this.userRepo.findOne({
      where: { userId },
    });

    if (!user || user.accountStatus !== 'active') {
      throw new NotFoundException('Active user account not found');
    }

    const existingOrganization = await this.orgRepo.findOne({
      where: {
        user: { userId },
      },
    });

    if (existingOrganization) {
      throw new ConflictException(
        'You have already submitted an organization application',
      );
    }

    const newOrg = this.orgRepo.create({
      org_name: org.org_name,
      contact_person: org.contact_person,
      contact_phone: org.contact_phone,
      organization_status: 'pending',
      user,
    });

    const savedOrg = await this.orgRepo.save(newOrg);

    // Return only necessary information to the User
    return {
      message: 'Organization registration submitted successfully',

      organization: {
        org_id: savedOrg.org_id,
        org_name: savedOrg.org_name,
        contact_person: savedOrg.contact_person,
        contact_phone: savedOrg.contact_phone,
        organization_status: savedOrg.organization_status,
        verified_at: savedOrg.verified_at,

        user: {
          userId: user.userId,
          fullName: user.fullName,
          mobileNumber: user.mobileNumber,
        },
      },
    };
  }
// GET ALL ORGANIZATIONS
async getAllOrganizations(): Promise<Organization[]> {
  return await this.orgRepo.find({
    relations: {
      user: true,
      verifiedByAdmin: true,
    },
    select: {
      org_id: true,
      org_name: true,
      contact_person: true,
      contact_phone: true,
      organization_status: true,
      verified_at: true,

      user: {
        userId: true,
        fullName: true,
        mobileNumber: true,
        dateOfBirth: true,
        role: true,
        registrationStatus: true,
        ekycStatus: true,
        accountStatus: true,
        termsConsent: true,
        createdAt: true,
      },

      verifiedByAdmin: {
        adminId: true,
        fullName: true,
        email: true,
        roleTier: true,
        adminStatus: true,
      },
    },
  });
}

  // GET ORGANIZATION BY ID
  async getOrganizationById(id: number): Promise<Organization> {
    const org = await this.orgRepo.findOne({
      where: { org_id: id },
      relations: {
        user: true,
        verifiedByAdmin: true,
      },
    });

    if (!org) {
      throw new NotFoundException(
        `Organization with id ${id} not found`,
      );
    }

    return org;
  }

  // UPDATE ORGANIZATION
  async updateOrganization(
    id: number,
    org: UpdateOrganizationDto,
  ): Promise<string> {
    const existingOrg = await this.orgRepo.findOne({
      where: { org_id: id },
    });

    if (!existingOrg) {
      throw new NotFoundException(
        `Organization with id ${id} not found`,
      );
    }

    Object.assign(existingOrg, org);

    await this.orgRepo.save(existingOrg);

    return `Organization updated with id ${id}`;
  }

  // VERIFY ORGANIZATION BY ADMINISTRATOR
  async verifyOrganization(
    id: number,
    adminId: number,
  ): Promise<string> {
    const organization = await this.orgRepo.findOne({
      where: { org_id: id },
    });

    if (!organization) {
      throw new NotFoundException(
        `Organization with id ${id} not found`,
      );
    }

    if (organization.organization_status !== 'pending') {
      throw new ConflictException(
        `Organization is already ${organization.organization_status}`,
      );
    }

    const administrator = await this.adminRepo.findOne({
      where: { adminId },
    });

    if (!administrator) {
      throw new NotFoundException(
        `Administrator with id ${adminId} not found`,
      );
    }

    organization.organization_status = 'verified';
    organization.verified_at = new Date();
    organization.verifiedByAdmin = administrator;

    await this.orgRepo.save(organization);

    return `Organization verified successfully with id ${id}`;
  }

  // DELETE ORGANIZATION
  async deleteOrganization(id: number): Promise<string> {
    const result = await this.orgRepo.delete(id);

    if (!result.affected || result.affected === 0) {
      throw new NotFoundException(
        `Organization with id ${id} not found`,
      );
    }

    return `Organization deleted with id ${id}`;
  }
}
