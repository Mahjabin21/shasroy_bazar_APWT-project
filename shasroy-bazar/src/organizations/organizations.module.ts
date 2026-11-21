<<<<<<< HEAD

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
=======
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationsService } from './organizations.service.js';
import { OrganizationsController } from './organizations.controller.js';
import { Organization } from './entities/organization.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Organization])],
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
  exports: [OrganizationsService],
})
<<<<<<< HEAD
export class OrganizationsModule {}
=======
export class OrganizationsModule {}
>>>>>>> a9c1a7ad7c6549643db90629e34165a48dc5a361
