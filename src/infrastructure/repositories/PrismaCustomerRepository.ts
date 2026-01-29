import { PrismaClient, Prisma } from '@prisma/client';
import {
  ICustomerRepository,
  CustomerFilters,
  PaginationOptions,
  PaginatedResult,
} from '../../domain/repositories/ICustomerRepository';
import { Customer } from '../../domain/entities';

export class PrismaCustomerRepository implements ICustomerRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Customer | null> {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });

    return customer as Customer | null;
  }

  async findByCode(code: string): Promise<Customer | null> {
    const customer = await this.prisma.customer.findUnique({
      where: { code },
    });

    return customer as Customer | null;
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const customer = await this.prisma.customer.findFirst({
      where: { email },
    });

    return customer as Customer | null;
  }

  async findAll(
    filters: CustomerFilters,
    pagination: PaginationOptions
  ): Promise<PaginatedResult<Customer>> {
    const where: Prisma.CustomerWhereInput = {};

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { code: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { phone: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    const [data, total] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        skip: (pagination.page - 1) * pagination.pageSize,
        take: pagination.pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.customer.count({ where }),
    ]);

    return {
      data: data as Customer[],
      total,
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalPages: Math.ceil(total / pagination.pageSize),
    };
  }

  async create(data: Omit<Customer, 'id' | 'code' | 'createdAt' | 'updatedAt'>): Promise<Customer> {
    const code = await this.getNextCode();

    const customer = await this.prisma.customer.create({
      data: {
        code,
        name: data.name,
        type: data.type,
        email: data.email,
        phone: data.phone,
        address: data.address,
        taxCode: data.taxCode,
        contactPerson: data.contactPerson,
        notes: data.notes,
        isActive: data.isActive,
      },
    });

    return customer as Customer;
  }

  async update(id: string, data: Partial<Customer>): Promise<Customer> {
    const customer = await this.prisma.customer.update({
      where: { id },
      data,
    });

    return customer as Customer;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.customer.delete({
      where: { id },
    });
  }

  async getNextCode(): Promise<string> {
    const lastCustomer = await this.prisma.customer.findFirst({
      orderBy: { code: 'desc' },
      select: { code: true },
    });

    if (!lastCustomer) {
      return 'CUS-0001';
    }

    const lastNumber = parseInt(lastCustomer.code.split('-')[1], 10);
    const nextNumber = lastNumber + 1;
    return `CUS-${nextNumber.toString().padStart(4, '0')}`;
  }
}
