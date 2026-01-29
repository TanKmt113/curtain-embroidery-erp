# Tổng quan Hệ thống ERP Rèm & Gia công Thêu/Đệm

## 1. Giới thiệu

Hệ thống ERP (Enterprise Resource Planning) được thiết kế để quản lý toàn diện hoạt động kinh doanh của doanh nghiệp chuyên về:

- **Rèm trọn gói**: Tư vấn, đo đạc, sản xuất, lắp đặt rèm cửa các loại
- **Gia công thêu/đệm**: Nhận gia công thêu, may đệm theo đơn hàng hoặc theo lô

## 2. Mục tiêu

### 2.1. Mục tiêu kinh doanh
- Tối ưu hóa quy trình từ báo giá đến giao hàng/lắp đặt
- Quản lý kho hiệu quả, phân biệt hàng công ty và hàng ký gửi
- Theo dõi tiến độ sản xuất theo công đoạn
- Kiểm soát chất lượng sản phẩm
- Quản lý công nợ khách hàng

### 2.2. Mục tiêu kỹ thuật
- Xây dựng hệ thống theo Clean Architecture
- Đảm bảo khả năng mở rộng và bảo trì
- API RESTful chuẩn cho tích hợp
- Bảo mật với JWT authentication

## 3. Phạm vi hệ thống

### 3.1. Modules chính

| Module | Mô tả |
|--------|-------|
| **Auth** | Xác thực, phân quyền người dùng |
| **Customer** | Quản lý thông tin khách hàng |
| **Product** | Quản lý sản phẩm, vật tư |
| **Quotation** | Tạo và quản lý báo giá |
| **Order** | Quản lý đơn hàng |
| **Production** | Quản lý sản xuất, Work Order |
| **Inventory** | Quản lý kho |
| **QC** | Kiểm tra chất lượng |
| **Delivery** | Giao hàng và lắp đặt |
| **Report** | Báo cáo thống kê |

### 3.2. Loại hạng mục đơn hàng

1. **Rèm theo cửa (CURTAIN_WINDOW)**
   - Đo theo từng cửa sổ/cửa chính
   - Thuộc tính: tên cửa, chiều rộng, chiều cao
   - Sản xuất theo đơn lẻ

2. **Gia công theo lô (PROCESSING_BATCH)**
   - Nhận gia công thêu/đệm theo lô hàng
   - Thuộc tính: mã lô, số lượng lô
   - Có thể là hàng ký gửi của khách

## 4. Các bên liên quan

- **Admin**: Quản trị hệ thống
- **Sales**: Nhân viên kinh doanh
- **Warehouse**: Nhân viên kho
- **Production**: Nhân viên sản xuất
- **QC**: Nhân viên kiểm tra chất lượng
- **Installer**: Nhân viên lắp đặt
- **Accountant**: Kế toán

## 5. Công nghệ sử dụng

| Layer | Technology |
|-------|------------|
| Runtime | Node.js |
| Framework | Express.js |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | JWT |
| Validation | Zod |
| Logging | Pino |

## 6. Quy trình nghiệp vụ chính

```
Báo giá (Quotation)
       ↓
Đơn hàng (Order)
       ↓
Lệnh sản xuất (Work Order)
       ↓
Sản xuất theo công đoạn (Routing)
       ↓
Kiểm tra chất lượng (QC)
       ↓
Giao hàng / Lắp đặt (Delivery/Installation)
       ↓
Hoàn thành (Completed)
```
