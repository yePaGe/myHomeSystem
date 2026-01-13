import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersDto } from './dto/create-users.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // 查询所有users列数据
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // 查询单个user列数据
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  // 创建user列数据
  @Post()
  create(@Body() createUserDto: CreateUsersDto) {
    return this.usersService.create(createUserDto);
  }

  // 更新user列数据
  @Put()
  update(@Body() createUserDto: CreateUsersDto) {
    return this.usersService.update(createUserDto);
  }
}
