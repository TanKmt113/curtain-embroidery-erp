import { WorkOrderStatus } from '../../domain/entities/WorkOrder';

// ==================== Work Order DTOs ====================
export interface CreateWorkOrderDto {
  orderId: string;
  orderItemId: string;
  assigneeId?: string;
  priority?: number;
  startDate?: Date;
  dueDate?: Date;
  notes?: string;
}

export interface UpdateWorkOrderDto {
  assigneeId?: string;
  priority?: number;
  startDate?: Date;
  dueDate?: Date;
  notes?: string;
}

export interface WorkOrderResponseDto {
  id: string;
  code: string;
  orderId: string;
  order?: {
    id: string;
    code: string;
    customerName: string;
  };
  orderItemId: string;
  orderItem?: {
    id: string;
    productName: string;
    windowName?: string;
    batchCode?: string;
  };
  status: WorkOrderStatus;
  assigneeId?: string;
  assignee?: {
    id: string;
    fullName: string;
  };
  priority: number;
  startDate?: Date;
  dueDate?: Date;
  completedAt?: Date;
  notes?: string;
  steps?: WorkOrderStepResponseDto[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkOrderListQueryDto {
  search?: string;
  orderId?: string;
  status?: WorkOrderStatus;
  assigneeId?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  pageSize?: number;
}

// ==================== Work Order Step DTOs ====================
export interface UpdateWorkOrderStepDto {
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED';
  notes?: string;
}

export interface WorkOrderStepResponseDto {
  id: string;
  workOrderId: string;
  routingStepId: string;
  routingStep?: {
    stepNumber: number;
    name: string;
    standardTime?: number;
  };
  status: string;
  startedAt?: Date;
  completedAt?: Date;
  notes?: string;
}

// ==================== Status Transition DTOs ====================
export interface UpdateWorkOrderStatusDto {
  status: WorkOrderStatus;
  reason?: string;
}

export interface StartWorkOrderDto {
  actualStartDate?: Date;
}

export interface CompleteWorkOrderDto {
  completedAt?: Date;
  notes?: string;
}