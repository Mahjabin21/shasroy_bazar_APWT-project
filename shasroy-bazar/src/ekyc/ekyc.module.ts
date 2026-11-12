import { Module } from '@nestjs/common';
import { EkycService } from './ekyc.service.js';
import { EkycController } from './ekyc.controller.js';

@Module({
  //imports: [TypeOrmModule.forFeature([User])],
  controllers: [EkycController],
  providers: [EkycService],
})
export class EkycModule {}
