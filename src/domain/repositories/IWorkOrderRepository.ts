import { WorkOrder, WorkOrderStep, WorkOrderStatus } from '../entities/WorkOrder';
import { PaginationOptions, PaginatedResult } from './ICustomerRepository';

export interface WorkOrderFilters {
  search?: string;
  orderId?: string;
  status?: WorkOrderStatus;
  assigneeId?: string;
  fromDate?: Date;
  toDate?: Date;
}

export interface IWorkOrderRepository {
  findById(id: string): Promise<WorkOrder | null>;
  findByIdWithSteps(id: string): Promise<WorkOrder | null>;
  findByCode(code: string): Promise<WorkOrder | null>;
  findAll(filters: WorkOrderFilters, pagination: PaginationOptions): Promise<PaginatedResult<WorkOrder>>;
  findByOrderId(orderId: string): Promise<WorkOrder[]>;
  create(workOrder: Omit<WorkOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<WorkOrder>;
  update(id: string, data: Partial<WorkOrder>): Promise<WorkOrder>;
  delete(id: string): Promise<void>;
  getNextCode(): Promise<string>;
  
  // Steps
  addStep(step: Omit<WorkOrderStep, 'id'>): Promise<WorkOrderStep>;
  updateStep(id: string, data: Partial<WorkOrderStep>): Promise<WorkOrderStep>;
  getSteps(workOrderId: string): Promise<WorkOrderStep[]>;
}
