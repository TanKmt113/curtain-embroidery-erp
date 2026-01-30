import { PrismaClient, Prisma } from '@prisma/client';
import { Product, ProductType } from '../../domain/entities/Product';
import { IProductRepository, ProductFilters, PaginatedResult, PaginationOptions } from '../../domain/repositories';

export class PrismaProductRepository implements IProductRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        routingSteps: {
          orderBy: { stepNumber: 'asc' },
        },
      },
    });

    return product as unknown as Product | null;
  }

  async findByCode(code: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { code },
    });

    return product as unknown as Product | null;
  }

  async findAll(filters: ProductFilters, pagination: PaginationOptions): Promise<PaginatedResult<Product>> {
    const where: Prisma.ProductWhereInput = {};

    if (filters.search) {
      where.OR = [
        { code: { contains: filters.search, mode: 'insensitive' } },
        { name: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.type) {
      where.type = filters.type as any;
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    const [total, data] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        skip: (pagination.page - 1) * pagination.pageSize,
        take: pagination.pageSize,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      data: data as unknown as Product[],
      total,
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalPages: Math.ceil(total / pagination.pageSize),
    };
  }

  async create(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const created = await this.prisma.product.create({
      data: product as any,
    });

    return created as unknown as Product;
  }

  async update(id: string, data: Partial<Product>): Promise<Product> {
    const updated = await this.prisma.product.update({
      where: { id },
      data: data as any,
    });

    return updated as unknown as Product;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({
      where: { id },
    });
  }

  async getNextCode(type: ProductType): Promise<string> {
    const prefixMap: Record<ProductType, string> = {
      [ProductType.CURTAIN]: 'CUR',
      [ProductType.EMBROIDERY]: 'EMB',
      [ProductType.MATERIAL]: 'MAT',
      [ProductType.ACCESSORY]: 'ACC',
      [ProductType.CUSHION]: 'CUS',
      [ProductType.SERVICE]: 'SVC',
    };
    
    const prefix = prefixMap[type] || 'PRD';

    const lastProduct = await this.prisma.product.findFirst({
      where: { code: { startsWith: prefix } },
      orderBy: { code: 'desc' },
    });

    let nextNumber = 1;
    if (lastProduct) {
      const match = lastProduct.code.match(/\d+$/);
      if (match) {
        nextNumber = parseInt(match[0], 10) + 1;
      }
    }

    return `${prefix}${nextNumber.toString().padStart(5, '0')}`;
  }
}
