import { ICustomerRepository } from '../../../domain/repositories';
import { CreateCustomerDTO } from '../../dtos';
import { Customer, CustomerType } from '../../../domain/entities';
import { ConflictError } from '../../../domain/errors';

export class CreateCustomerUseCase {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute(dto: CreateCustomerDTO): Promise<Customer> {
    // Check if email already exists (if provided)
    if (dto.email) {
      const existingCustomer = await this.customerRepository.findByEmail(dto.email);
      if (existingCustomer) {
        throw new ConflictError(`Customer with email '${dto.email}' already exists`);
      }
    }

    // Generate next customer code
    const code = await this.customerRepository.getNextCode();

    const customer = await this.customerRepository.create({
      name: dto.name,
      type: dto.type || CustomerType.INDIVIDUAL,
      email: dto.email || null,
      phone: dto.phone || null,
      address: dto.address || null,
      taxCode: dto.taxCode || null,
      contactPerson: dto.contactPerson || null,
      notes: dto.notes || null,
      isActive: true,
    });

    return customer;
  }
}
