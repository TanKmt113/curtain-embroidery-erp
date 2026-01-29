# Workflows (Quy trình nghiệp vụ)

## 1. Quy trình tổng quan

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Khách hàng │───▶│  Báo giá    │───▶│  Đơn hàng   │───▶│  Sản xuất   │
│   yêu cầu   │    │ (Quotation) │    │   (Order)   │    │(Work Order) │
└─────────────┘    └─────────────┘    └─────────────┘    └──────┬──────┘
                                                                │
        ┌───────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Kiểm tra   │───▶│  Giao hàng/ │───▶│  Hoàn thành │
│  chất lượng │    │  Lắp đặt    │    │             │
│    (QC)     │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
```

## 2. Quy trình Báo giá (Quotation Workflow)

### 2.1. State Diagram

```
                    ┌────────────────┐
                    │     DRAFT      │
                    │  (Nháp)        │
                    └───────┬────────┘
                            │ Gửi KH
                            ▼
                    ┌────────────────┐
         ┌──────────│      SENT      │──────────┐
         │          │  (Đã gửi)      │          │
         │          └────────────────┘          │
         │                  │                   │
         │ Từ chối          │ Duyệt             │ Hết hạn
         ▼                  ▼                   ▼
┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│    REJECTED    │  │    APPROVED    │  │    EXPIRED     │
│  (Từ chối)     │  │   (Đã duyệt)   │  │   (Hết hạn)    │
└────────────────┘  └───────┬────────┘  └────────────────┘
                            │
                            │ Chuyển đơn hàng
                            ▼
                    ┌────────────────┐
                    │     ORDER      │
                    │  (Đơn hàng)    │
                    └────────────────┘
```

### 2.2. Chi tiết quy trình

| Bước | Actor | Action | Trạng thái trước | Trạng thái sau |
|------|-------|--------|------------------|----------------|
| 1 | Sales | Tạo báo giá | - | DRAFT |
| 2 | Sales | Thêm hạng mục rèm/gia công | DRAFT | DRAFT |
| 3 | Sales | Gửi báo giá cho KH | DRAFT | SENT |
| 4a | Sales | KH duyệt báo giá | SENT | APPROVED |
| 4b | Sales | KH từ chối | SENT | REJECTED |
| 4c | System | Hết hạn hiệu lực | SENT | EXPIRED |
| 5 | Sales | Chuyển thành đơn hàng | APPROVED | → Order PENDING |

### 2.3. Business Rules

1. Chỉ báo giá DRAFT mới được sửa
2. Chỉ báo giá APPROVED mới được chuyển thành đơn hàng
3. Mỗi báo giá chỉ được chuyển thành 1 đơn hàng
4. Báo giá hết hạn tự động chuyển EXPIRED (batch job)

## 3. Quy trình Đơn hàng (Order Workflow)

### 3.1. State Diagram

```
┌──────────────┐
│   PENDING    │ ◄─── Từ Quotation hoặc tạo mới
│  (Chờ xác   │
│   nhận)      │
└──────┬───────┘
       │ Xác nhận
       ▼
┌──────────────┐
│  CONFIRMED   │
│ (Đã xác nhận)│
└──────┬───────┘
       │ Tạo Work Order
       ▼
┌──────────────┐
│IN_PRODUCTION │
│ (Đang SX)    │
└──────┬───────┘
       │ Hoàn thành SX
       ▼
┌──────────────┐
│  QC_PENDING  │
│ (Chờ QC)     │
└──────┬───────┘
       │
       ├─────────────────────┐
       │ QC Pass             │ QC Fail
       ▼                     ▼
┌──────────────┐     ┌──────────────┐
│  QC_PASSED   │     │ IN_PRODUCTION│ (Làm lại)
│(QC đạt)      │     └──────────────┘
└──────┬───────┘
       │
       ├─────────────────────┐
       │ Chỉ giao hàng       │ Cần lắp đặt
       ▼                     ▼
