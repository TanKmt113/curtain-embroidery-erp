import { IWorkOrderRepository, PaginatedResult } from '../../../domain/repositories';
import { WorkOrderStatus } from '../../../domain/entities/WorkOrder';
import { NotFoundError, ValidationError } from '../../../domain/errors/DomainErrors';

export interface WorkOrderListQueryDto {
  orderId?: string;
  assigneeId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export interface WorkOrderResponseDto {
  id: string;
  code: string;
  orderId: string;
  orderItemId: string;
  assigneeId?: string | null;
  status: WorkOrderStatus;
  priority: number;
  startDate?: Date | null;
  dueDate?: Date | null;
  completedAt?: Date | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class ListWorkOrdersUseCase {
  constructor(private workOrderRepository: IWorkOrderRepository) {}

  async execute(query: WorkOrderListQueryDto): Promise<PaginatedResult<WorkOrderResponseDto>> {
    const filters = {
      orderId: query.orderId,
      assigneeId: query.assigneeId,
      status: query.status as WorkOrderStatus,
    };

    const pagination = {
      page: query.page || 1,
      pageSize: query.pageSize || 20,
    };

    const result = await this.workOrderRepository.findAll(filters, pagination);

    return {
      data: result.data.map((wo) => ({
        id: wo.id,
        code: wo.code,
        orderId: wo.orderId,
        orderItemId: wo.orderItemId,
        assigneeId: wo.assigneeId,
        status: wo.status,
        priority: wo.priority,
        startDate: wo.startDate,
        dueDate: wo.dueDate,
        completedAt: wo.completedAt,
        notes: wo.notes,
        createdAt: wo.createdAt,
        updatedAt: wo.updatedAt,
      })),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
      totalPages: result.totalPages,
    };
  }
}

export class GetWorkOrderUseCase {
  constructor(private workOrderRepository: IWorkOrderRepository) {}

  async execute(id: string): Promise<WorkOrderResponseDto> {
    const workOrder = await this.workOrderRepository.findById(id);

    if (!workOrder) {
      throw new NotFoundError('WorkOrder', id);
    }

    return {
      id: workOrder.id,
      code: workOrder.code,
      orderId: workOrder.orderId,
      orderItemId: workOrder.orderItemId,
      assigneeId: workOrder.assigneeId,
      status: workOrder.status,
      priority: workOrder.priority,
      startDate: workOrder.startDate,
      dueDate: workOrder.dueDate,
      completedAt: workOrder.completedAt,
      notes: workOrder.notes,
      createdAt: workOrder.createdAt,
      updatedAt: workOrder.updatedAt,
    };
  }
}

// Valid status transitions - no CANCELLED in Prisma schema
const STATUS_TRANSITIONS: Record<WorkOrderStatus, WorkOrderStatus[]> = {
  [WorkOrderStatus.PENDING]: [WorkOrderStatus.IN_PROGRESS, WorkOrderStatus.ON_HOLD],
  [WorkOrderStatus.IN_PROGRESS]: [WorkOrderStatus.COMPLETED, WorkOrderStatus.ON_HOLD],
  [WorkOrderStatus.ON_HOLD]: [WorkOrderStatus.PENDING, WorkOrderStatus.IN_PROGRESS],
  [WorkOrderStatus.COMPLETED]: [],
};

export interface UpdateWorkOrderStatusDto {
  status: WorkOrderStatus;
  notes?: string;
}

export class UpdateWorkOrderStatusUseCase {
  constructor(private workOrderRepository: IWorkOrderRepository) {}

  async execute(id: string, dto: UpdateWorkOrderStatusDto): Promise<WorkOrderResponseDto> {
    const workOrder = await this.workOrderRepository.findById(id);
    if (!workOrder) {
      throw new NotFoundError('WorkOrder', id);
    }

    const allowedTransitions = STATUS_TRANSITIONS[workOrder.status] || [];
    if (!allowedTransitions.includes(dto.status)) {
      throw new ValidationError(
        `Cannot transition from ${workOrder.status} to ${dto.status}. Allowed: ${allowedTransitions.join(', ') || 'none'}`
      );
    }

    const updateData: Partial<any> = {
      status: dto.status,
    };

    // Set start date when starting
    if (dto.status === WorkOrderStatus.IN_PROGRESS && !workOrder.startDate) {
      updateData.startDate = new Date();
    }

    // Set completed date when completing
    if (dto.status === WorkOrderStatus.COMPLETED) {
      updateData.completedAt = new Date();
    }

    if (dto.notes) {
      updateData.notes = dto.notes;
    }

    const updated = await this.workOrderRepository.update(id, updateData);

    return {
      id: updated.id,
      code: updated.code,
      orderId: updated.orderId,
      orderItemId: updated.orderItemId,
      assigneeId: updated.assigneeId,
      status: updated.status,
      priority: updated.priority,
      startDate: updated.startDate,
      dueDate: updated.dueDate,
      completedAt: updated.completedAt,
      notes: updated.notes,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }
}

export interface CreateWorkOrderDto {
  orderId: string;
  orderItemId: string;
  assigneeId?: string;
  priority?: number;
  dueDate?: string;
  notes?: string;
}

export class CreateWorkOrderUseCase {
  constructor(private workOrderRepository: IWorkOrderRepository) {}

  async execute(dto: CreateWorkOrderDto): Promise<WorkOrderResponseDto> {
    if (!dto.orderId || !dto.orderItemId) {
      throw new ValidationError('Order ID and Order Item ID are required');
    }

    const code = await this.workOrderRepository.getNextCode();

    const workOrder = await this.workOrderRepository.create({
      code,
      orderId: dto.orderId,
      orderItemId: dto.orderItemId,
      status: WorkOrderStatus.PENDING,
      assigneeId: dto.assigneeId || null,
      priority: dto.priority || 1,
      startDate: null,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
      completedAt: null,
      notes: dto.notes || null,
    });

    return {
      id: workOrder.id,
      code: workOrder.code,
      orderId: workOrder.orderId,
      orderItemId: workOrder.orderItemId,
      assigneeId: workOrder.assigneeId,
      status: workOrder.status,
      priority: workOrder.priority,
      startDate: workOrder.startDate,
      dueDate: workOrder.dueDate,
      completedAt: workOrder.completedAt,
      notes: workOrder.notes,
      createdAt: workOrder.createdAt,
      updatedAt: workOrder.updatedAt,
    };
  }
}

export interface CompleteWorkOrderDto {
  notes?: string;
}

export class CompleteWorkOrderUseCase {
  constructor(private workOrderRepository: IWorkOrderRepository) {}

  async execute(id: string, dto: CompleteWorkOrderDto): Promise<WorkOrderResponseDto> {
    const workOrder = await this.workOrderRepository.findById(id);
    if (!workOrder) {
      throw new NotFoundError('WorkOrder', id);
    }

    if (workOrder.status !== WorkOrderStatus.IN_PROGRESS) {
      throw new ValidationError('Only in-progress work orders can be completed');
    }

    const updated = await this.workOrderRepository.update(id, {
      status: WorkOrderStatus.COMPLETED,
      completedAt: new Date(),
      notes: dto.notes || workOrder.notes,
    });

    return {
      id: updated.id,
      code: updated.code,
      orderId: updated.orderId,
      orderItemId: updated.orderItemId,
      assigneeId: updated.assigneeId,
      status: updated.status,
      priority: updated.priority,
      startDate: updated.startDate,
      dueDate: updated.dueDate,
      completedAt: updated.completedAt,
      notes: updated.notes,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }
}
