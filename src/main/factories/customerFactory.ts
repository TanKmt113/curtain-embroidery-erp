import { prisma } from '../../infrastructure/database';
import { PrismaCustomerRepository } from '../../infrastructure/repositories';
import {
  CreateCustomerUseCase,
  ListCustomersUseCase,
  GetCustomerUseCase,
  UpdateCustomerUseCase,
} from '../../application/use-cases/customer';
import { CustomerController } from '../../presentation/controllers';

export function makeCustomerController(): CustomerController {
  const customerRepository = new PrismaCustomerRepository(prisma);

  const createCustomerUseCase = new CreateCustomerUseCase(customerRepository);
  const listCustomersUseCase = new ListCustomersUseCase(customerRepository);
  const getCustomerUseCase = new GetCustomerUseCase(customerRepository);
  const updateCustomerUseCase = new UpdateCustomerUseCase(customerRepository);

  return new CustomerController(
    createCustomerUseCase,
    listCustomersUseCase,
    getCustomerUseCase,
    updateCustomerUseCase
  );
}
