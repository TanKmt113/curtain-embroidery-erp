import { IProductRepository } from '../../../domain/repositories';
import { ProductType } from '../../../domain/entities/Product';
import { CreateProductDto, ProductResponseDto } from '../../dtos/product.dto';
import { ValidationError } from '../../../domain/errors/DomainErrors';

export class CreateProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(dto: CreateProductDto): Promise<ProductResponseDto> {
    // Validate required fields
    if (!dto.name || !dto.type || !dto.unit || dto.basePrice === undefined) {
      throw new ValidationError('Name, type, unit, and basePrice are required');
    }

    // Validate product type
    if (!Object.values(ProductType).includes(dto.type)) {
      throw new ValidationError('Invalid product type');
    }

    // Generate product code
    const code = await this.productRepository.getNextCode(dto.type);

    // Create product
    const product = await this.productRepository.create({
      code,
      name: dto.name,
      type: dto.type,
      unit: dto.unit,
      basePrice: dto.basePrice as any, // Prisma Decimal
      description: dto.description || null,
      specifications: dto.specifications || null,
      isActive: true,
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
