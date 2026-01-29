import { PrismaClient, Prisma } from '@prisma/client';
import { QCRecord, QCResult } from '../../domain/entities/QCRecord';
import { IQCRecordRepository, QCRecordFilters, PaginatedResult, PaginationOptions } from '../../domain/repositories';

export class PrismaQCRecordRepository implements IQCRecordRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<QCRecord | null> {
    const qcRecord = await this.prisma.qCRecord.findUnique({
      where: { id },
      include: {
        order: {
          select: { id: true, code: true, customer: { select: { name: true } } },
        },
        inspector: {
          select: { id: true, fullName: true },
        },
      },
    });

    return qcRecord as QCRecord | null;
  }

  async findByCode(code: string): Promise<QCRecord | null> {
    const qcRecord = await this.prisma.qCRecord.findUnique({
      where: { code },
    });

    return qcRecord as QCRecord | null;
  }

  async findByOrderId(orderId: string): Promise<QCRecord[]> {
    const qcRecords = await this.prisma.qCRecord.findMany({
      where: { orderId },
      include: {
        inspector: { select: { id: true, fullName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return qcRecords as QCRecord[];
  }

  async findAll(filters: QCRecordFilters, pagination: PaginationOptions): Promise<PaginatedResult<QCRecord>> {
    const where: Prisma.QCRecordWhereInput = {};

    if (filters.orderId) {
      where.orderId = filters.orderId;
    }

    if (filters.inspectorId) {
      where.inspectorId = filters.inspectorId;
    }

    if (filters.result) {
      where.result = filters.result as any;
    }

    if (filters.fromDate || filters.toDate) {
      where.createdAt = {};
      if (filters.fromDate) {
        where.createdAt.gte = filters.fromDate;
      }
      if (filters.toDate) {
        where.createdAt.lte = filters.toDate;
      }
    }

    const [total, data] = await Promise.all([
      this.prisma.qCRecord.count({ where }),
      this.prisma.qCRecord.findMany({
        where,
        include: {
          order: { select: { id: true, code: true } },
          inspector: { select: { id: true, fullName: true } },
        },
        skip: (pagination.page - 1) * pagination.pageSize,
        take: pagination.pageSize,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      data: data as QCRecord[],
      total,
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalPages: Math.ceil(total / pagination.pageSize),
    };
  }

  async create(qcRecord: Omit<QCRecord, 'id' | 'code' | 'createdAt' | 'updatedAt'>): Promise<QCRecord> {
    const created = await this.prisma.qCRecord.create({
      data: qcRecord as any,
    });

    return created as QCRecord;
  }

  async update(id: string, data: Partial<QCRecord>): Promise<QCRecord> {
    const updated = await this.prisma.qCRecord.update({
      where: { id },
      data: data as any,
    });

    return updated as QCRecord;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.qCRecord.delete({
      where: { id },
    });
  }

  async getNextCode(): Promise<string> {
    const prefix = 'QC';
    const today = new Date();
    const yearMonth = `${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}`;
    const fullPrefix = `${prefix}${yearMonth}`;

    const lastQCRecord = await this.prisma.qCRecord.findFirst({
      where: { code: { startsWith: fullPrefix } },
      orderBy: { code: 'desc' },
    });

    let nextNumber = 1;
    if (lastQCRecord) {
      const match = lastQCRecord.code.match(/\d+$/);
      if (match) {
        nextNumber = parseInt(match[0], 10) + 1;
      }
    }

    return `${fullPrefix}${nextNumber.toString().padStart(4, '0')}`;
  }
}
