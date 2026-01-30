import { IInventoryRepository, PaginatedResult } from '../../../domain/repositories';
import { InventoryOwnership, InventoryTransactionType } from '../../../domain/entities/Inventory';
import { NotFoundError, ValidationError } from '../../../domain/errors/DomainErrors';

export interface InventoryListQueryDto {
  productId?: string;
  materialId?: string;
  warehouse?: string;
  ownership?: string;
  page?: number;
  pageSize?: number;
}

export interface InventoryProductInfo {
  id: string;
  code: string;
  name: string;
  type?: string;
  unit?: string;
}

export interface InventoryMaterialInfo {
  id: string;
  code: string;
  name: string;
  unit?: string;
}

export interface InventoryCustomerInfo {
  id: string;
  code: string;
  name: string;
}

export interface InventoryResponseDto {
  id: string;
  productId?: string | null;
  materialId?: string | null;
  ownership: InventoryOwnership;
  customerId?: string | null;
  warehouse: string;
  location?: string | null;
  quantity: number;
  reservedQty: number;
  availableQty: number;
  unit: string;
  lastUpdated: Date;
  // Extended info
  product?: InventoryProductInfo | null;
  material?: InventoryMaterialInfo | null;
  customer?: InventoryCustomerInfo | null;
}

export class ListInventoryUseCase {
  constructor(private inventoryRepository: IInventoryRepository) {}

  async execute(query: InventoryListQueryDto): Promise<PaginatedResult<InventoryResponseDto>> {
    const filters = {
      productId: query.productId,
      materialId: query.materialId,
      warehouse: query.warehouse,
      ownership: query.ownership as InventoryOwnership,
    };

    const pagination = {
      page: query.page || 1,
      pageSize: query.pageSize || 20,
    };

    const result = await this.inventoryRepository.findAll(filters, pagination);

    return {
      data: result.data.map((inv: any) => ({
        id: inv.id,
        productId: inv.productId,
        materialId: inv.materialId,
        ownership: inv.ownership,
        customerId: inv.customerId,
        warehouse: inv.warehouse,
        location: inv.location,
        quantity: Number(inv.quantity),
        reservedQty: Number(inv.reservedQty),
        availableQty: Number(inv.quantity) - Number(inv.reservedQty),
        unit: inv.unit,
        lastUpdated: inv.lastUpdated,
        // Include related info
        product: inv.product ? {
          id: inv.product.id,
          code: inv.product.code,
          name: inv.product.name,
          type: inv.product.type,
          unit: inv.product.unit,
        } : null,
        material: inv.material ? {
          id: inv.material.id,
          code: inv.material.code,
          name: inv.material.name,
          unit: inv.material.unit,
        } : null,
        customer: inv.customer ? {
          id: inv.customer.id,
          code: inv.customer.code,
          name: inv.customer.name,
        } : null,
      })),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
      totalPages: result.totalPages,
    };
  }
}

export class GetInventoryUseCase {
  constructor(private inventoryRepository: IInventoryRepository) {}

  async execute(id: string): Promise<InventoryResponseDto> {
    const inventory = await this.inventoryRepository.findById(id);

    if (!inventory) {
      throw new NotFoundError('Inventory', id);
    }

    return {
      id: inventory.id,
      productId: inventory.productId,
      materialId: inventory.materialId,
      ownership: inventory.ownership,
      customerId: inventory.customerId,
      warehouse: inventory.warehouse,
      location: inventory.location,
      quantity: Number(inventory.quantity),
      reservedQty: Number(inventory.reservedQty),
      availableQty: Number(inventory.quantity) - Number(inventory.reservedQty),
      unit: inventory.unit,
      lastUpdated: inventory.lastUpdated,
    };
  }
}

export interface StockReceiveItemDto {
  productId?: string;
  materialId?: string;
  quantity: number;
  unitCost?: number;
  location?: string;
  notes?: string;
}

export interface StockReceiveDto {
  // Single item format (legacy)
  productId?: string;
  materialId?: string;
  warehouse?: string;
  ownership?: InventoryOwnership;
  customerId?: string;
  quantity?: number;
  unit?: string;
  reference?: string;
  notes?: string;
  
  // Bulk format
  type?: 'RECEIVE' | 'ADJUSTMENT' | 'TRANSFER';
  items?: StockReceiveItemDto[];
}

export class ReceiveStockUseCase {
  constructor(private inventoryRepository: IInventoryRepository) {}

  async execute(dto: StockReceiveDto): Promise<InventoryResponseDto | InventoryResponseDto[]> {
    // Handle bulk format
    if (dto.items && dto.items.length > 0) {
      return this.executeBulk(dto);
    }
    
    // Handle single format
    return this.executeSingle(dto);
  }

