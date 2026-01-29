import { PrismaClient } from '@prisma/client';
import { PrismaQuotationRepository } from '../../infrastructure/repositories/PrismaQuotationRepository';
import {
  ListQuotationsUseCase,
  GetQuotationUseCase,
  CreateQuotationUseCase,
  UpdateQuotationStatusUseCase,
} from '../../application/use-cases/quotation';
import { QuotationController } from '../../presentation/controllers/QuotationController';

export const makeQuotationController = (prisma: PrismaClient): QuotationController => {
  const quotationRepository = new PrismaQuotationRepository(prisma);

  const listQuotationsUseCase = new ListQuotationsUseCase(quotationRepository);
  const getQuotationUseCase = new GetQuotationUseCase(quotationRepository);
  const createQuotationUseCase = new CreateQuotationUseCase(quotationRepository);
  const updateQuotationStatusUseCase = new UpdateQuotationStatusUseCase(quotationRepository);

  return new QuotationController(
    listQuotationsUseCase,
    getQuotationUseCase,
    createQuotationUseCase,
    updateQuotationStatusUseCase
  );
};
