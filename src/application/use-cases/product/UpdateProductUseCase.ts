import { IProductRepository } from '../../../domain/repositories';
import { UpdateProductDto, ProductResponseDto } from '../../dtos/product.dto';
import { NotFoundError } from '../../../domain/errors/DomainErrors';

export class UpdateProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(id: string, dto: UpdateProductDto): Promise<ProductResponseDto> {
    // Check if product exists
    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new NotFoundError('Product', id);
    }

    // Update product
    const product = await this.productRepository.update(id, {
      name: dto.name,
      unit: dto.unit,
      basePrice: dto.basePrice !== undefined ? (dto.basePrice as any) : undefined,
      description: dto.description,
      specifications: dto.specifications,
      isActive: dto.isActive,
    });

    return {
      id: product.id,
      code: product.code,
      name: product.name,
      type: product.type,
      unit: product.unit,
      basePrice: Number(product.basePrice),
      description: product.description || undefined,
      specifications: product.specifications as Record<string, any> | undefined,
      isActive: product.isActive,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
