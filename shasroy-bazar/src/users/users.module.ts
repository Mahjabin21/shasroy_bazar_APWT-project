import { Module } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { ServiceZone } from '../service-zones/entities/service-zone.entity.js';


@Module({
  imports: [TypeOrmModule.forFeature([User,ServiceZone])],
  controllers: [UsersController],
  providers: [UsersService],
   exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
