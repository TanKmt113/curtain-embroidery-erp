import { IQuotationRepository, PaginatedResult } from '../../../domain/repositories';
import { QuotationStatus } from '../../../domain/entities/Quotation';
import { NotFoundError, ValidationError } from '../../../domain/errors/DomainErrors';

export interface QuotationListQueryDto {
  customerId?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  pageSize?: number;
}

export interface QuotationResponseDto {
  id: string;
  code: string;
  customerId: string;
  status: QuotationStatus;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  validUntil?: Date | null;
  notes?: string | null;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ListQuotationsUseCase {
  constructor(private quotationRepository: IQuotationRepository) {}

  async execute(query: QuotationListQueryDto): Promise<PaginatedResult<QuotationResponseDto>> {
    const filters = {
      customerId: query.customerId,
      status: query.status as QuotationStatus,
      fromDate: query.fromDate ? new Date(query.fromDate) : undefined,
      toDate: query.toDate ? new Date(query.toDate) : undefined,
    };

    const pagination = {
      page: query.page || 1,
      pageSize: query.pageSize || 20,
    };

    const result = await this.quotationRepository.findAll(filters, pagination);

    return {
      data: result.data.map((q) => ({
        id: q.id,
        code: q.code,
        customerId: q.customerId,
        status: q.status,
        subtotal: Number(q.subtotal),
        discount: Number(q.discount),
        tax: Number(q.tax),
        total: Number(q.total),
        validUntil: q.validUntil,
        notes: q.notes,
        createdById: q.createdById,
        createdAt: q.createdAt,
        updatedAt: q.updatedAt,
      })),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
      totalPages: result.totalPages,
    };
  }
}

export class GetQuotationUseCase {
  constructor(private quotationRepository: IQuotationRepository) {}

  async execute(id: string): Promise<QuotationResponseDto> {
    const quotation = await this.quotationRepository.findById(id);

    if (!quotation) {
      throw new NotFoundError('Quotation', id);
    }

    return {
      id: quotation.id,
      code: quotation.code,
      customerId: quotation.customerId,
      status: quotation.status,
      subtotal: Number(quotation.subtotal),
      discount: Number(quotation.discount),
      tax: Number(quotation.tax),
      total: Number(quotation.total),
      validUntil: quotation.validUntil,
      notes: quotation.notes,
      createdById: quotation.createdById,
      createdAt: quotation.createdAt,
      updatedAt: quotation.updatedAt,
    };
  }
}

// Valid status transitions
const STATUS_TRANSITIONS: Record<QuotationStatus, QuotationStatus[]> = {
  [QuotationStatus.DRAFT]: [QuotationStatus.SENT],
  [QuotationStatus.SENT]: [QuotationStatus.APPROVED, QuotationStatus.REJECTED, QuotationStatus.EXPIRED],
  [QuotationStatus.APPROVED]: [],
  [QuotationStatus.REJECTED]: [],
  [QuotationStatus.EXPIRED]: [QuotationStatus.SENT], // Can resend
  // Add other statuses if they exist in enum
  [QuotationStatus.ACCEPTED]: [],
  [QuotationStatus.CONVERTED]: [],
  [QuotationStatus.CANCELLED]: [],
};

export interface UpdateQuotationStatusDto {
  status: QuotationStatus;
  notes?: string;
}

export class UpdateQuotationStatusUseCase {
  constructor(private quotationRepository: IQuotationRepository) {}

  async execute(id: string, dto: UpdateQuotationStatusDto): Promise<QuotationResponseDto> {
    const quotation = await this.quotationRepository.findById(id);
    if (!quotation) {
      throw new NotFoundError('Quotation', id);
    }

    const allowedTransitions = STATUS_TRANSITIONS[quotation.status] || [];
    if (!allowedTransitions.includes(dto.status)) {
      throw new ValidationError(
        `Cannot transition from ${quotation.status} to ${dto.status}. Allowed: ${allowedTransitions.join(', ') || 'none'}`
      );
    }

    const updated = await this.quotationRepository.update(id, {
      status: dto.status,
      notes: dto.notes || quotation.notes,
    });

    return {
      id: updated.id,
      code: updated.code,
      customerId: updated.customerId,
      status: updated.status,
      subtotal: Number(updated.subtotal),
      discount: Number(updated.discount),
      tax: Number(updated.tax),
      total: Number(updated.total),
      validUntil: updated.validUntil,
      notes: updated.notes,
      createdById: updated.createdById,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }
}
