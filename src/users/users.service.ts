import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUsersDto } from './dto/create-users.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // 查询所有user列数据
  async findAll() {
    return this.prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // 查询单个user列数据
  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  // 创建user列数据
  async create(createUserDto: CreateUsersDto) {
    const data: Prisma.UserCreateInput = {
      name: createUserDto.name,
      account: createUserDto.account,
      phone: createUserDto.phone,
      password: createUserDto.password, // 注意：实际生产中应加密
      role: createUserDto.role,
      email: createUserDto.email,
    };

    // 根据角色自动创建关联档案
    if (createUserDto.role === 'TENANT') {
      if (!createUserDto.idCard) {
        throw new BadRequestException('创建租客必须提供身份证号 (idCard)');
      }
      data.tenantProfile = {
        create: {
          idCard: createUserDto.idCard,
          remark: createUserDto.remark,
          // 其他 Tenant 必填字段若有，需在此补充
        },
      };
    } else if (createUserDto.role === 'LANDLORD') {
      data.landlordProfile = {
        create: {
          remark: createUserDto.remark,
        },
      };
    }

    return this.prisma.user.create({ data });
  }

  // 更新user列数据
  async update(createUserDto: CreateUsersDto) {
    return this.prisma.user.update({
      where: {
        id: createUserDto.id,
      },
      data: {
        name: createUserDto.name,
        account: createUserDto.account,
        phone: createUserDto.phone,
        password: createUserDto.password,
        role: createUserDto.role,
      },
    });
  }
}
