import { Decimal } from '@prisma/client/runtime/library';

export interface Product {
  id: string;
  code: string;
  name: string;
  type: ProductType;
  unit: string;
  description?: string | null;
  image?: string | null;
  basePrice: number | Decimal;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  materials?: ProductMaterial[];
  routingSteps?: RoutingStep[];
}

export enum ProductType {
  CURTAIN = 'CURTAIN',
  EMBROIDERY = 'EMBROIDERY',
  MATERIAL = 'MATERIAL',
  ACCESSORY = 'ACCESSORY',
  CUSHION = 'CUSHION',
  SERVICE = 'SERVICE',
}

export interface Material {
  id: string;
  code: string;
  name: string;
  unit: string;
  description?: string | null;
  minStock: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductMaterial {
  id: string;
  productId: string;
  materialId: string;
  quantity: Decimal | number;
}

export interface RoutingStep {
  id: string;
  productId: string;
  stepNumber: number;
  name: string;
  description?: string | null;
  workCenter?: string | null;
  estimatedTime?: number | null;
  standardTime?: number | null;
  laborCost?: Decimal | number | null;
  isActive: boolean;
}
