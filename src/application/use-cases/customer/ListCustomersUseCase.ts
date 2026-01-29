import { ICustomerRepository, PaginatedResult } from '../../../domain/repositories';
import { ListCustomersDTO } from '../../dtos';
import { Customer } from '../../../domain/entities';

export class ListCustomersUseCase {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute(dto: ListCustomersDTO): Promise<PaginatedResult<Customer>> {
    const page = dto.page || 1;
    const pageSize = Math.min(dto.pageSize || 20, 100);

    const result = await this.customerRepository.findAll(
      {
        search: dto.search,
        type: dto.type,
        isActive: dto.isActive,
      },
      { page, pageSize }
    );

    return result;
  }
}
