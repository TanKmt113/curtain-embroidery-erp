import { PrismaClient, Prisma } from '@prisma/client';
import { Quotation, QuotationItem, QuotationStatus } from '../../domain/entities/Quotation';
import { IQuotationRepository, QuotationFilters, PaginatedResult, PaginationOptions } from '../../domain/repositories';

export class PrismaQuotationRepository implements IQuotationRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Quotation | null> {
    const quotation = await this.prisma.quotation.findUnique({
      where: { id },
    });

    return quotation as Quotation | null;
  }

  async findByIdWithItems(id: string): Promise<Quotation | null> {
    const quotation = await this.prisma.quotation.findUnique({
      where: { id },
      include: {
        customer: true,
        items: {
          include: { product: true },
        },
        createdBy: {
          select: { id: true, fullName: true },
        },
      },
    });

    return quotation as Quotation | null;
  }

  async findByCode(code: string): Promise<Quotation | null> {
    const quotation = await this.prisma.quotation.findUnique({
      where: { code },
    });

    return quotation as Quotation | null;
  }

  async findAll(filters: QuotationFilters, pagination: PaginationOptions): Promise<PaginatedResult<Quotation>> {
    const where: Prisma.QuotationWhereInput = {};

    if (filters.search) {
      where.OR = [
        { code: { contains: filters.search, mode: 'insensitive' } },
        { customer: { name: { contains: filters.search, mode: 'insensitive' } } },
      ];
    }

    if (filters.customerId) {
      where.customerId = filters.customerId;
    }

    if (filters.status) {
      where.status = filters.status as any;
    }

    if (filters.createdById) {
      where.createdById = filters.createdById;
    }

    if (filters.fromDate || filters.toDate) {
      where.createdAt = {};
      if (filters.fromDate) {
        where.createdAt.gte = filters.fromDate;
      }
      if (filters.toDate) {
        where.createdAt.lte = filters.toDate;
      }
    }

    const [total, data] = await Promise.all([
      this.prisma.quotation.count({ where }),
      this.prisma.quotation.findMany({
        where,
        include: {
          customer: { select: { id: true, code: true, name: true } },
          createdBy: { select: { id: true, fullName: true } },
        },
        skip: (pagination.page - 1) * pagination.pageSize,
        take: pagination.pageSize,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      data: data as unknown as Quotation[],
      total,
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalPages: Math.ceil(total / pagination.pageSize),
    };
  }

  async create(quotation: Omit<Quotation, 'id' | 'code' | 'createdAt' | 'updatedAt'>): Promise<Quotation> {
    const created = await this.prisma.quotation.create({
      data: quotation as any,
    });

    return created as Quotation;
  }

  async update(id: string, data: Partial<Quotation>): Promise<Quotation> {
    const updated = await this.prisma.quotation.update({
      where: { id },
      data: data as any,
    });

    return updated as Quotation;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.quotation.delete({
      where: { id },
    });
  }

  async getNextCode(): Promise<string> {
    const prefix = 'QT';
    const today = new Date();
    const yearMonth = `${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}`;
    const fullPrefix = `${prefix}${yearMonth}`;

    const lastQuotation = await this.prisma.quotation.findFirst({
      where: { code: { startsWith: fullPrefix } },
      orderBy: { code: 'desc' },
    });

    let nextNumber = 1;
    if (lastQuotation) {
      const match = lastQuotation.code.match(/\d+$/);
      if (match) {
        nextNumber = parseInt(match[0], 10) + 1;
      }
    }

    return `${fullPrefix}${nextNumber.toString().padStart(4, '0')}`;
  }

  // Items methods
  async addItem(item: Omit<QuotationItem, 'id'>): Promise<QuotationItem> {
    const created = await this.prisma.quotationItem.create({
      data: item as any,
    });

    return created as QuotationItem;
  }

  async updateItem(id: string, data: Partial<QuotationItem>): Promise<QuotationItem> {
    const updated = await this.prisma.quotationItem.update({
      where: { id },
      data: data as any,
    });

    return updated as QuotationItem;
  }

  async removeItem(id: string): Promise<void> {
    await this.prisma.quotationItem.delete({
      where: { id },
    });
  }

  async getItems(quotationId: string): Promise<QuotationItem[]> {
    const items = await this.prisma.quotationItem.findMany({
      where: { quotationId },
      include: { product: true },
    });

    return items as QuotationItem[];
  }
}
