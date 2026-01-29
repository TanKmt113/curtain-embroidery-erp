import { IProductRepository } from '../../../domain/repositories';
import { NotFoundError } from '../../../domain/errors/DomainErrors';

export class DeleteProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(id: string): Promise<void> {
    // Check if product exists
    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new NotFoundError('Product', id);
    }

    // Soft delete by setting isActive to false
    await this.productRepository.update(id, { isActive: false });
  }
}
