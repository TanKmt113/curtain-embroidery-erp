import { PrismaClient } from '@prisma/client';
import { PrismaInventoryRepository } from '../../infrastructure/repositories/PrismaInventoryRepository';
import {
  ListInventoryUseCase,
  GetInventoryUseCase,
  ReceiveStockUseCase,
  AdjustStockUseCase,
} from '../../application/use-cases/inventory';
import { InventoryController } from '../../presentation/controllers/InventoryController';

export const makeInventoryController = (prisma: PrismaClient): InventoryController => {
  const inventoryRepository = new PrismaInventoryRepository(prisma);

  const listInventoryUseCase = new ListInventoryUseCase(inventoryRepository);
  const getInventoryUseCase = new GetInventoryUseCase(inventoryRepository);
  const receiveStockUseCase = new ReceiveStockUseCase(inventoryRepository);
  const adjustStockUseCase = new AdjustStockUseCase(inventoryRepository);

  return new InventoryController(
    listInventoryUseCase,
    getInventoryUseCase,
    receiveStockUseCase,
    adjustStockUseCase
  );
};
