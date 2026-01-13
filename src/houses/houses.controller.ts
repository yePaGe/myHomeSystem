import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { HousesService } from './houses.service';
import { CreateHouseDto } from './dto/create-house.dto';

//处理http请求
@Controller('houses')
export class HousesController {
  constructor(private readonly housesService: HousesService) {}

  // 查询所有house列数据
  @Get()
  findAll() {
    return this.housesService.findAll();
  }

  // 查询单个house列数据
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.housesService.findOne(id);
  }

  // 创建house列数据
  @Post()
  create(@Body() createHouseDto: CreateHouseDto) {
    return this.housesService.create(createHouseDto);
  }

  // 更新house列数据
  @Put()
  update(@Body() createHouseDto: CreateHouseDto) {
    return this.housesService.update(createHouseDto);
  }
}
