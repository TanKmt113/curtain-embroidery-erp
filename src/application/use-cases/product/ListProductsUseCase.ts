import { IProductRepository, ProductFilters, PaginatedResult } from '../../../domain/repositories';
import { Product, ProductType } from '../../../domain/entities/Product';
import { ProductListQueryDto, ProductResponseDto } from '../../dtos/product.dto';
import { NotFoundError } from '../../../domain/errors/DomainErrors';

export class ListProductsUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(query: ProductListQueryDto): Promise<PaginatedResult<ProductResponseDto>> {
    const filters: ProductFilters = {
      search: query.search,
      type: query.type as ProductType,
      isActive: query.isActive,
    };

    const pagination = {
      page: query.page || 1,
      pageSize: query.pageSize || 20,
    };

    const result = await this.productRepository.findAll(filters, pagination);

    return {
      data: result.data.map(this.toResponseDto),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
      totalPages: result.totalPages,
    };
  }

  private toResponseDto(product: Product): ProductResponseDto {
    return {
      id: product.id,
      code: product.code,
      name: product.name,
      type: product.type,
      unit: product.unit,
      basePrice: Number(product.basePrice),
      description: product.description || undefined,
      image: product.image || undefined,
      isActive: product.isActive,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}

export class GetProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(id: string): Promise<ProductResponseDto> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundError('Product', id);
    }

    return {
      id: product.id,
      code: product.code,
      name: product.name,
      type: product.type,
      unit: product.unit,
      basePrice: Number(product.basePrice),
      description: product.description || undefined,
      image: product.image || undefined,
      isActive: product.isActive,
      materials: product.materials?.map((m) => ({
        id: m.id,
        productId: m.productId,
        materialId: m.materialId,
        quantity: Number(m.quantity),
      })),
      routingSteps: product.routingSteps?.map((s) => ({
        id: s.id,
        productId: s.productId,
        stepNumber: s.stepNumber,
        name: s.name,
        description: s.description || undefined,
        standardTime: s.standardTime || undefined,
        laborCost: s.laborCost ? Number(s.laborCost) : undefined,
      })),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
