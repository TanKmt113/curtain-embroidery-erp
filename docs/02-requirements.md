# Yêu cầu Hệ thống (Requirements)

## 1. Yêu cầu chức năng (Functional Requirements)

### 1.1. Module Authentication (AUTH)

| ID | Mô tả | Priority |
|----|-------|----------|
| AUTH-01 | Đăng nhập bằng email/password | High |
| AUTH-02 | Refresh token khi access token hết hạn | High |
| AUTH-03 | Đăng xuất (revoke refresh token) | High |
| AUTH-04 | Phân quyền theo role | High |
| AUTH-05 | Quản lý user (CRUD) - Admin only | Medium |

### 1.2. Module Customer (CUS)

| ID | Mô tả | Priority |
|----|-------|----------|
| CUS-01 | Tạo khách hàng mới | High |
| CUS-02 | Cập nhật thông tin khách hàng | High |
| CUS-03 | Danh sách khách hàng (filter, search, pagination) | High |
| CUS-04 | Xem chi tiết khách hàng | High |
| CUS-05 | Phân loại khách hàng (cá nhân/công ty/ký gửi) | High |
| CUS-06 | Vô hiệu hóa khách hàng | Medium |

### 1.3. Module Product (PRD)

| ID | Mô tả | Priority |
|----|-------|----------|
| PRD-01 | Quản lý danh mục sản phẩm | High |
| PRD-02 | Quản lý vật tư | High |
| PRD-03 | Định nghĩa BOM (Bill of Materials) | High |
| PRD-04 | Định nghĩa Routing (công đoạn sản xuất) | High |
| PRD-05 | Quản lý đơn giá sản phẩm | High |

### 1.4. Module Quotation (QUO)

| ID | Mô tả | Priority |
|----|-------|----------|
| QUO-01 | Tạo báo giá mới | High |
| QUO-02 | Thêm hạng mục rèm theo cửa | High |
| QUO-03 | Thêm hạng mục gia công theo lô | High |
| QUO-04 | Tính toán tự động tổng tiền | High |
| QUO-05 | Gửi báo giá cho khách | Medium |
| QUO-06 | Duyệt/Từ chối báo giá | High |
| QUO-07 | Chuyển báo giá thành đơn hàng | High |

### 1.5. Module Order (ORD)

| ID | Mô tả | Priority |
|----|-------|----------|
| ORD-01 | Tạo đơn hàng từ báo giá | High |
| ORD-02 | Tạo đơn hàng trực tiếp | High |
| ORD-03 | Cập nhật trạng thái đơn hàng | High |
| ORD-04 | Theo dõi tiến độ đơn hàng | High |
| ORD-05 | Hủy đơn hàng | Medium |
| ORD-06 | Ghi nhận thanh toán | High |

### 1.6. Module Production (WO)

| ID | Mô tả | Priority |
|----|-------|----------|
| WO-01 | Tạo Work Order từ đơn hàng | High |
| WO-02 | Phân công nhân viên sản xuất | High |
| WO-03 | Cập nhật tiến độ theo công đoạn | High |
| WO-04 | Theo dõi thời gian sản xuất | Medium |
| WO-05 | Ghi nhận sự cố sản xuất | Medium |

### 1.7. Module Inventory (INV)

| ID | Mô tả | Priority |
|----|-------|----------|
| INV-01 | Nhập kho | High |
| INV-02 | Xuất kho | High |
| INV-03 | Kiểm kê kho | Medium |
| INV-04 | Phân biệt kho công ty vs ký gửi | High |
| INV-05 | Theo dõi tồn kho theo vị trí | Medium |
| INV-06 | Cảnh báo tồn kho thấp | Medium |
| INV-07 | Đặt trước hàng cho đơn hàng | High |

### 1.8. Module QC

| ID | Mô tả | Priority |
|----|-------|----------|
| QC-01 | Tạo phiếu kiểm tra chất lượng | High |
| QC-02 | Ghi nhận kết quả QC | High |
| QC-03 | Đánh dấu lỗi và yêu cầu làm lại | High |
| QC-04 | Thống kê tỷ lệ lỗi | Medium |

### 1.9. Module Delivery (DEL)

| ID | Mô tả | Priority |
|----|-------|----------|
| DEL-01 | Lên lịch giao hàng | High |
| DEL-02 | Lên lịch lắp đặt | High |
| DEL-03 | Xác nhận hoàn thành | High |
| DEL-04 | Theo dõi lịch sử giao hàng | Medium |

## 2. Yêu cầu phi chức năng (Non-Functional Requirements)

### 2.1. Hiệu năng
- Response time < 500ms cho các API thông thường
- Hỗ trợ 100 concurrent users
- Phân trang với page size tối đa 100 records

### 2.2. Bảo mật
- HTTPS cho production
- JWT với access token (15 phút) và refresh token (7 ngày)
- Hash password với bcrypt
- Rate limiting cho login API
- Audit log cho các thao tác quan trọng

### 2.3. Khả năng mở rộng
- Stateless API design
- Database connection pooling
- Horizontal scaling ready

### 2.4. Bảo trì
- Clean Architecture pattern
- Comprehensive logging
- Error tracking
- API versioning

## 3. Ràng buộc nghiệp vụ

### 3.1. Báo giá
- Mỗi báo giá phải thuộc về một khách hàng
- Báo giá có thời hạn hiệu lực
- Chỉ báo giá APPROVED mới được chuyển thành đơn hàng

### 3.2. Đơn hàng
- Đơn hàng đa hạng mục: có thể vừa có rèm vừa có gia công
- Hạng mục rèm: theo từng cửa với kích thước cụ thể
- Hạng mục gia công: theo lô với số lượng

### 3.3. Kho
- Kho công ty: hàng thuộc sở hữu công ty
- Kho ký gửi: hàng của khách gửi để gia công
- Không được phép xuất hàng ký gửi cho đơn hàng khác

### 3.4. Sản xuất
- Mỗi sản phẩm có thể có nhiều công đoạn (routing)
- Work Order phải hoàn thành tuần tự các công đoạn
- Phải QC pass trước khi giao hàng

### 3.5. Trạng thái luồng chính
```
QUOTATION → ORDER → WORK_ORDER → QC → DELIVERY → COMPLETED
```
