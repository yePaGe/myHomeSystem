export class RegisterTenantDto {
  name: string;
  account: string;
  phone: string;
  password: string;
  idCard: string;
  email?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
}
