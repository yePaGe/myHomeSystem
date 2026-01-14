import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey', // 建议从环境变量获取
      signOptions: { expiresIn: '7d' }, // Token 有效期 7 天
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
