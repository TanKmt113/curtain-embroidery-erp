import { PrismaClient, Prisma } from '@prisma/client';
import { Order, OrderItem, OrderStatus } from '../../domain/entities/Order';
import { IOrderRepository, OrderFilters, PaginatedResult, PaginationOptions } from '../../domain/repositories';

export class PrismaOrderRepository implements IOrderRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    return order as Order | null;
  }

  async findByIdWithItems(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
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

    return order as Order | null;
  }

  async findByCode(code: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: { code },
    });

    return order as Order | null;
  }

  async findAll(filters: OrderFilters, pagination: PaginationOptions): Promise<PaginatedResult<Order>> {
    const where: Prisma.OrderWhereInput = {};

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
      this.prisma.order.count({ where }),
      this.prisma.order.findMany({
        where,
        include: {
          customer: { select: { id: true, code: true, name: true, phone: true, address: true } },
          createdBy: { select: { id: true, fullName: true } },
        },
        skip: (pagination.page - 1) * pagination.pageSize,
        take: pagination.pageSize,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      data: data as unknown as Order[],
      total,
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalPages: Math.ceil(total / pagination.pageSize),
    };
  }

  async create(order: Omit<Order, 'id' | 'code' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    const created = await this.prisma.order.create({
      data: order as any,
    });

    return created as Order;
  }

  async update(id: string, data: Partial<Order>): Promise<Order> {
    const updated = await this.prisma.order.update({
      where: { id },
      data: data as any,
    });

    return updated as Order;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.order.delete({
      where: { id },
    });
  }

  async getNextCode(): Promise<string> {
    const prefix = 'SO';
    const today = new Date();
    const yearMonth = `${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}`;
    const fullPrefix = `${prefix}${yearMonth}`;

    const lastOrder = await this.prisma.order.findFirst({
      where: { code: { startsWith: fullPrefix } },
      orderBy: { code: 'desc' },
    });

    let nextNumber = 1;
    if (lastOrder) {
      const match = lastOrder.code.match(/\d+$/);
      if (match) {
        nextNumber = parseInt(match[0], 10) + 1;
      }
    }

    return `${fullPrefix}${nextNumber.toString().padStart(4, '0')}`;
  }

  // Items methods
  async addItem(item: Omit<OrderItem, 'id'>): Promise<OrderItem> {
    const created = await this.prisma.orderItem.create({
      data: item as any,
    });

    return created as OrderItem;
  }

  async updateItem(id: string, data: Partial<OrderItem>): Promise<OrderItem> {
    const updated = await this.prisma.orderItem.update({
      where: { id },
      data: data as any,
    });

    return updated as OrderItem;
  }

  async removeItem(id: string): Promise<void> {
    await this.prisma.orderItem.delete({
      where: { id },
    });
  }

  async getItems(orderId: string): Promise<OrderItem[]> {
    const items = await this.prisma.orderItem.findMany({
      where: { orderId },
      include: { product: true },
    });

    return items as OrderItem[];
  }
}
