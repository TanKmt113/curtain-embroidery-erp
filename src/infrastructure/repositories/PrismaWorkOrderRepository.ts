import { PrismaClient, Prisma } from '@prisma/client';
import { WorkOrder, WorkOrderStep, WorkOrderStatus } from '../../domain/entities/WorkOrder';
import { IWorkOrderRepository, WorkOrderFilters, PaginatedResult, PaginationOptions } from '../../domain/repositories';

export class PrismaWorkOrderRepository implements IWorkOrderRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<WorkOrder | null> {
    const workOrder = await this.prisma.workOrder.findUnique({
      where: { id },
    });

    return workOrder as WorkOrder | null;
  }

  async findByIdWithSteps(id: string): Promise<WorkOrder | null> {
    const workOrder = await this.prisma.workOrder.findUnique({
      where: { id },
      include: {
        order: {
          select: { id: true, code: true, customer: { select: { name: true } } },
        },
        orderItem: {
          include: { product: { select: { name: true } } },
        },
        assignee: {
          select: { id: true, fullName: true },
        },
        steps: {
          include: {
            routingStep: true,
          },
          orderBy: { routingStep: { stepNumber: 'asc' } },
        },
      },
    });

    return workOrder as WorkOrder | null;
  }

  async findByCode(code: string): Promise<WorkOrder | null> {
    const workOrder = await this.prisma.workOrder.findUnique({
      where: { code },
    });

    return workOrder as WorkOrder | null;
  }

  async findAll(filters: WorkOrderFilters, pagination: PaginationOptions): Promise<PaginatedResult<WorkOrder>> {
    const where: Prisma.WorkOrderWhereInput = {};

    if (filters.search) {
      where.OR = [
        { code: { contains: filters.search, mode: 'insensitive' } },
        { order: { code: { contains: filters.search, mode: 'insensitive' } } },
      ];
    }

    if (filters.orderId) {
      where.orderId = filters.orderId;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.assigneeId) {
      where.assigneeId = filters.assigneeId;
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
      this.prisma.workOrder.count({ where }),
      this.prisma.workOrder.findMany({
        where,
        include: {
          order: { select: { id: true, code: true } },
          assignee: { select: { id: true, fullName: true } },
        },
        skip: (pagination.page - 1) * pagination.pageSize,
        take: pagination.pageSize,
        orderBy: [{ priority: 'asc' }, { createdAt: 'desc' }],
      }),
    ]);

    return {
      data: data as WorkOrder[],
      total,
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalPages: Math.ceil(total / pagination.pageSize),
    };
  }

  async findByOrderId(orderId: string): Promise<WorkOrder[]> {
    const workOrders = await this.prisma.workOrder.findMany({
      where: { orderId },
      orderBy: { createdAt: 'asc' },
    });

    return workOrders as WorkOrder[];
  }

  async create(workOrder: Omit<WorkOrder, 'id' | 'code' | 'createdAt' | 'updatedAt'>): Promise<WorkOrder> {
    const created = await this.prisma.workOrder.create({
      data: workOrder as any,
    });

    return created as WorkOrder;
  }

  async update(id: string, data: Partial<WorkOrder>): Promise<WorkOrder> {
    const updated = await this.prisma.workOrder.update({
      where: { id },
      data: data as any,
    });

    return updated as WorkOrder;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.workOrder.delete({
      where: { id },
    });
  }

  async getNextCode(): Promise<string> {
    const prefix = 'WO';
    const today = new Date();
    const yearMonth = `${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}`;
    const fullPrefix = `${prefix}${yearMonth}`;

    const lastWorkOrder = await this.prisma.workOrder.findFirst({
      where: { code: { startsWith: fullPrefix } },
      orderBy: { code: 'desc' },
    });

    let nextNumber = 1;
    if (lastWorkOrder) {
      const match = lastWorkOrder.code.match(/\d+$/);
      if (match) {
        nextNumber = parseInt(match[0], 10) + 1;
      }
    }

    return `${fullPrefix}${nextNumber.toString().padStart(4, '0')}`;
  }

  // Steps methods
  async addStep(step: Omit<WorkOrderStep, 'id'>): Promise<WorkOrderStep> {
    const created = await this.prisma.workOrderStep.create({
      data: step as any,
    });

    return created as WorkOrderStep;
  }

  async updateStep(id: string, data: Partial<WorkOrderStep>): Promise<WorkOrderStep> {
    const updated = await this.prisma.workOrderStep.update({
      where: { id },
      data: data as any,
    });

    return updated as WorkOrderStep;
  }

  async getSteps(workOrderId: string): Promise<WorkOrderStep[]> {
    const steps = await this.prisma.workOrderStep.findMany({
      where: { workOrderId },
      include: {
        routingStep: true,
      },
      orderBy: { routingStep: { stepNumber: 'asc' } },
    });

    return steps as WorkOrderStep[];
  }
}
