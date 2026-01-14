import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { BusinessException } from '../common/exceptions/business.exception';
import { BusinessErrorCodes } from '../common/constants/error-codes';

import { RegisterLandlordDto } from './dto/register-landlord.dto';
import { RegisterTenantDto } from './dto/register-tenant.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async checkAccountExist(phone: string, account: string) {
    // 1、检查手机号Phone是否已被注册
    const existingPhone = await this.prisma.user.findUnique({
      where: { phone },
    });
    if (existingPhone) {
      throw new BusinessException(
        'error.auth.exists.phone',
        BusinessErrorCodes.AUTH_PHONE_EXISTS,
      );
    }
    // 2、检查用户账号Account是否已被注册
    const existingAccount = await this.prisma.user.findUnique({
      where: { account },
    });
    if (existingAccount) {
      throw new BusinessException(
        'error.auth.exists.account',
        BusinessErrorCodes.AUTH_ACCOUNT_EXISTS,
      );
    }
  }

  // 注册房东
  async registerLandlord(registerLandlordDto: RegisterLandlordDto) {
    if (
      !registerLandlordDto.name ||
      !registerLandlordDto.account ||
      !registerLandlordDto.phone ||
      !registerLandlordDto.password
    ) {
      throw new BusinessException(
        'error.auth.missing_fields',
        BusinessErrorCodes.AUTH_MISSING_FIELDS,
      );
    }
    const { name, account, phone, password, email, remark } =
      registerLandlordDto;

    await this.checkAccountExist(phone, account);

    // 哈希密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建房东用户
    const landlord = await this.prisma.user.create({
      data: {
        name,
        account,
        phone,
        email,
        password: hashedPassword,
        role: 'LANDLORD',
        landlordProfile: {
          create: {
            remark,
          },
        },
      },
    });

    return landlord;
  }

  // 注册租客
  async registerTenant(registerTenantDto: RegisterTenantDto) {
    if (
      !registerTenantDto.name ||
      !registerTenantDto.account ||
      !registerTenantDto.phone ||
      !registerTenantDto.password ||
      !registerTenantDto.idCard
    ) {
      throw new BusinessException(
        'error.auth.missing_fields',
        BusinessErrorCodes.AUTH_MISSING_FIELDS,
      );
    }
    const {
      name,
      account,
      phone,
      password,
      idCard,
      email,
      emergencyContact,
      emergencyPhone,
    } = registerTenantDto;

    await this.checkAccountExist(phone, account);

    // 3、检查用户身份证是否已被注册
    const existingIdCard = await this.prisma.tenant.findUnique({
      where: { idCard: idCard },
    });
    if (existingIdCard) {
      throw new BusinessException(
        'error.auth.exists.id_card',
        BusinessErrorCodes.AUTH_ID_CARD_EXISTS,
      );
    }

    // 哈希密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建租客用户
    const tenant = await this.prisma.user.create({
      data: {
        name,
        account,
        phone,
        email,
        password: hashedPassword,
        role: 'TENANT',
        tenantProfile: {
          create: {
            idCard,
            emergencyContact,
            emergencyPhone,
          },
        },
      },
    });

    return tenant;
  }

  // 通用登录
  async login(loginDto: LoginDto) {
    const { account, password, role } = loginDto;

    // 1、检查用户账号是否存在
    const user = await this.prisma.user.findUnique({
      where: { account },
    });

    // 2、验证密码
    let isPasswordValid = false;
    if (user) {
      isPasswordValid = await bcrypt.compare(password, user.password);
    }

    // 不区分账号有 ｜ 是密码有误 ｜ 用户角色不匹配，都返回账号不存在或密码错误
    if (!user || !isPasswordValid || user.role !== role) {
      throw new BusinessException(
        'error.auth.account_pwd_error',
        BusinessErrorCodes.AUTH_LOGIN_FAILED,
      );
    }

    // 3、生成 JWT 令牌
    const payload = { account: user.account, sub: user.id };
    const token = this.jwtService.sign(payload);

    return {
      token,
      userInfo: {
        id: user.id,
        account: user.account,
        phone: user.phone,
        role: user.role,
      },
    };
  }

  // 退出登录
  async logout() {
    // 1、清空 JWT 令牌
    this.jwtService.sign({});

    // 2、返回成功响应
    return {
      // message: 'error.auth.logout_success',
    };
  }

  // 获取用户档案
  async getUserProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new BusinessException(
        'error.auth.not_exists.account',
        BusinessErrorCodes.AUTH_USER_NOT_FOUND,
      );
    }
    return user;
  }
}
