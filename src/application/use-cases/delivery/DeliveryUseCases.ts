import { IDeliveryRepository, DeliveryFilters, PaginatedResult } from '../../../domain/repositories';
import { DeliveryType, DeliveryStatus } from '../../../domain/entities/Delivery';
import { DeliveryListQueryDto, DeliveryResponseDto, CreateDeliveryDto, UpdateDeliveryStatusDto } from '../../dtos/delivery.dto';
import { NotFoundError, ValidationError } from '../../../domain/errors/DomainErrors';

export class ListDeliveriesUseCase {
  constructor(private deliveryRepository: IDeliveryRepository) {}

  async execute(query: DeliveryListQueryDto): Promise<PaginatedResult<DeliveryResponseDto>> {
    const filters: DeliveryFilters = {
      orderId: query.orderId,
      type: query.type as DeliveryType,
      status: query.status as DeliveryStatus,
      fromDate: query.fromDate ? new Date(query.fromDate) : undefined,
      toDate: query.toDate ? new Date(query.toDate) : undefined,
    };

    const pagination = {
      page: query.page || 1,
      pageSize: query.pageSize || 20,
    };

    const result = await this.deliveryRepository.findAll(filters, pagination);

    return {
      data: result.data.map((d) => ({
        id: d.id,
        code: d.code,
        orderId: d.orderId,
        type: d.type,
        status: d.status,
        scheduledDate: d.scheduledDate,
        actualDate: d.actualDate || undefined,
        address: d.address || undefined,
        contactName: d.contactName || undefined,
        contactPhone: d.contactPhone || undefined,
        notes: d.notes || undefined,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
      })),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
      totalPages: result.totalPages,
    };
  }
}

export class GetDeliveryUseCase {
  constructor(private deliveryRepository: IDeliveryRepository) {}

  async execute(id: string): Promise<DeliveryResponseDto> {
    const delivery = await this.deliveryRepository.findById(id);

    if (!delivery) {
      throw new NotFoundError('Delivery', id);
    }

    return {
      id: delivery.id,
      code: delivery.code,
      orderId: delivery.orderId,
      type: delivery.type,
      status: delivery.status,
      scheduledDate: delivery.scheduledDate,
      actualDate: delivery.actualDate || undefined,
      address: delivery.address || undefined,
      contactName: delivery.contactName || undefined,
      contactPhone: delivery.contactPhone || undefined,
      notes: delivery.notes || undefined,
      createdAt: delivery.createdAt,
      updatedAt: delivery.updatedAt,
    };
  }
}

export class CreateDeliveryUseCase {
  constructor(private deliveryRepository: IDeliveryRepository) {}

  async execute(dto: CreateDeliveryDto, createdById: string): Promise<DeliveryResponseDto> {
    // Validate required fields
    if (!dto.orderId || !dto.type || !dto.scheduledDate) {
      throw new ValidationError('Order ID, type, and scheduled date are required');
    }

    // Validate delivery type
    if (!Object.values(DeliveryType).includes(dto.type)) {
      throw new ValidationError('Invalid delivery type');
    }

    // Generate delivery code
    const code = await this.deliveryRepository.getNextCode(dto.type);

    // Create delivery
    const delivery = await this.deliveryRepository.create({
      code,
      orderId: dto.orderId,
      type: dto.type,
      status: DeliveryStatus.SCHEDULED,
      scheduledDate: new Date(dto.scheduledDate),
      actualDate: null,
      address: dto.address || null,
      contactName: dto.contactName || null,
      contactPhone: dto.contactPhone || null,
      notes: dto.notes || null,
    });

    return {
      id: delivery.id,
      code: delivery.code,
      orderId: delivery.orderId,
      type: delivery.type,
      status: delivery.status,
      scheduledDate: delivery.scheduledDate,
      actualDate: delivery.actualDate || undefined,
      address: delivery.address || undefined,
      contactName: delivery.contactName || undefined,
      contactPhone: delivery.contactPhone || undefined,
      notes: delivery.notes || undefined,
      createdAt: delivery.createdAt,
      updatedAt: delivery.updatedAt,
    };
  }
}

// Valid status transitions
const STATUS_TRANSITIONS: Record<DeliveryStatus, DeliveryStatus[]> = {
  [DeliveryStatus.SCHEDULED]: [DeliveryStatus.IN_TRANSIT, DeliveryStatus.CANCELLED],
  [DeliveryStatus.IN_TRANSIT]: [DeliveryStatus.DELIVERED, DeliveryStatus.FAILED],
  [DeliveryStatus.DELIVERED]: [],
  [DeliveryStatus.FAILED]: [DeliveryStatus.SCHEDULED], // Can reschedule
  [DeliveryStatus.CANCELLED]: [],
};

export class UpdateDeliveryStatusUseCase {
  constructor(private deliveryRepository: IDeliveryRepository) {}

  async execute(id: string, dto: UpdateDeliveryStatusDto): Promise<DeliveryResponseDto> {
    // Get delivery
    const delivery = await this.deliveryRepository.findById(id);
    if (!delivery) {
      throw new NotFoundError('Delivery', id);
    }

    // Validate status transition
    const allowedTransitions = STATUS_TRANSITIONS[delivery.status];
    if (!allowedTransitions.includes(dto.status)) {
      throw new ValidationError(
        `Cannot transition from ${delivery.status} to ${dto.status}. Allowed: ${allowedTransitions.join(', ') || 'none'}`
      );
    }

    // Prepare update data
    const updateData: Partial<any> = {
      status: dto.status,
    };

    // Set actual date when delivered
    if (dto.status === DeliveryStatus.DELIVERED) {
      updateData.actualDate = dto.actualDate || new Date();
    }

    if (dto.notes) {
      updateData.notes = dto.notes;
    }

    // Update delivery
    const updated = await this.deliveryRepository.update(id, updateData);

    return {
      id: updated.id,
      code: updated.code,
      orderId: updated.orderId,
      type: updated.type,
      status: updated.status,
      scheduledDate: updated.scheduledDate,
      actualDate: updated.actualDate || undefined,
      address: updated.address || undefined,
      contactName: updated.contactName || undefined,
      contactPhone: updated.contactPhone || undefined,
      notes: updated.notes || undefined,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }
}
