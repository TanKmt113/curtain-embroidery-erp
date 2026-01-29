import { Inventory, InventoryTransaction, InventoryOwnership } from '../entities/Inventory';
import { PaginationOptions, PaginatedResult } from './ICustomerRepository';

export interface InventoryFilters {
  productId?: string;
  materialId?: string;
  ownership?: InventoryOwnership;
  customerId?: string;
  warehouse?: string;
  lowStock?: boolean;
}

export interface IInventoryRepository {
  findById(id: string): Promise<Inventory | null>;
  findByProductAndWarehouse(productId: string, warehouse: string, ownership: InventoryOwnership, customerId?: string): Promise<Inventory | null>;
  findByMaterialAndWarehouse(materialId: string, warehouse: string): Promise<Inventory | null>;
  findByProduct(productOrMaterialId: string, warehouse: string, ownership: InventoryOwnership): Promise<Inventory | null>;
  findAll(filters: InventoryFilters, pagination: PaginationOptions): Promise<PaginatedResult<Inventory>>;
  create(inventory: Omit<Inventory, 'id' | 'lastUpdated'>): Promise<Inventory>;
  update(id: string, data: Partial<Inventory>): Promise<Inventory>;
  
  // Transactions
  createTransaction(transaction: Omit<InventoryTransaction, 'id' | 'createdAt'>): Promise<InventoryTransaction>;
  recordTransaction(transaction: Omit<InventoryTransaction, 'id' | 'createdAt'>): Promise<InventoryTransaction>;
  getTransactions(inventoryId: string, pagination: PaginationOptions): Promise<PaginatedResult<InventoryTransaction>>;
  
  // Stock operations
  adjustQuantity(id: string, quantityChange: number): Promise<Inventory>;
  reserveStock(id: string, quantity: number): Promise<Inventory>;
  releaseReservation(id: string, quantity: number): Promise<Inventory>;
}
