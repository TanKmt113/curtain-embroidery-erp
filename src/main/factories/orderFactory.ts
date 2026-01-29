import { PrismaClient } from '@prisma/client';
import { PrismaOrderRepository } from '../../infrastructure/repositories/PrismaOrderRepository';
import {
  ListOrdersUseCase,
  GetOrderUseCase,
  CreateOrderUseCase,
  UpdateOrderStatusUseCase,
} from '../../application/use-cases/order';
import { OrderController } from '../../presentation/controllers/OrderController';

export const makeOrderController = (prisma: PrismaClient): OrderController => {
  const orderRepository = new PrismaOrderRepository(prisma);

  const listOrdersUseCase = new ListOrdersUseCase(orderRepository);
  const getOrderUseCase = new GetOrderUseCase(orderRepository);
  const createOrderUseCase = new CreateOrderUseCase(orderRepository);
  const updateOrderStatusUseCase = new UpdateOrderStatusUseCase(orderRepository);

  return new OrderController(
    listOrdersUseCase,
    getOrderUseCase,
    createOrderUseCase,
    updateOrderStatusUseCase
  );
};
