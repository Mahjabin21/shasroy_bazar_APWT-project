import {
  BadRequestException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity.js';
import { ServiceZone } from '../service-zones/entities/service-zone.entity.js';
import { SelectZoneDto } from './dto/select-zone.dto.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(ServiceZone)
    private readonly zoneRepository: Repository<ServiceZone>,
  ) {}

  // List the active zones a user can choose from
  async getActiveZones() {
    const zones = await this.zoneRepository.find({
      where: { zoneStatus: 'active' },
      select: {
        zoneId: true,
        zoneName: true,
        boundaryDefinition: true,
      },
      order: { zoneName: 'ASC' },
    });

    return {
      message: 'Active service zones retrieved successfully',
      total: zones.length,
      zones,
    };
  }

  async selectZone(userId: number, dto: SelectZoneDto) {
    // Find the selected service zone
    const zone = await this.zoneRepository.findOne({
      where: { zoneId: dto.zoneId },
    });

    if (!zone) {
      throw new NotFoundException('Service zone not found');
    }

    // Only active zones can be selected
    if (zone.zoneStatus !== 'active') {
      throw new BadRequestException('This service zone is inactive');
    }

    // Find the user
    const user = await this.userRepository.findOne({
      where: { userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Save the selected zone
    user.selectedZone = zone;
    await this.userRepository.save(user);

    return {
      message: 'Service zone selected successfully',
      userId: user.userId,
      zoneId: zone.zoneId,
      zoneName: zone.zoneName,
    };
  }

  async getSelectedZone(userId: number) {
    const user = await this.userRepository.findOne({
      where: { userId },
      relations: {
        selectedZone: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.selectedZone) {
      return {
        message: 'No service zone selected',
        selectedZone: null,
      };
    }

    return {
      message: 'Selected service zone retrieved successfully',
      selectedZone: {
        zoneId: user.selectedZone.zoneId,
        zoneName: user.selectedZone.zoneName,
        zoneStatus: user.selectedZone.zoneStatus,
      },
    };
  }
}