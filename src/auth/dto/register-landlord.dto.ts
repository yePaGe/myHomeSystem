export class RegisterLandlordDto {
  name: string;
  account: string;
  phone: string;
  password: string;
  remark?: string;
  email?: string;
  houses?: any[]; // 临时使用 any 类型，后续请替换为正确的房屋创建输入类型
}
