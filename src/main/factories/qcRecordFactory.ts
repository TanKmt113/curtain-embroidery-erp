import { PrismaClient } from '@prisma/client';
import { PrismaQCRecordRepository } from '../../infrastructure/repositories/PrismaQCRecordRepository';
import {
  ListQCRecordsUseCase,
  GetQCRecordUseCase,
  CreateQCRecordUseCase,
  UpdateQCRecordUseCase,
} from '../../application/use-cases/qc-record';
import { QCRecordController } from '../../presentation/controllers/QCRecordController';

export const makeQCRecordController = (prisma: PrismaClient): QCRecordController => {
  const qcRecordRepository = new PrismaQCRecordRepository(prisma);

  const listQCRecordsUseCase = new ListQCRecordsUseCase(qcRecordRepository);
  const getQCRecordUseCase = new GetQCRecordUseCase(qcRecordRepository);
  const createQCRecordUseCase = new CreateQCRecordUseCase(qcRecordRepository);
  const updateQCRecordUseCase = new UpdateQCRecordUseCase(qcRecordRepository);

  return new QCRecordController(
    listQCRecordsUseCase,
    getQCRecordUseCase,
    createQCRecordUseCase,
    updateQCRecordUseCase
  );
};
