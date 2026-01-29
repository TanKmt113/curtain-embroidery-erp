import { Decimal } from '@prisma/client/runtime/library';

export interface Inventory {
  id: string;
  productId?: string | null;
  materialId?: string | null;
  ownership: InventoryOwnership;
  customerId?: string | null;
  warehouse: string;
  location?: string | null;
  quantity: Decimal | number;
  reservedQty: Decimal | number;
  minStock?: Decimal | number;
  maxStock?: Decimal | number | null;
  unit: string;
  lastUpdated: Date;
}

export enum InventoryOwnership {
  COMPANY = 'COMPANY',
  CONSIGNMENT = 'CONSIGNMENT',
}

export interface InventoryTransaction {
  id: string;
  inventoryId: string;
  type: InventoryTransactionType;
  quantity: Decimal | number;
  balanceAfter?: Decimal | number;
  referenceType?: string | null;
  referenceId?: string | null;
  reference?: string | null;
  notes?: string | null;
  createdById?: string;
  createdAt: Date;
}

export enum InventoryTransactionType {
  IN = 'IN',
  OUT = 'OUT',
  ADJUST = 'ADJUST',
  ADJUSTMENT = 'ADJUSTMENT',
  TRANSFER = 'TRANSFER',
  RESERVE = 'RESERVE',
}