┌──────────────┐     ┌──────────────┐
│READY_DELIVERY│     │  INSTALLING  │
│(Sẵn sàng     │     │ (Đang lắp    │
│ giao)        │     │  đặt)        │
└──────┬───────┘     └──────┬───────┘
       │                     │
       └─────────┬───────────┘
                 │ Hoàn thành
                 ▼
         ┌──────────────┐
         │  COMPLETED   │
         │ (Hoàn thành) │
         └──────────────┘

         ┌──────────────┐
         │  CANCELLED   │ ◄─── Có thể hủy từ PENDING/CONFIRMED
         │   (Đã hủy)   │
         └──────────────┘
```

### 3.2. Chi tiết quy trình

| Bước | Actor | Action | Trạng thái trước | Trạng thái sau |
|------|-------|--------|------------------|----------------|
| 1 | Sales | Tạo/Xác nhận đơn | PENDING | CONFIRMED |
| 2 | Production | Tạo Work Order | CONFIRMED | IN_PRODUCTION |
| 3 | Production | Hoàn thành sản xuất | IN_PRODUCTION | QC_PENDING |
| 4 | QC | Kiểm tra chất lượng | QC_PENDING | QC_PASSED / IN_PRODUCTION |
| 5a | Warehouse | Chuẩn bị giao hàng | QC_PASSED | READY_DELIVERY |
| 5b | Installer | Lắp đặt | QC_PASSED | INSTALLING |
| 6 | Warehouse/Installer | Hoàn thành | READY_DELIVERY/INSTALLING | COMPLETED |

### 3.3. Business Rules

1. Chỉ PENDING và CONFIRMED mới được hủy
2. Phải có ít nhất 1 Work Order hoàn thành mới chuyển QC_PENDING
3. Phải QC_PASSED mới được giao hàng/lắp đặt
4. Đơn COMPLETED không thể thay đổi trạng thái

## 4. Quy trình Sản xuất (Production Workflow)

### 4.1. Work Order Flow

```
┌──────────────┐
│   PENDING    │
│ (Chờ SX)     │
└──────┬───────┘
       │ Bắt đầu
       ▼
┌──────────────┐
│ IN_PROGRESS  │◄────┐
│ (Đang SX)    │     │
└──────┬───────┘     │
       │             │ Resume
       ├─────────────┤
       │ Tạm dừng    │
       ▼             │
┌──────────────┐     │
│   ON_HOLD    │─────┘
│ (Tạm dừng)   │
└──────────────┘

       │ Hoàn thành tất cả steps
       ▼
┌──────────────┐
│  COMPLETED   │
│ (Hoàn thành) │
└──────────────┘
```

### 4.2. Production Steps (Routing)

#### Ví dụ Routing cho Rèm:

| Step | Công đoạn | Work Center |
|------|-----------|-------------|
| 1 | Cắt vải | Xưởng cắt |
| 2 | May viền | Xưởng may |
| 3 | Gắn phụ kiện | Xưởng lắp ráp |
| 4 | Ủi/Hoàn thiện | Xưởng hoàn thiện |
| 5 | Đóng gói | Kho |

#### Ví dụ Routing cho Gia công thêu:

| Step | Công đoạn | Work Center |
|------|-----------|-------------|
| 1 | Nhận hàng/Kiểm đếm | Kho |
| 2 | Căng khung | Xưởng thêu |
| 3 | Thêu | Xưởng thêu |
| 4 | Tháo khung/Cắt chỉ | Xưởng hoàn thiện |
| 5 | Kiểm tra/Đóng gói | Kho |

### 4.3. Step Completion Flow

```
                    ┌────────────┐
                    │  Step 1    │
                    │  PENDING   │
                    └─────┬──────┘
                          │ Start
                          ▼
                    ┌────────────┐
                    │  Step 1    │
                    │IN_PROGRESS │
                    └─────┬──────┘
                          │ Complete
                          ▼
