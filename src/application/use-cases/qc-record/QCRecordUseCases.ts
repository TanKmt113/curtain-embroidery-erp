import { IQCRecordRepository, PaginatedResult } from '../../../domain/repositories';
import { QCResult } from '../../../domain/entities/QCRecord';
import { NotFoundError, ValidationError } from '../../../domain/errors/DomainErrors';

export interface QCRecordListQueryDto {
  orderId?: string;
  result?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  pageSize?: number;
}

export interface QCRecordResponseDto {
  id: string;
  code: string;
  orderId: string;
  inspectorId: string;
  result: QCResult;
  checkDate: Date;
  notes?: string | null;
  defects?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class ListQCRecordsUseCase {
  constructor(private qcRecordRepository: IQCRecordRepository) {}

  async execute(query: QCRecordListQueryDto): Promise<PaginatedResult<QCRecordResponseDto>> {
    const filters = {
      orderId: query.orderId,
      result: query.result as QCResult,
      fromDate: query.fromDate ? new Date(query.fromDate) : undefined,
      toDate: query.toDate ? new Date(query.toDate) : undefined,
    };

    const pagination = {
      page: query.page || 1,
      pageSize: query.pageSize || 20,
    };

    const result = await this.qcRecordRepository.findAll(filters, pagination);

    return {
      data: result.data.map((qc) => ({
        id: qc.id,
        code: qc.code,
        orderId: qc.orderId,
        inspectorId: qc.inspectorId,
        result: qc.result,
        checkDate: qc.checkDate,
        notes: qc.notes,
        defects: qc.defects,
        createdAt: qc.createdAt,
        updatedAt: qc.updatedAt,
      })),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
      totalPages: result.totalPages,
    };
  }
}

export class GetQCRecordUseCase {
  constructor(private qcRecordRepository: IQCRecordRepository) {}

  async execute(id: string): Promise<QCRecordResponseDto> {
    const qcRecord = await this.qcRecordRepository.findById(id);

    if (!qcRecord) {
      throw new NotFoundError('QCRecord', id);
    }

    return {
      id: qcRecord.id,
      code: qcRecord.code,
      orderId: qcRecord.orderId,
      inspectorId: qcRecord.inspectorId,
      result: qcRecord.result,
      checkDate: qcRecord.checkDate,
      notes: qcRecord.notes,
      defects: qcRecord.defects,
      createdAt: qcRecord.createdAt,
      updatedAt: qcRecord.updatedAt,
    };
  }
}

export interface CreateQCRecordDto {
  orderId: string;
  result: QCResult;
  notes?: string;
  defects?: string;
}

export class CreateQCRecordUseCase {
  constructor(private qcRecordRepository: IQCRecordRepository) {}

  async execute(dto: CreateQCRecordDto, inspectorId: string): Promise<QCRecordResponseDto> {
    if (!dto.orderId) {
      throw new ValidationError('Order ID is required');
    }

    const code = await this.qcRecordRepository.getNextCode();

    const qcRecord = await this.qcRecordRepository.create({
      code,
      orderId: dto.orderId,
      inspectorId,
      result: dto.result || QCResult.PENDING,
      checkDate: new Date(),
      notes: dto.notes || null,
      defects: dto.defects || null,
    });

    return {
      id: qcRecord.id,
      code: qcRecord.code,
      orderId: qcRecord.orderId,
      inspectorId: qcRecord.inspectorId,
      result: qcRecord.result,
      checkDate: qcRecord.checkDate,
      notes: qcRecord.notes,
      defects: qcRecord.defects,
      createdAt: qcRecord.createdAt,
      updatedAt: qcRecord.updatedAt,
    };
  }
}

export interface UpdateQCRecordDto {
  result?: QCResult;
  notes?: string;
  defects?: string;
}

export class UpdateQCRecordUseCase {
  constructor(private qcRecordRepository: IQCRecordRepository) {}

  async execute(id: string, dto: UpdateQCRecordDto): Promise<QCRecordResponseDto> {
    const qcRecord = await this.qcRecordRepository.findById(id);
    if (!qcRecord) {
      throw new NotFoundError('QCRecord', id);
    }

    const updateData: Partial<any> = {};
    if (dto.result) updateData.result = dto.result;
    if (dto.notes !== undefined) updateData.notes = dto.notes;
    if (dto.defects !== undefined) updateData.defects = dto.defects;

    const updated = await this.qcRecordRepository.update(id, updateData);

    return {
      id: updated.id,
      code: updated.code,
      orderId: updated.orderId,
      inspectorId: updated.inspectorId,
      result: updated.result,
      checkDate: updated.checkDate,
      notes: updated.notes,
      defects: updated.defects,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }
}
