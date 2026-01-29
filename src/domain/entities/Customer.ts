export interface Customer {
  id: string;
  code: string;
  name: string;
  type: CustomerType;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  taxCode?: string | null;
  contactPerson?: string | null;
  notes?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum CustomerType {
  INDIVIDUAL = 'INDIVIDUAL',
  COMPANY = 'COMPANY',
  CONSIGNMENT = 'CONSIGNMENT',
}