┌────────────┐      ┌────────────┐
│  Step 2    │ ◄────│  Step 1    │
│  PENDING   │      │ COMPLETED  │
└─────┬──────┘      └────────────┘
      │
      ▼
     ...
```

## 5. Quy trình Kho (Inventory Workflow)

### 5.1. Stock Movement Types

```
┌─────────────────────────────────────────────────────────────┐
│                        INVENTORY                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────┐                           ┌─────────┐         │
│  │ STOCK   │                           │ STOCK   │         │
│  │   IN    │ ────────────────────────▶ │   OUT   │         │
│  └─────────┘                           └─────────┘         │
│      ▲                                      │              │
│      │                                      ▼              │
│  ┌─────────┐                           ┌─────────┐         │
│  │ ADJUST  │                           │ RESERVE │         │
│  │ (Kiểm   │                           │ (Đặt    │         │
│  │  kê)    │                           │  trước) │         │
│  └─────────┘                           └─────────┘         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 5.2. Consignment Inventory Flow

```
Khách gửi hàng gia công
        │
        ▼
┌──────────────────┐
│ CONSIGNMENT      │
│ Stock In         │
│ (ownership=      │
│  CONSIGNMENT,    │
│  customerId=X)   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Gia công         │
│ (Work Order)     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ CONSIGNMENT      │
│ Stock Out        │
│ (Trả hàng cho    │
│  khách X)        │
└──────────────────┘

⚠️ Không được xuất hàng ký gửi của khách X cho đơn hàng của khách Y
```

## 6. Quy trình QC

### 6.1. QC Flow

```
         Work Order COMPLETED
                │
                ▼
        ┌──────────────┐
        │ QC Record    │
        │ PENDING      │
        └──────┬───────┘
               │ Kiểm tra
               │
       ┌───────┴───────┐
       │               │
       ▼               ▼
┌──────────────┐ ┌──────────────┐
│    PASSED    │ │    FAILED    │
│ (Đạt)        │ │ (Không đạt)  │
└──────┬───────┘ └──────┬───────┘
       │                │
       │                ▼
       │         ┌──────────────┐
       │         │    REWORK    │
       │         │ (Làm lại)    │
       │         └──────┬───────┘
       │                │
       │                ▼
       │         Tạo WO mới/
       │         Cập nhật WO
       │                │
       │         ┌──────┴───────┐
       │         │ Kiểm tra lại │
       │         └──────────────┘
       │
       ▼
  Order QC_PASSED
```

### 6.2. QC Checklist (Ví dụ)

#### Rèm:
- [ ] Kích thước đúng theo đơn hàng
- [ ] Màu sắc đúng mẫu
- [ ] Đường may đều, không bỏ mũi
- [ ] Phụ kiện đầy đủ, chắc chắn
- [ ] Không có vết bẩn/hư hỏng

#### Gia công thêu:
- [ ] Số lượng đúng theo lô
- [ ] Mẫu thêu đúng thiết kế
- [ ] Chỉ thêu đúng màu
- [ ] Không đứt chỉ, lỗi mũi
- [ ] Căng khung đều

## 7. Integration Points

### 7.1. Quotation → Order
```
Quotation (APPROVED)
    │
    │ convertToOrder()
    ▼
Order (PENDING)
    ├── Copy customer info
    ├── Copy all items
    ├── Link quotationId
    └── Calculate totals
```

### 7.2. Order → Work Order
```
Order (CONFIRMED)
    │
    │ createWorkOrders()
    ▼
For each OrderItem:
    │
    ├── Get Product Routing
    │
    ├── Create WorkOrder
    │   ├── Link orderId
    │   └── Link orderItemId
    │
    └── Create WorkOrderSteps
        └── From RoutingSteps
```

### 7.3. Work Order → Inventory
```
Work Order IN_PROGRESS
    │
    │ Material consumption
    ▼
Inventory Stock Out
    ├── Check availability
    ├── Check ownership (COMPANY vs CONSIGNMENT)
    └── Create transaction
```
