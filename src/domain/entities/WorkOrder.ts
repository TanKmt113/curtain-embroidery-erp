export interface WorkOrder {
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
  steps?: WorkOrderStep[];
}

export enum WorkOrderStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ON_HOLD = 'ON_HOLD',
}

export interface WorkOrderStep {
  id: string;
  workOrderId: string;
  routingStepId: string;
  stepNumber: number;
  status: WorkOrderStatus;
  startedAt?: Date | null;
  completedAt?: Date | null;
  notes?: string | null;
}
