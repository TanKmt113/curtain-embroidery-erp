import { ICustomerRepository } from '../../../domain/repositories';
import { Customer } from '../../../domain/entities';
import { EntityNotFoundError } from '../../../domain/errors';

export class GetCustomerUseCase {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findById(id);

    if (!customer) {
      throw new EntityNotFoundError('Customer', id);
    }

    return customer;
  }
}
