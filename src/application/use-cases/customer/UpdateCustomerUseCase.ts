import { ICustomerRepository } from '../../../domain/repositories';
import { UpdateCustomerDTO } from '../../dtos';
import { Customer } from '../../../domain/entities';
import { EntityNotFoundError, ConflictError } from '../../../domain/errors';

export class UpdateCustomerUseCase {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute(id: string, dto: UpdateCustomerDTO): Promise<Customer> {
    const existingCustomer = await this.customerRepository.findById(id);

    if (!existingCustomer) {
      throw new EntityNotFoundError('Customer', id);
    }

    // Check if email is being updated and already exists
    if (dto.email && dto.email !== existingCustomer.email) {
      const customerWithEmail = await this.customerRepository.findByEmail(dto.email);
      if (customerWithEmail && customerWithEmail.id !== id) {
        throw new ConflictError(`Customer with email '${dto.email}' already exists`);
      }
    }

    const updatedCustomer = await this.customerRepository.update(id, {
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.type !== undefined && { type: dto.type }),
      ...(dto.email !== undefined && { email: dto.email }),
      ...(dto.phone !== undefined && { phone: dto.phone }),
      ...(dto.address !== undefined && { address: dto.address }),
      ...(dto.taxCode !== undefined && { taxCode: dto.taxCode }),
      ...(dto.contactPerson !== undefined && { contactPerson: dto.contactPerson }),
      ...(dto.notes !== undefined && { notes: dto.notes }),
      ...(dto.isActive !== undefined && { isActive: dto.isActive }),
    });

    return updatedCustomer;
  }
}
