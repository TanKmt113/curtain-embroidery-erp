import { IOrderRepository } from '../../../domain/repositories';
import { OrderStatus } from '../../../domain/entities/Order';
import { ItemType } from '../../../domain/entities/Quotation';
import { CreateOrderDto, OrderResponseDto } from '../../dtos/order.dto';
import { ValidationError } from '../../../domain/errors/DomainErrors';

export class CreateOrderUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(dto: CreateOrderDto, createdById: string): Promise<OrderResponseDto> {
    // Validate required fields
    if (!dto.customerId || !dto.items || dto.items.length === 0) {
      throw new ValidationError('Customer ID and at least one item are required');
    }

    // Calculate totals
    let subtotal = 0;
    const items = dto.items.map((item) => {
      const itemAmount = item.quantity * item.unitPrice;
      subtotal += itemAmount;
      return {
        ...item,
        amount: itemAmount,
      };
    });

    // Generate order code
    const code = await this.orderRepository.getNextCode();

    // Create order
    const order = await this.orderRepository.create({
      code,
      customerId: dto.customerId,
      quotationId: dto.quotationId || null,
      status: OrderStatus.CONFIRMED,
      orderDate: new Date(),
      subtotal: subtotal as any,
      discount: 0 as any,
      tax: 0 as any,
      total: subtotal as any,
      paidAmount: 0 as any,
      deliveryDate: dto.deliveryDate || null,
      shippingAddress: dto.shippingAddress || null,
      notes: dto.notes || null,
      createdById,
    });

    // Add items
    for (const item of items) {
      await this.orderRepository.addItem({
        orderId: order.id,
        productId: item.productId,
        itemType: item.itemType as ItemType,
        quantity: item.quantity as any,
        unit: item.unit || 'pcs',
        unitPrice: item.unitPrice as any,
        amount: item.amount as any,
        width: item.width as any || null,
        height: item.height as any || null,
        windowName: item.windowName || null,
        batchCode: item.batchCode || null,
        notes: item.notes || null,
      });
    }

    // Return created order
    const result = await this.orderRepository.findByIdWithItems(order.id);

    return {
      id: result!.id,
      code: result!.code,
      customerId: result!.customerId,
      quotationId: result!.quotationId || undefined,
      status: result!.status,
      subtotal: Number(result!.subtotal),
      discount: Number(result!.discount),
      tax: Number(result!.tax),
      total: Number(result!.total),
      paidAmount: Number(result!.paidAmount),
      remainingAmount: Number(result!.total) - Number(result!.paidAmount),
      deliveryDate: result!.deliveryDate || undefined,
      shippingAddress: result!.shippingAddress || undefined,
      notes: result!.notes || undefined,
      items: result!.items?.map((item) => ({
        id: item.id,
        orderId: item.orderId,
        productId: item.productId,
        itemType: item.itemType,
        quantity: Number(item.quantity),
        unit: item.unit,
        unitPrice: Number(item.unitPrice),
        amount: Number(item.amount),
        width: item.width ? Number(item.width) : undefined,
        height: item.height ? Number(item.height) : undefined,
        windowName: item.windowName || undefined,
        batchCode: item.batchCode || undefined,
        notes: item.notes || undefined,
      })),
      createdById: result!.createdById,
      createdAt: result!.createdAt,
      updatedAt: result!.updatedAt,
    };
  }
}
