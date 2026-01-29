import { IOrderRepository, PaginatedResult } from '../../../domain/repositories';
import { OrderStatus } from '../../../domain/entities/Order';
import { NotFoundError, ValidationError } from '../../../domain/errors/DomainErrors';

export interface OrderListQueryDto {
  customerId?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  pageSize?: number;
}

export interface OrderResponseDto {
  id: string;
  code: string;
  customerId: string;
  quotationId?: string | null;
  status: OrderStatus;
  orderDate: Date;
  deliveryDate?: Date | null;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paidAmount: number;
  shippingAddress?: string | null;
  notes?: string | null;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ListOrdersUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(query: OrderListQueryDto): Promise<PaginatedResult<OrderResponseDto>> {
    const filters = {
      customerId: query.customerId,
      status: query.status as OrderStatus,
      fromDate: query.fromDate ? new Date(query.fromDate) : undefined,
      toDate: query.toDate ? new Date(query.toDate) : undefined,
    };

    const pagination = {
      page: query.page || 1,
      pageSize: query.pageSize || 20,
    };

    const result = await this.orderRepository.findAll(filters, pagination);

    return {
      data: result.data.map((o) => ({
        id: o.id,
        code: o.code,
        customerId: o.customerId,
        quotationId: o.quotationId,
        status: o.status,
        orderDate: o.orderDate,
        deliveryDate: o.deliveryDate,
        subtotal: Number(o.subtotal),
        discount: Number(o.discount),
        tax: Number(o.tax),
        total: Number(o.total),
        paidAmount: Number(o.paidAmount),
        shippingAddress: o.shippingAddress,
        notes: o.notes,
        createdById: o.createdById,
        createdAt: o.createdAt,
        updatedAt: o.updatedAt,
      })),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
      totalPages: result.totalPages,
    };
  }
}

export class GetOrderUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(id: string): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new NotFoundError('Order', id);
    }

    return {
      id: order.id,
      code: order.code,
      customerId: order.customerId,
      quotationId: order.quotationId,
      status: order.status,
      orderDate: order.orderDate,
      deliveryDate: order.deliveryDate,
      subtotal: Number(order.subtotal),
      discount: Number(order.discount),
      tax: Number(order.tax),
      total: Number(order.total),
      paidAmount: Number(order.paidAmount),
      shippingAddress: order.shippingAddress,
      notes: order.notes,
      createdById: order.createdById,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}

// Valid status transitions
const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
  [OrderStatus.CONFIRMED]: [OrderStatus.IN_PRODUCTION, OrderStatus.CANCELLED],
  [OrderStatus.IN_PRODUCTION]: [OrderStatus.QC_PENDING],
  [OrderStatus.QC_PENDING]: [OrderStatus.QC_PASSED, OrderStatus.IN_PRODUCTION], // Can go back for rework
  [OrderStatus.QC_PASSED]: [OrderStatus.READY_DELIVERY],
  [OrderStatus.READY_DELIVERY]: [OrderStatus.INSTALLING, OrderStatus.COMPLETED],
  [OrderStatus.INSTALLING]: [OrderStatus.COMPLETED],
  [OrderStatus.COMPLETED]: [],
  [OrderStatus.CANCELLED]: [],
};

export interface UpdateOrderStatusDto {
  status: OrderStatus;
  notes?: string;
}

export class UpdateOrderStatusUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(id: string, dto: UpdateOrderStatusDto): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundError('Order', id);
    }

    const allowedTransitions = STATUS_TRANSITIONS[order.status] || [];
    if (!allowedTransitions.includes(dto.status)) {
      throw new ValidationError(
        `Cannot transition from ${order.status} to ${dto.status}. Allowed: ${allowedTransitions.join(', ') || 'none'}`
      );
    }

    const updated = await this.orderRepository.update(id, {
      status: dto.status,
      notes: dto.notes || order.notes,
    });

    return {
      id: updated.id,
      code: updated.code,
      customerId: updated.customerId,
      quotationId: updated.quotationId,
      status: updated.status,
      orderDate: updated.orderDate,
      deliveryDate: updated.deliveryDate,
      subtotal: Number(updated.subtotal),
      discount: Number(updated.discount),
      tax: Number(updated.tax),
      total: Number(updated.total),
      paidAmount: Number(updated.paidAmount),
      shippingAddress: updated.shippingAddress,
      notes: updated.notes,
      createdById: updated.createdById,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }
}
