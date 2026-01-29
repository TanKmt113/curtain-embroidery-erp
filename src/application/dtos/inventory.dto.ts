import { InventoryOwnership } from '../../domain/entities/Inventory';

// ==================== Inventory DTOs ====================
export interface CreateInventoryDto {
  productId?: string;
  materialId?: string;
  warehouse: string;
  ownership: InventoryOwnership;
  customerId?: string;
  quantity: number;
  unit: string;
  reservedQty?: number;
}

export interface UpdateInventoryDto {
  warehouse?: string;
  location?: string;
}

export interface InventoryResponseDto {
  id: string;
  productId?: string;
  product?: {
    id: string;
    code: string;
    name: string;
    type: string;
    unit: string;
  };
  materialId?: string;
  material?: {
    id: string;
    code: string;
    name: string;
    unit: string;
  };
  warehouse: string;
  location?: string;
  ownership: InventoryOwnership;
  customerId?: string;
  customer?: {
    id: string;
    code: string;
    name: string;
  };
  quantity: number;
  unit: string;
  reservedQty: number;
  availableQty: number;
  lastUpdated: Date;
}

export interface InventoryListQueryDto {
  productId?: string;
  materialId?: string;
  ownership?: InventoryOwnership;
  customerId?: string;
  warehouse?: string;
  lowStock?: boolean;
  page?: number;
  pageSize?: number;
}

// ==================== Inventory Transaction DTOs ====================
export interface CreateInventoryTransactionDto {
  inventoryId: string;
  type: 'IN' | 'OUT' | 'ADJUST' | 'TRANSFER' | 'RESERVE';
  quantity: number;
  referenceType?: string;
  referenceId?: string;
  notes?: string;
}

export interface InventoryTransactionResponseDto {
  id: string;
  inventoryId: string;
  type: string;
  quantity: number;
  balanceAfter: number;
  referenceType?: string;
  referenceId?: string;
  notes?: string;
  createdById: string;
  createdBy?: {
    id: string;
    fullName: string;
  };
  createdAt: Date;
}

export interface TransactionListQueryDto {
  inventoryId?: string;
  type?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  pageSize?: number;
}

// ==================== Stock Operations DTOs ====================
export interface StockAdjustmentDto {
  inventoryId: string;
  adjustmentQty: number;
  reason: string;
}

export interface StockTransferDto {
  fromInventoryId: string;
  toWarehouse: string;
  quantity: number;
  notes?: string;
}

export interface StockReceiveDto {
  productId?: string;
  materialId?: string;
  warehouse: string;
  ownership?: InventoryOwnership;
  customerId?: string;
  quantity: number;
  referenceType?: string;
  referenceId?: string;
  notes?: string;
}

export interface StockIssueDto {
  inventoryId: string;
  quantity: number;
  referenceType?: string;
  referenceId?: string;
  notes?: string;
}