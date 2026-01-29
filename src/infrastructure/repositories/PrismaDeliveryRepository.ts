import { PrismaClient, Prisma } from '@prisma/client';
import { Delivery, DeliveryType, DeliveryStatus } from '../../domain/entities/Delivery';
import { IDeliveryRepository, DeliveryFilters, PaginatedResult, PaginationOptions } from '../../domain/repositories';

export class PrismaDeliveryRepository implements IDeliveryRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Delivery | null> {
    const delivery = await this.prisma.delivery.findUnique({
      where: { id },
      include: {
        order: {
          select: {
            id: true,
            code: true,
            customer: { select: { name: true, phone: true } },
          },
        },
      },
    });

    return delivery as Delivery | null;
  }

  async findByCode(code: string): Promise<Delivery | null> {
    const delivery = await this.prisma.delivery.findUnique({
      where: { code },
    });

    return delivery as Delivery | null;
  }

  async findByOrderId(orderId: string): Promise<Delivery[]> {
    const deliveries = await this.prisma.delivery.findMany({
      where: { orderId },
      orderBy: { scheduledDate: 'asc' },
    });

    return deliveries as Delivery[];
  }

  async findAll(filters: DeliveryFilters, pagination: PaginationOptions): Promise<PaginatedResult<Delivery>> {
    const where: Prisma.DeliveryWhereInput = {};

    if (filters.orderId) {
      where.orderId = filters.orderId;
    }

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.fromDate || filters.toDate) {
      where.scheduledDate = {};
      if (filters.fromDate) {
        where.scheduledDate.gte = filters.fromDate;
      }
      if (filters.toDate) {
        where.scheduledDate.lte = filters.toDate;
      }
    }

    const [total, data] = await Promise.all([
      this.prisma.delivery.count({ where }),
      this.prisma.delivery.findMany({
        where,
        include: {
          order: {
            select: {
              id: true,
              code: true,
              customer: { select: { name: true, phone: true } },
            },
          },
        },
        skip: (pagination.page - 1) * pagination.pageSize,
        take: pagination.pageSize,
        orderBy: { scheduledDate: 'asc' },
      }),
    ]);

    return {
      data: data as Delivery[],
      total,
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalPages: Math.ceil(total / pagination.pageSize),
    };
  }

  async create(delivery: Omit<Delivery, 'id' | 'code' | 'createdAt' | 'updatedAt'>): Promise<Delivery> {
    const created = await this.prisma.delivery.create({
      data: delivery as any,
    });

    return created as Delivery;
  }

  async update(id: string, data: Partial<Delivery>): Promise<Delivery> {
    const updated = await this.prisma.delivery.update({
      where: { id },
      data: data as any,
    });

    return updated as Delivery;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.delivery.delete({
      where: { id },
    });
  }

  async getNextCode(type: DeliveryType): Promise<string> {
    const prefix = type === DeliveryType.DELIVERY ? 'DLV' : 'INS';
    const today = new Date();
    const yearMonth = `${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}`;
    const fullPrefix = `${prefix}${yearMonth}`;

    const lastDelivery = await this.prisma.delivery.findFirst({
      where: { code: { startsWith: fullPrefix } },
      orderBy: { code: 'desc' },
    });

    let nextNumber = 1;
    if (lastDelivery) {
      const match = lastDelivery.code.match(/\d+$/);
      if (match) {
        nextNumber = parseInt(match[0], 10) + 1;
      }
    }

    return `${fullPrefix}${nextNumber.toString().padStart(4, '0')}`;
  }
}
