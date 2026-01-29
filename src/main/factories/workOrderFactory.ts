import { PrismaClient } from '@prisma/client';
import { PrismaWorkOrderRepository } from '../../infrastructure/repositories/PrismaWorkOrderRepository';
import {
  ListWorkOrdersUseCase,
  GetWorkOrderUseCase,
  CreateWorkOrderUseCase,
  UpdateWorkOrderStatusUseCase,
  CompleteWorkOrderUseCase,
} from '../../application/use-cases/work-order';
import { WorkOrderController } from '../../presentation/controllers/WorkOrderController';

export const makeWorkOrderController = (prisma: PrismaClient): WorkOrderController => {
  const workOrderRepository = new PrismaWorkOrderRepository(prisma);

  const listWorkOrdersUseCase = new ListWorkOrdersUseCase(workOrderRepository);
  const getWorkOrderUseCase = new GetWorkOrderUseCase(workOrderRepository);
  const createWorkOrderUseCase = new CreateWorkOrderUseCase(workOrderRepository);
  const updateWorkOrderStatusUseCase = new UpdateWorkOrderStatusUseCase(workOrderRepository);
  const completeWorkOrderUseCase = new CompleteWorkOrderUseCase(workOrderRepository);

  return new WorkOrderController(
    listWorkOrdersUseCase,
    getWorkOrderUseCase,
    createWorkOrderUseCase,
    updateWorkOrderStatusUseCase,
    completeWorkOrderUseCase
  );
};
