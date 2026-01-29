import { IQuotationRepository } from '../../../domain/repositories';
import { QuotationStatus, ItemType } from '../../../domain/entities/Quotation';
import { CreateQuotationDto, QuotationResponseDto } from '../../dtos/quotation.dto';
import { ValidationError } from '../../../domain/errors/DomainErrors';

export class CreateQuotationUseCase {
  constructor(private quotationRepository: IQuotationRepository) {}

  async execute(dto: CreateQuotationDto, createdById: string): Promise<QuotationResponseDto> {
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

    // Generate quotation code
    const code = await this.quotationRepository.getNextCode();

    // Create quotation
    const quotation = await this.quotationRepository.create({
      code,
      customerId: dto.customerId,
      status: QuotationStatus.DRAFT,
      subtotal: subtotal as any,
      discount: 0 as any,
      tax: 0 as any,
      total: subtotal as any,
      validUntil: dto.validUntil || null,
      notes: dto.notes || null,
      createdById,
    });

    // Add items
    for (const item of items) {
      await this.quotationRepository.addItem({
        quotationId: quotation.id,
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

    // Return created quotation
    const result = await this.quotationRepository.findByIdWithItems(quotation.id);

    return {
      id: result!.id,
      code: result!.code,
      customerId: result!.customerId,
      status: result!.status,
      subtotal: Number(result!.subtotal),
      discount: Number(result!.discount),
      tax: Number(result!.tax),
      total: Number(result!.total),
      validUntil: result!.validUntil || undefined,
      notes: result!.notes || undefined,
      items: result!.items?.map((item) => ({
        id: item.id,
        quotationId: item.quotationId,
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
