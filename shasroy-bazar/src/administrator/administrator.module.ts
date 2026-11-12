import { Module } from '@nestjs/common';
import { AdministratorService } from './administrator.service.js';
import { AdministratorController } from './administrator.controller.js';

@Module({
  //imports: [TypeOrmModule.forFeature([User])],
  controllers: [AdministratorController],
  providers: [AdministratorService],
})
export class AdministratorModule {}
