# Domain Model

## 1. Entity Relationship Diagram (Mô tả)

### 1.1. Core Entities

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    User     │       │  Customer   │       │   Product   │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id          │       │ id          │       │ id          │
│ email       │       │ code        │       │ code        │
│ passwordHash│       │ name        │       │ name        │
│ fullName    │       │ type        │       │ type        │
│ role        │       │ email       │       │ unit        │
│ status      │       │ phone       │       │ basePrice   │
└─────────────┘       │ address     │       └─────────────┘
                      └─────────────┘
```

### 1.2. Sales Entities

```
┌─────────────────┐         ┌─────────────────┐
│   Quotation     │         │ QuotationItem   │
├─────────────────┤         ├─────────────────┤
│ id              │ 1     * │ id              │
│ code            │─────────│ quotationId     │
│ customerId (FK) │         │ itemType        │
│ createdById(FK) │         │ productId (FK)  │
│ status          │         │ windowName      │
│ validUntil      │         │ width, height   │
│ subtotal        │         │ batchCode       │
│ discount        │         │ batchQuantity   │
│ tax             │         │ quantity        │
│ total           │         │ unitPrice       │
└─────────────────┘         │ amount          │
                            └─────────────────┘
```

### 1.3. Order & Production Entities

```
┌─────────────────┐         ┌─────────────────┐
│     Order       │         │   OrderItem     │
├─────────────────┤         ├─────────────────┤
│ id              │ 1     * │ id              │
│ code            │─────────│ orderId         │
│ quotationId(FK) │         │ itemType        │
│ customerId (FK) │         │ productId (FK)  │
│ status          │         │ windowName      │
│ orderDate       │         │ width, height   │
│ deliveryDate    │         │ batchCode       │
│ total           │         │ batchQuantity   │
└────────┬────────┘         │ quantity        │
         │                  └────────┬────────┘
         │                           │
         │ 1                       1 │
         │ *                       * │
┌────────▼────────┐         ┌────────▼────────┐
│   WorkOrder     │         │ WorkOrderStep   │
├─────────────────┤         ├─────────────────┤
│ id              │ 1     * │ id              │
│ code            │─────────│ workOrderId     │
│ orderId (FK)    │         │ routingStepId   │
│ orderItemId(FK) │         │ stepNumber      │
│ assigneeId (FK) │         │ status          │
│ status          │         │ startedAt       │
│ priority        │         │ completedAt     │
└─────────────────┘         └─────────────────┘
```

### 1.4. Inventory Entities

```
┌─────────────────┐         ┌─────────────────────┐
│   Inventory     │         │ InventoryTransaction│
├─────────────────┤         ├─────────────────────┤
│ id              │ 1     * │ id                  │
│ productId (FK)  │─────────│ inventoryId         │
│ materialId (FK) │         │ type                │
│ ownership       │         │ quantity            │
│ customerId (FK) │         │ reference           │
│ warehouse       │         │ notes               │
│ location        │         │ createdAt           │
│ quantity        │         └─────────────────────┘
│ reservedQty     │
└─────────────────┘

ownership: COMPANY | CONSIGNMENT
```

## 2. Domain Entities Detail

### 2.1. User
Người dùng hệ thống với các role khác nhau.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| email | String | Email đăng nhập (unique) |
| passwordHash | String | Mật khẩu đã hash |
| fullName | String | Họ tên |
| phone | String? | Số điện thoại |
| role | UserRole | Vai trò |
| status | UserStatus | Trạng thái |

### 2.2. Customer
Khách hàng, có thể là cá nhân, công ty hoặc khách ký gửi hàng.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| code | String | Mã khách hàng (unique) |
| name | String | Tên khách hàng |
| type | CustomerType | Loại: INDIVIDUAL, COMPANY, CONSIGNMENT |
| email | String? | Email |
| phone | String? | Số điện thoại |
| address | String? | Địa chỉ |
| taxCode | String? | Mã số thuế (với công ty) |

### 2.3. Product
Sản phẩm hoặc dịch vụ.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| code | String | Mã sản phẩm |
| name | String | Tên sản phẩm |
| type | ProductType | CURTAIN, EMBROIDERY, MATERIAL, ACCESSORY |
| unit | String | Đơn vị tính |
| basePrice | Decimal | Giá cơ bản |

### 2.4. Quotation & QuotationItem
Báo giá và chi tiết hạng mục.

**QuotationItem** có 2 loại:
- **CURTAIN_WINDOW**: Rèm theo cửa, có width/height
- **PROCESSING_BATCH**: Gia công theo lô, có batchCode/batchQuantity

### 2.5. Order & OrderItem
Đơn hàng sau khi khách duyệt báo giá.

### 2.6. WorkOrder & WorkOrderStep
Lệnh sản xuất và các bước công đoạn.

### 2.7. Inventory
Quản lý tồn kho với 2 loại sở hữu:
- **COMPANY**: Hàng của công ty
- **CONSIGNMENT**: Hàng ký gửi của khách

## 3. Value Objects

### 3.1. Money
```typescript
class Money {
  amount: Decimal
  currency: string = 'VND'
}
```

### 3.2. Dimension
```typescript
class Dimension {
  width: number   // cm
  height: number  // cm
}
```

### 3.3. Address
```typescript
class Address {
  street: string
  ward: string
  district: string
  city: string
}
```

## 4. Aggregates

### 4.1. Quotation Aggregate
- Root: Quotation
- Entities: QuotationItem[]
- Invariants:
  - Total = sum(items.amount) - discount + tax
  - Status transitions: DRAFT → SENT → APPROVED/REJECTED

### 4.2. Order Aggregate
- Root: Order
- Entities: OrderItem[], WorkOrder[], QCRecord[], Delivery[]
- Invariants:
  - Status flow phải tuân thủ workflow
  - Không thể hủy đơn đã hoàn thành

### 4.3. Inventory Aggregate
- Root: Inventory
- Entities: InventoryTransaction[]
- Invariants:
  - quantity >= reservedQty
  - Hàng CONSIGNMENT chỉ xuất cho đơn của khách đó

## 5. Enumerations

### 5.1. UserRole
```
ADMIN | SALES | WAREHOUSE | PRODUCTION | QC | INSTALLER | ACCOUNTANT
```

### 5.2. CustomerType
```
INDIVIDUAL | COMPANY | CONSIGNMENT
```

### 5.3. QuotationStatus
```
DRAFT | SENT | APPROVED | REJECTED | EXPIRED
```

### 5.4. OrderStatus
```
PENDING | CONFIRMED | IN_PRODUCTION | QC_PENDING | 
QC_PASSED | READY_DELIVERY | INSTALLING | COMPLETED | CANCELLED
```

### 5.5. WorkOrderStatus
```
PENDING | IN_PROGRESS | COMPLETED | ON_HOLD
```

### 5.6. InventoryOwnership
```
COMPANY | CONSIGNMENT
```

### 5.7. ItemType
```
CURTAIN_WINDOW | PROCESSING_BATCH
```
