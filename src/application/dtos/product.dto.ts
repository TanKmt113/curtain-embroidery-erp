import { ProductType } from '../../domain/entities/Product';

// ==================== Product DTOs ====================
export interface CreateProductDto {
  name: string;
  type: ProductType;
  unit: string;
  basePrice: number;
  description?: string;
  image?: string;
  materials?: CreateProductMaterialDto[];
  routingSteps?: CreateRoutingStepDto[];
}

export interface UpdateProductDto {
  name?: string;
  unit?: string;
  basePrice?: number;
  description?: string;
  image?: string;
  isActive?: boolean;
}

export interface ProductResponseDto {
  id: string;
  code: string;
  name: string;
  type: ProductType;
  unit: string;
  basePrice: number;
  description?: string;
  image?: string;
  isActive: boolean;
  materials?: ProductMaterialResponseDto[];
  routingSteps?: RoutingStepResponseDto[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductListQueryDto {
  search?: string;
  type?: ProductType;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
}

// ==================== Material DTOs ====================
export interface CreateMaterialDto {
  name: string;
  unit: string;
  unitPrice: number;
  description?: string;
  minStock?: number;
}

export interface UpdateMaterialDto {
  name?: string;
  unit?: string;
  unitPrice?: number;
  description?: string;
  minStock?: number;
  isActive?: boolean;
}

export interface MaterialResponseDto {
  id: string;
  code: string;
  name: string;
  unit: string;
  unitPrice: number;
  description?: string;
  minStock: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== Product Material (BOM) DTOs ====================
export interface CreateProductMaterialDto {
  materialId: string;
  quantity: number;
  notes?: string;
}

export interface UpdateProductMaterialDto {
  quantity?: number;
  notes?: string;
}

export interface ProductMaterialResponseDto {
  id: string;
  productId: string;
  materialId: string;
  material?: MaterialResponseDto;
  quantity: number;
  notes?: string;
}

// ==================== Routing Step DTOs ====================
export interface CreateRoutingStepDto {
  stepNumber: number;
  name: string;
  description?: string;
  standardTime?: number;
  laborCost?: number;
}

export interface UpdateRoutingStepDto {
  stepNumber?: number;
  name?: string;
  description?: string;
  standardTime?: number;
  laborCost?: number;
}

export interface RoutingStepResponseDto {
  id: string;
  productId: string;
  stepNumber: number;
  name: string;
  description?: string;
  standardTime?: number;
  laborCost?: number;
}