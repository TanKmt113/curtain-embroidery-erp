import { PrismaClient } from '@prisma/client';
import { PrismaProductRepository } from '../../infrastructure/repositories/PrismaProductRepository';
import {
  ListProductsUseCase,
  GetProductUseCase,
  CreateProductUseCase,
  UpdateProductUseCase,
  DeleteProductUseCase,
} from '../../application/use-cases/product';
import { ProductController } from '../../presentation/controllers/ProductController';

export const makeProductController = (prisma: PrismaClient): ProductController => {
  const productRepository = new PrismaProductRepository(prisma);

  const listProductsUseCase = new ListProductsUseCase(productRepository);
  const getProductUseCase = new GetProductUseCase(productRepository);
  const createProductUseCase = new CreateProductUseCase(productRepository);
  const updateProductUseCase = new UpdateProductUseCase(productRepository);
  const deleteProductUseCase = new DeleteProductUseCase(productRepository);

  return new ProductController(
    listProductsUseCase,
    getProductUseCase,
    createProductUseCase,
    updateProductUseCase,
    deleteProductUseCase
  );
};
