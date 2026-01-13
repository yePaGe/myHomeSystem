import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHouseDto } from './dto/create-house.dto';

// 业务逻辑 + 调用prisma数据库
@Injectable()
export class HousesService {
  constructor(private prisma: PrismaService) {}

  // 查询所有house列数据
  async findAll() {
    return this.prisma.house.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // 查询单个house列数据
  async findOne(id: string) {
    return this.prisma.house.findUnique({
      where: {
        id,
      },
    });
  }

  // 创建house列数据
  async create(createHouseDto: CreateHouseDto) {
    return this.prisma.house.create({
      data: {
        code: createHouseDto.code,
        address: createHouseDto.address,
        area: createHouseDto.area,
        monthlyRent: createHouseDto.monthlyRent,
        waterRate: createHouseDto.waterRate,
        electricRate: createHouseDto.electricRate,
        remark: createHouseDto.remark,
        landlord: {
          connect: {
            id: createHouseDto.landlordId,
          },
        },
      },
    });
  }

  // 创建house列数据
  async update(createHouseDto: CreateHouseDto) {
    return this.prisma.house.update({
      where: {
        id: createHouseDto.id,
      },
      data: {
        code: createHouseDto.code,
        address: createHouseDto.address,
        area: createHouseDto.area,
        monthlyRent: createHouseDto.monthlyRent,
        waterRate: createHouseDto.waterRate,
        electricRate: createHouseDto.electricRate,
        remark: createHouseDto.remark,
        landlord: {
          connect: {
            id: createHouseDto.landlordId,
          },
        },
      },
    });
  }
}
