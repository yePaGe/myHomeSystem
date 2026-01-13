import { Module } from '@nestjs/common';
import { HousesController } from './houses.controller';
import { HousesService } from './houses.service';

// 模块注册
@Module({
  controllers: [HousesController],
  providers: [HousesService],
})
export class HousesModule {}
