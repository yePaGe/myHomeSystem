import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterLandlordDto } from './dto/register-landlord.dto';
import { RegisterTenantDto } from './dto/register-tenant.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 注册房东
  @Post('register/landlord')
  registerLandlord(@Body() registerLandlordDto: RegisterLandlordDto) {
    return this.authService.registerLandlord(registerLandlordDto);
  }

  // 注册租户
  @Post('register/tenant')
  registerTenant(@Body() registerTenantDto: RegisterTenantDto) {
    return this.authService.registerTenant(registerTenantDto);
  }

  // 登录
  @Post('login/landlord')
  loginLandlord(@Body() loginDto: LoginDto) {
    return this.authService.login({ ...loginDto, role: 'LANDLORD' });
  }

  // 登录
  @Post('login/tenant')
  loginTenant(@Body() loginDto: LoginDto) {
    return this.authService.login({ ...loginDto, role: 'TENANT' });
  }

  // 退出登录
  @Post('logout')
  logout() {
    return this.authService.logout();
  }
}
