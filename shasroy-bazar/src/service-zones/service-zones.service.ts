import {Injectable,NotFoundException,ConflictException,BadRequestException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceZone } from './entities/service-zone.entity.js';
import { Administrator } from '../administrator/entities/administrator.entity.js';
import { CreateServiceZoneDto } from './dto/create-service-zone.dto.js';
import { UpdateServiceZoneDto } from './dto/update-service-zone.dto.js';

@Injectable()
export class ServiceZonesService {

  constructor(
    @InjectRepository(ServiceZone)
    private readonly zoneRepository: Repository<ServiceZone>,

    @InjectRepository(Administrator)
    private readonly adminRepository: Repository<Administrator>,
  ) {}

  // 1. Create a new service zone
  async create(dto: CreateServiceZoneDto, adminId: number) {

    // Check whether the zone name already exists
    const existingZone = await this.zoneRepository.findOne({
      where: { 
        zoneName: dto.zoneName 
    },
    });

    if (existingZone) {
      throw new ConflictException('Zone name already exists');
    }

    // Find the administrator who is creating the zone
    const administrator = await this.adminRepository.findOne({
      where: {
        adminId: adminId,
        adminStatus: 'active',
      },
    });

    if (!administrator) 
    {
      throw new NotFoundException('Active administrator not found');
    }

    // Create a new zone object
    const newZone = this.zoneRepository.create({
      zoneName: dto.zoneName,
      boundaryDefinition: dto.boundaryDefinition,
      zoneStatus: dto.zoneStatus ?? 'active',
      createdByAdmin: administrator,
    });

    // Save the zone in the database
    const savedZone = await this.zoneRepository.save(newZone);

return {
  message: 'Service zone created successfully',
  zone: {
    zoneId: savedZone.zoneId,
    zoneName: savedZone.zoneName,
    boundaryDefinition: savedZone.boundaryDefinition,
    zoneStatus: savedZone.zoneStatus,
    createdAt: savedZone.createdAt,
    createdBy: administrator.fullName,
  },
};
  }

  // 2. Get all service zones
  async findAll() {
    return this.zoneRepository.find({
      select: {
        zoneId: true,
        zoneName: true,
        boundaryDefinition: true,
        zoneStatus: true,
        createdAt: true,
      },
    });
  }

  // 3. Get one service zone
  async findOne(zoneId: number) {

    const zone = await this.zoneRepository.findOne({
      where: { zoneId },
      select: {
        zoneId: true,
        zoneName: true,
        boundaryDefinition: true,
        zoneStatus: true,
        createdAt: true,
      },
    });

    if (!zone) {
      throw new NotFoundException('Service zone not found');
    }

    return zone;
  }

  // 4. Update service zone
  async update(zoneId: number, dto: UpdateServiceZoneDto) {

    const zone = await this.zoneRepository.findOne({
      where: { zoneId },
    });

    if (!zone) {
      throw new NotFoundException('Service zone not found');
    }

    // Check duplicate zone name
    if (dto.zoneName && dto.zoneName !== zone.zoneName) {

      const existingZone = await this.zoneRepository.findOne({
        where: { 
            zoneName: dto.zoneName 
        },
      });

      if (existingZone) {
        throw new ConflictException('Zone name already exists');
      }
    }

    Object.assign(zone, dto);
    return this.zoneRepository.save(zone);
  }

  // 5. Activate or deactivate a zone
  async updateStatus(zoneId: number, status: string) {

    if (!['active', 'inactive'].includes(status)) {
      throw new BadRequestException('Zone status must be active or inactive');
    }

    const zone = await this.zoneRepository.findOne({
      where: { zoneId },
    });

    if (!zone) {
      throw new NotFoundException('Service zone not found');
    }

    zone.zoneStatus = status;
    return this.zoneRepository.save(zone);
  }
}