  private async executeBulk(dto: StockReceiveDto): Promise<InventoryResponseDto[]> {
    const results: InventoryResponseDto[] = [];
    const defaultWarehouse = 'DEFAULT';
    
    for (const item of dto.items!) {
      if (!item.productId && !item.materialId) {
        throw new ValidationError('Either productId or materialId is required for each item');
      }

      if (item.quantity <= 0) {
        throw new ValidationError('Quantity must be positive');
      }

      const productOrMaterialId = item.productId || item.materialId!;
      const ownership = dto.ownership || InventoryOwnership.COMPANY;

      // Find existing inventory or create new one
      let inventory = await this.inventoryRepository.findByProduct(
        productOrMaterialId,
        defaultWarehouse,
        ownership
      );

      if (inventory) {
        // Add to existing quantity
        const newQty = Number(inventory.quantity) + item.quantity;
        inventory = await this.inventoryRepository.update(inventory.id, {
          quantity: newQty as any,
          location: item.location || inventory.location,
        });
      } else {
        // Create new inventory record
        inventory = await this.inventoryRepository.create({
          productId: item.productId || null,
          materialId: item.materialId || null,
          warehouse: defaultWarehouse,
          ownership: ownership,
          customerId: dto.customerId || null,
          quantity: item.quantity as any,
          reservedQty: 0 as any,
          unit: 'pcs', // Default unit, should ideally come from product
          location: item.location || null,
        });
      }

      // Record transaction
      const transactionType = dto.type === 'ADJUSTMENT' 
        ? InventoryTransactionType.ADJUST 
        : InventoryTransactionType.IN;
        
      await this.inventoryRepository.recordTransaction({
        inventoryId: inventory.id,
        type: transactionType,
        quantity: item.quantity as any,
        reference: dto.notes || null,
        notes: item.notes || null,
      });

      results.push({
        id: inventory.id,
        productId: inventory.productId,
        materialId: inventory.materialId,
        ownership: inventory.ownership,
        customerId: inventory.customerId,
        warehouse: inventory.warehouse,
        location: inventory.location,
        quantity: Number(inventory.quantity),
        reservedQty: Number(inventory.reservedQty),
        availableQty: Number(inventory.quantity) - Number(inventory.reservedQty),
        unit: inventory.unit,
        lastUpdated: inventory.lastUpdated,
      });
    }

    return results;
  }

  private async executeSingle(dto: StockReceiveDto): Promise<InventoryResponseDto> {
    if (!dto.productId && !dto.materialId) {
      throw new ValidationError('Either productId or materialId is required');
    }

    if (!dto.warehouse) {
      throw new ValidationError('Warehouse is required');
    }

    if (!dto.quantity || dto.quantity <= 0) {
      throw new ValidationError('Quantity must be positive');
    }

    // Find existing inventory or create new one
    let inventory = await this.inventoryRepository.findByProduct(
      dto.productId || dto.materialId!,
      dto.warehouse,
      dto.ownership || InventoryOwnership.COMPANY
    );

    if (inventory) {
      // Add to existing quantity
      const newQty = Number(inventory.quantity) + dto.quantity;
      inventory = await this.inventoryRepository.update(inventory.id, {
        quantity: newQty as any,
      });
    } else {
      // Create new inventory record
      inventory = await this.inventoryRepository.create({
        productId: dto.productId || null,
        materialId: dto.materialId || null,
        warehouse: dto.warehouse,
        ownership: dto.ownership || InventoryOwnership.COMPANY,
        customerId: dto.customerId || null,
        quantity: dto.quantity as any,
        reservedQty: 0 as any,
        unit: dto.unit || 'pcs',
        location: null,
      });
    }

    // Record transaction
    await this.inventoryRepository.recordTransaction({
      inventoryId: inventory.id,
      type: InventoryTransactionType.IN,
      quantity: dto.quantity as any,
      reference: dto.reference || null,
      notes: dto.notes || null,
    });

    return {
      id: inventory.id,
      productId: inventory.productId,
      materialId: inventory.materialId,
      ownership: inventory.ownership,
      customerId: inventory.customerId,
      warehouse: inventory.warehouse,
      location: inventory.location,
      quantity: Number(inventory.quantity),
      reservedQty: Number(inventory.reservedQty),
      availableQty: Number(inventory.quantity) - Number(inventory.reservedQty),
      unit: inventory.unit,
      lastUpdated: inventory.lastUpdated,
    };
  }
}

export interface StockAdjustmentDto {
  inventoryId: string;
  adjustmentQty: number;
  reason: string;
  notes?: string;
}

export class AdjustStockUseCase {
  constructor(private inventoryRepository: IInventoryRepository) {}

  async execute(dto: StockAdjustmentDto): Promise<InventoryResponseDto> {
    const inventory = await this.inventoryRepository.findById(dto.inventoryId);
    if (!inventory) {
      throw new NotFoundError('Inventory', dto.inventoryId);
    }

    const newQty = Number(inventory.quantity) + dto.adjustmentQty;
    if (newQty < 0) {
      throw new ValidationError('Resulting quantity cannot be negative');
    }

    const updated = await this.inventoryRepository.update(dto.inventoryId, {
      quantity: newQty as any,
    });

    // Record transaction
    await this.inventoryRepository.recordTransaction({
      inventoryId: inventory.id,
      type: InventoryTransactionType.ADJUST,
      quantity: dto.adjustmentQty as any,
      reference: dto.reason,
      notes: dto.notes || null,
    });

    return {
      id: updated.id,
      productId: updated.productId,
      materialId: updated.materialId,
      ownership: updated.ownership,
      customerId: updated.customerId,
      warehouse: updated.warehouse,
      location: updated.location,
      quantity: Number(updated.quantity),
      reservedQty: Number(updated.reservedQty),
      availableQty: Number(updated.quantity) - Number(updated.reservedQty),
      unit: updated.unit,
      lastUpdated: updated.lastUpdated,
    };
  }
}
