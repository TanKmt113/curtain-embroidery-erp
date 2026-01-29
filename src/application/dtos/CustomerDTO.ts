import { CustomerType } from '../../domain/entities';

export interface CreateCustomerDTO {
  name: string;
  type?: CustomerType;
  email?: string;
  phone?: string;
  address?: string;
  taxCode?: string;
  contactPerson?: string;
  notes?: string;
}

export interface UpdateCustomerDTO {
  name?: string;
  type?: CustomerType;
  email?: string;
  phone?: string;
  address?: string;
  taxCode?: string;
  contactPerson?: string;
  notes?: string;
  isActive?: boolean;
}

export interface ListCustomersDTO {
  page?: number;
  pageSize?: number;
  search?: string;
  type?: CustomerType;
  isActive?: boolean;
}
