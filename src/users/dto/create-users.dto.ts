export class CreateUsersDto {
  id?: string;
  name: string;
  phone: string;
  password: string;
  role: string;
  email?: string;
  remark: string;
  idCard?: string; // 租客必填
}
