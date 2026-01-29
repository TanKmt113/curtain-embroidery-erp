import { PrismaClient, Prisma } from '@prisma/client';
import { Inventory, InventoryTransaction, InventoryOwnership } from '../../domain/entities/Inventory';
import { IInventoryRepository, InventoryFilters, PaginatedResult, PaginationOptions } from '../../domain/repositories';

export class PrismaInventoryRepository implements IInventoryRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Inventory | null> {
    const inventory = await this.prisma.inventory.findUnique({
      where: { id },
      include: {
        product: true,
        material: true,
        customer: true,
      },
    });

    return inventory as Inventory | null;
  }

  async findByProductAndWarehouse(
    productId: string,
    warehouse: string,
    ownership: InventoryOwnership,
    customerId?: string
  ): Promise<Inventory | null> {
    const inventory = await this.prisma.inventory.findFirst({
      where: {
        productId,
        warehouse,
        ownership,
        customerId: customerId || null,
      },
    });

    return inventory as Inventory | null;
  }

  async findByMaterialAndWarehouse(materialId: string, warehouse: string): Promise<Inventory | null> {
    const inventory = await this.prisma.inventory.findFirst({
      where: {
        materialId,
        warehouse,
      },
    });

    return inventory as Inventory | null;
  }

  async findAll(filters: InventoryFilters, pagination: PaginationOptions): Promise<PaginatedResult<Inventory>> {
    const where: Prisma.InventoryWhereInput = {};

    if (filters.productId) {
      where.productId = filters.productId;
    }

    if (filters.materialId) {
      where.materialId = filters.materialId;
    }

    if (filters.ownership) {
      where.ownership = filters.ownership;
    }

    if (filters.customerId) {
      where.customerId = filters.customerId;
    }

    if (filters.warehouse) {
      where.warehouse = filters.warehouse;
    }

    if (filters.lowStock) {
      // Note: minStock field doesn't exist in schema, this filter needs redesign
      where.quantity = { lte: 0 };
    }

    const [total, data] = await Promise.all([
      this.prisma.inventory.count({ where }),
      this.prisma.inventory.findMany({
        where,
        include: {
          product: { select: { id: true, code: true, name: true, type: true, unit: true } },
          material: { select: { id: true, code: true, name: true, unit: true } },
          customer: { select: { id: true, code: true, name: true } },
        },
        skip: (pagination.page - 1) * pagination.pageSize,
        take: pagination.pageSize,
        orderBy: { lastUpdated: 'desc' },
      }),
    ]);

    return {
      data: data as Inventory[],
      total,
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalPages: Math.ceil(total / pagination.pageSize),
    };
  }

  async create(inventory: Omit<Inventory, 'id' | 'lastUpdated'>): Promise<Inventory> {
    const created = await this.prisma.inventory.create({
      data: inventory as any,
    });

    return created as Inventory;
  }

  async update(id: string, data: Partial<Inventory>): Promise<Inventory> {
    const updated = await this.prisma.inventory.update({
      where: { id },
      data: {
        ...data as any,
        lastUpdated: new Date(),
      },
    });

    return updated as Inventory;
  }

  // Transactions
  async createTransaction(transaction: Omit<InventoryTransaction, 'id' | 'createdAt'>): Promise<InventoryTransaction> {
    const created = await this.prisma.inventoryTransaction.create({
      data: transaction as any,
    });

    return created as InventoryTransaction;
  }

  async getTransactions(inventoryId: string, pagination: PaginationOptions): Promise<PaginatedResult<InventoryTransaction>> {
    const where = { inventoryId };

    const [total, data] = await Promise.all([
      this.prisma.inventoryTransaction.count({ where }),
      this.prisma.inventoryTransaction.findMany({
        where,
        skip: (pagination.page - 1) * pagination.pageSize,
        take: pagination.pageSize,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      data: data as InventoryTransaction[],
      total,
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalPages: Math.ceil(total / pagination.pageSize),
    };
  }

  // Stock operations
  async adjustQuantity(id: string, quantityChange: number): Promise<Inventory> {
    const updated = await this.prisma.inventory.update({
      where: { id },
      data: {
        quantity: { increment: quantityChange },
        lastUpdated: new Date(),
      },
    });

    return updated as Inventory;
  }

  async reserveStock(id: string, quantity: number): Promise<Inventory> {
    const updated = await this.prisma.inventory.update({
      where: { id },
      data: {
        reservedQty: { increment: quantity },
        lastUpdated: new Date(),
      },
    });

    return updated as Inventory;
  }

  async releaseReservation(id: string, quantity: number): Promise<Inventory> {
    const updated = await this.prisma.inventory.update({
      where: { id },
      data: {
        reservedQty: { decrement: quantity },
        lastUpdated: new Date(),
      },
    });

    return updated as Inventory;
  }

  // Additional methods required by interface
  async findByProduct(productOrMaterialId: string, warehouse: string, ownership: InventoryOwnership): Promise<Inventory | null> {
    const inventory = await this.prisma.inventory.findFirst({
      where: {
        OR: [
          { productId: productOrMaterialId },
          { materialId: productOrMaterialId },
        ],
        warehouse,
        ownership,
      },
    });

    return inventory as Inventory | null;
  }

  async recordTransaction(transaction: Omit<InventoryTransaction, 'id' | 'createdAt'>): Promise<InventoryTransaction> {
    return this.createTransaction(transaction);
  }
}
