import { PrismaClient } from '@prisma/client';
import { PrismaDeliveryRepository } from '../../infrastructure/repositories/PrismaDeliveryRepository';
import {
  ListDeliveriesUseCase,
  GetDeliveryUseCase,
  CreateDeliveryUseCase,
  UpdateDeliveryStatusUseCase,
} from '../../application/use-cases/delivery';
import { DeliveryController } from '../../presentation/controllers/DeliveryController';

export const makeDeliveryController = (prisma: PrismaClient): DeliveryController => {
  const deliveryRepository = new PrismaDeliveryRepository(prisma);

  const listDeliveriesUseCase = new ListDeliveriesUseCase(deliveryRepository);
  const getDeliveryUseCase = new GetDeliveryUseCase(deliveryRepository);
  const createDeliveryUseCase = new CreateDeliveryUseCase(deliveryRepository);
  const updateDeliveryStatusUseCase = new UpdateDeliveryStatusUseCase(deliveryRepository);

  return new DeliveryController(
    listDeliveriesUseCase,
    getDeliveryUseCase,
    createDeliveryUseCase,
    updateDeliveryStatusUseCase
  );
};
