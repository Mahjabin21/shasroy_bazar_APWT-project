import { Module } from '@nestjs/common';
import { MerchantsService } from './merchants.service.js';
import { MerchantsController } from './merchants.controller.js';

@Module({
  //imports: [TypeOrmModule.forFeature([User])],
  controllers: [MerchantsController],
  providers: [MerchantsService],
})
export class MerchantsModule {}
