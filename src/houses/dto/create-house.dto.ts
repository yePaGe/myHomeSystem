export class CreateHouseDto {
  id?: string;
  code: string;
  address: string;
  area: number;
  monthlyRent: number;
  waterRate: number;
  electricRate: number;
  remark: string;
  landlordId: string;
}
