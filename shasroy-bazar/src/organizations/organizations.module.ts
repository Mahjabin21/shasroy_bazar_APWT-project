
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrganizationsService } from './organizations.service.js';
import { OrganizationsController } from './organizations.controller.js';

import { Organization } from './entities/organization.entity.js';
import { Administrator } from '../administrator/entities/administrator.entity.js';
import { User } from '../users/entities/user.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Organization,
      Administrator,
      User,
    ]),
  ],
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
