# Hệ thống ERP Quản lý Rèm & Gia công Thêu/Đệm

Hệ thống ERP (Enterprise Resource Planning) được xây dựng theo Clean Architecture trên nền tảng Node.js, Express, TypeScript và PostgreSQL.

## Tính năng chính

- 🔐 **Xác thực (Authentication)**: JWT Access Token + Refresh Token
- 👥 **Quản lý khách hàng (Customer Management)**: Quản lý khách hàng (cá nhân, công ty, ký gửi)
- 📦 **Quản lý đơn hàng (Order Management)**: Đơn hàng đa hạng mục (Rèm theo cửa, Gia công theo lô)
- 🏭 **Sản xuất (Production)**: Quản lý sản xuất theo công đoạn (Routing)
- 📊 **Quản lý kho (Inventory)**: Quản lý kho (Công ty vs Ký gửi)
- ✅ **Kiểm tra chất lượng (QC)**: Kiểm tra chất lượng
- 🚚 **Giao hàng (Delivery)**: Giao hàng và lắp đặt

## Công nghệ sử dụng

| Tầng | Công nghệ |
|------|-----------|
| Runtime | Node.js |
| Framework | Express.js |
| Ngôn ngữ | TypeScript |
| Cơ sở dữ liệu | PostgreSQL |
| ORM | Prisma |
| Xác thực | JWT |
| Kiểm tra dữ liệu | Zod |
| Ghi log | Pino |

## Cấu trúc thư mục

```
src/
├── domain/                    # Quy tắc nghiệp vụ chính
│   ├── entities/              # Các thực thể miền (Domain entities)
│   ├── repositories/          # Các interface của repository
│   └── errors/                # Các lỗi miền (Domain errors)
│
├── application/               # Quy tắc nghiệp vụ ứng dụng
│   ├── use-cases/             # Các trường hợp sử dụng (Use cases)
│   ├── dtos/                  # Đối tượng truyền dữ liệu (DTOs)
│   └── interfaces/            # Các interface của ứng dụng
│
├── infrastructure/            # Cơ sở hạ tầng và trình điều khiển
│   ├── database/              # Kết nối cơ sở dữ liệu
│   ├── repositories/          # Các triển khai repository
│   └── security/              # JWT, Hashing
│
├── presentation/              # Giao diện và bộ điều hợp
│   ├── controllers/           # Các controller HTTP
│   ├── routes/                # Các route của Express
│   ├── middlewares/           # Các middleware của Express
│   └── validators/            # Các validator sử dụng Zod
│
└── main/                      # Điểm khởi đầu của ứng dụng
    ├── config/                # Cấu hình
    ├── factories/             # Các hàm khởi tạo (Factory functions)
    └── server.ts              # Điểm khởi động ứng dụng
```

## Cài đặt và Chạy

### 1. Yêu cầu hệ thống

- Node.js >= 18
- PostgreSQL >= 14
- npm hoặc yarn

### 2. Clone và cài đặt dependencies

```bash
cd curtain-embroidery-erp
npm install
```

### 3. Cấu hình môi trường

```bash
# Sao chép file .env.example thành .env
cp .env.example .env

# Chỉnh sửa DATABASE_URL trong .env với thông tin PostgreSQL của bạn
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/curtain_erp?schema=public"
```

### 4. Tạo cơ sở dữ liệu và chạy migration

```bash
# Tạo cơ sở dữ liệu (nếu chưa có)
# Trong PostgreSQL: CREATE DATABASE curtain_erp;

# Chạy migration
npx prisma migrate dev --name init

# Seed dữ liệu mẫu (tùy chọn)
npx ts-node prisma/seed.ts
```

### 5. Chạy ứng dụng

```bash
# Chế độ phát triển
npm run dev

# Chế độ sản xuất
npm run build
npm start
```

Server sẽ chạy tại: http://localhost:3000

## Chi tiết chức năng từng Module

### 1. 🔐 Module Xác thực (Authentication)

**Mô tả**: Quản lý xác thực người dùng với cơ chế JWT (JSON Web Token) bao gồm Access Token và Refresh Token.

**Chức năng**:
- **Đăng nhập**: Xác thực email/mật khẩu, trả về access token (15 phút) và refresh token (7 ngày)
- **Làm mới token**: Sử dụng refresh token để lấy access token mới khi hết hạn
- **Đăng xuất**: Vô hiệu hóa refresh token hiện tại
- **Phân quyền**: Hỗ trợ các vai trò ADMIN, SALES, PRODUCTION, QC, WAREHOUSE, DELIVERY

**API Endpoints**:
| Phương thức | Endpoint | Mô tả |
|-------------|----------|-------|
| POST | /api/v1/auth/login | Đăng nhập |
| POST | /api/v1/auth/refresh | Làm mới access token |
| POST | /api/v1/auth/logout | Đăng xuất |

---

### 2. � Module User (Người dùng)

**Mô tả**: Quản lý người dùng hệ thống (nhân viên) với phân quyền theo vai trò.

**Chức năng**:
- **Tạo người dùng**: Thêm người dùng mới với email, mật khẩu, vai trò
- **Danh sách người dùng**: Tìm kiếm theo tên/email, lọc theo vai trò và trạng thái, phân trang
- **Chi tiết người dùng**: Xem thông tin đầy đủ của người dùng
- **Cập nhật người dùng**: Sửa thông tin, thay đổi vai trò, trạng thái
- **Xóa người dùng**: Xóa người dùng (không thể tự xóa chính mình)
- **Đổi mật khẩu**: Người dùng tự đổi mật khẩu (cần nhập mật khẩu hiện tại)
- **Reset mật khẩu**: Admin reset mật khẩu cho người dùng khác

**Vai trò người dùng**:
| Vai trò | Mô tả |
|------|-------|
| ADMIN | Quản trị viên - toàn quyền |
| SALES | Nhân viên kinh doanh |
| PRODUCTION | Nhân viên sản xuất |
| QC | Nhân viên kiểm tra chất lượng |
| WAREHOUSE | Nhân viên kho |
| INSTALLER | Nhân viên lắp đặt |
| ACCOUNTANT | Kế toán |

**Trạng thái người dùng**:
| Trạng thái | Mô tả |
|------------|-------|
| ACTIVE | Đang hoạt động |
| INACTIVE | Không hoạt động |
| SUSPENDED | Bị tạm khóa |

**API Endpoints**:
| Phương thức | Endpoint | Mô tả |
|-------------|----------|-------|
| POST | /api/v1/users | Tạo người dùng mới |
| GET | /api/v1/users | Danh sách người dùng |
| GET | /api/v1/users/:id | Chi tiết người dùng |
| PUT | /api/v1/users/:id | Cập nhật người dùng |
| DELETE | /api/v1/users/:id | Xóa người dùng |
| POST | /api/v1/users/:id/change-password | Đổi mật khẩu (người dùng) |
| POST | /api/v1/users/:id/reset-password | Reset mật khẩu (admin) |

---

### 3. �👥 Module Customer (Khách hàng)

**Mô tả**: Quản lý thông tin khách hàng với 3 loại: Cá nhân, Công ty và Ký gửi.

**Chức năng**:
- **Tạo khách hàng**: Thêm mới với thông tin cơ bản (tên, loại, email, phone, địa chỉ)
- **Danh sách khách hàng**: Tìm kiếm, lọc theo loại, phân trang
- **Chi tiết khách hàng**: Xem thông tin đầy đủ bao gồm lịch sử đơn hàng
- **Cập nhật khách hàng**: Sửa đổi thông tin khách hàng
- **Mã khách hàng tự động**: Format `KH{YYMM}{XXXX}` (VD: KH2601-0001)

**Loại khách hàng**:
| Loại | Mô tả |
|------|-------|
| INDIVIDUAL | Khách hàng cá nhân |
| COMPANY | Khách hàng công ty/doanh nghiệp |
| CONSIGNMENT | Khách hàng ký gửi (gửi vật tư để gia công) |

**API Endpoints**:
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/customers | Tạo khách hàng mới |
| GET | /api/v1/customers | Danh sách khách hàng |
| GET | /api/v1/customers/:id | Chi tiết khách hàng |
| PUT | /api/v1/customers/:id | Cập nhật khách hàng |

---

### 4. 📦 Module Sản phẩm (Product)

**Mô tả**: Quản lý danh mục sản phẩm và dịch vụ của công ty.

**Chức năng**:
- **Tạo sản phẩm**: Thêm sản phẩm mới với giá cơ bản, đơn vị tính
- **Danh sách sản phẩm**: Tìm kiếm, lọc theo loại, trạng thái
- **Chi tiết sản phẩm**: Xem thông tin đầy đủ, mô tả, thông số
- **Cập nhật sản phẩm**: Sửa thông tin, giá, trạng thái
- **Xóa sản phẩm**: Xóa sản phẩm không còn sử dụng
- **Mã sản phẩm tự động**: Theo loại sản phẩm (VD: REM001, GC001)

**Loại sản phẩm**:
| Loại | Mô tả |
|------|-------|
| CURTAIN_FABRIC | Rèm vải |
| CURTAIN_ROMAN | Rèm roman |
| CURTAIN_ROLLER | Rèm cuốn |
| CURTAIN_VERTICAL | Rèm lá dọc |
| CUSHION | Đệm/gối |
| EMBROIDERY | Dịch vụ thêu |
| ACCESSORY | Phụ kiện rèm |

**API Endpoints**:
| Phương thức | Endpoint | Mô tả |
|-------------|----------|-------|
| POST | /api/v1/products | Tạo sản phẩm mới |
| GET | /api/v1/products | Danh sách sản phẩm |
| GET | /api/v1/products/:id | Chi tiết sản phẩm |
| PUT | /api/v1/products/:id | Cập nhật sản phẩm |
| DELETE | /api/v1/products/:id | Xóa sản phẩm |

---

### 5. 📋 Module Báo giá (Quotation)

**Mô tả**: Quản lý báo giá cho khách hàng trước khi tạo đơn hàng.

**Chức năng**:
- **Tạo báo giá**: Lập báo giá với nhiều sản phẩm/dịch vụ
- **Danh sách báo giá**: Lọc theo khách hàng, trạng thái, thời gian
- **Chi tiết báo giá**: Xem chi tiết các hạng mục, tổng tiền
- **Cập nhật báo giá**: Sửa đổi nội dung, giá
- **Thay đổi trạng thái**: BẢN NHÁP → ĐÃ GỬI → DUYỆT/TỪ CHỐI/HẾT HẠN
- **Chuyển đổi sang đơn hàng**: Báo giá được duyệt có thể chuyển thành đơn hàng

**Trạng thái báo giá**:
| Trạng thái | Mô tả |
|------------|-------|
| DRAFT | Bản nháp, đang soạn |
| SENT | Đã gửi cho khách hàng |
| APPROVED | Khách hàng đồng ý |
| REJECTED | Khách hàng từ chối |
| EXPIRED | Hết hạn hiệu lực |

**API Endpoints**:
| Phương thức | Endpoint | Mô tả |
|-------------|----------|-------|
| POST | /api/v1/quotations | Tạo báo giá mới |
| GET | /api/v1/quotations | Danh sách báo giá |
| GET | /api/v1/quotations/:id | Chi tiết báo giá |
| PUT | /api/v1/quotations/:id | Cập nhật báo giá |
| PATCH | /api/v1/quotations/:id/status | Thay đổi trạng thái |

---

### 6. 🛒 Module Đơn hàng (Order)

**Mô tả**: Quản lý đơn hàng với khả năng xử lý đa hạng mục (rèm theo cửa, gia công theo lô).

**Chức năng**:
- **Tạo đơn hàng**: Từ báo giá hoặc trực tiếp, với nhiều hạng mục
- **Danh sách đơn hàng**: Lọc theo khách hàng, trạng thái, thời gian
- **Chi tiết đơn hàng**: Xem chi tiết các hạng mục, tiến độ sản xuất
- **Cập nhật đơn hàng**: Sửa đổi thông tin, hạng mục
- **Quản lý trạng thái**: Theo dõi tiến độ từ đặt hàng → sản xuất → giao hàng
- **Mã đơn hàng tự động**: Định dạng `DH{YYMM}{XXXX}` (VD: DH2601-0001)

**Trạng thái đơn hàng**:
| Trạng thái | Mô tả |
|------------|-------|
| PENDING | Mới tạo, chờ xác nhận |
| CONFIRMED | Đã xác nhận |
| IN_PRODUCTION | Đang sản xuất |
| READY_FOR_DELIVERY | Sẵn sàng giao hàng |
| PARTIALLY_DELIVERED | Giao hàng một phần |
| DELIVERED | Đã giao hàng hoàn tất |
| COMPLETED | Hoàn thành (đã thanh toán) |
| CANCELLED | Đã hủy |

**API Endpoints**:
| Phương thức | Endpoint | Mô tả |
|-------------|----------|-------|
| POST | /api/v1/orders | Tạo đơn hàng mới |
| GET | /api/v1/orders | Danh sách đơn hàng |
| GET | /api/v1/orders/:id | Chi tiết đơn hàng |
| PUT | /api/v1/orders/:id | Cập nhật đơn hàng |
| PATCH | /api/v1/orders/:id/status | Thay đổi trạng thái |

---

### 7. 🏭 Module Lệnh sản xuất (Work Order)

**Mô tả**: Quản lý lệnh sản xuất theo từng công đoạn (Routing), hỗ trợ quy trình sản xuất rèm và gia công thêu/đệm.

**Chức năng**:
- **Tạo lệnh sản xuất**: Từ đơn hàng, phân công cho bộ phận sản xuất
- **Danh sách lệnh sản xuất**: Lọc theo đơn hàng, trạng thái, bộ phận
- **Chi tiết lệnh sản xuất**: Xem các công đoạn, tiến độ từng bước
- **Cập nhật tiến độ**: Cập nhật trạng thái từng công đoạn
- **Quản lý công đoạn**: Mỗi lệnh có nhiều bước sản xuất theo thứ tự
- **Mã lệnh sản xuất tự động**: Định dạng `WO{YYMM}{XXXX}`

**Trạng thái lệnh sản xuất**:
| Trạng thái | Mô tả |
|------------|-------|
| PENDING | Chờ sản xuất |
| IN_PROGRESS | Đang sản xuất |
| COMPLETED | Hoàn thành |
| ON_HOLD | Tạm dừng |

**Quy trình sản xuất mẫu**:
```
Rèm vải: Cắt vải → May → Lắp phụ kiện → Đóng gói
Thêu: Nhận vải → Căng khung → Thêu → QC → Đóng gói
Đệm: Cắt → May → Nhồi bông → QC → Đóng gói
```

**API Endpoints**:
| Phương thức | Endpoint | Mô tả |
|-------------|----------|-------|
| POST | /api/v1/work-orders | Tạo lệnh sản xuất |
| GET | /api/v1/work-orders | Danh sách lệnh sản xuất |
| GET | /api/v1/work-orders/:id | Chi tiết lệnh sản xuất |
| PUT | /api/v1/work-orders/:id | Cập nhật lệnh sản xuất |
| PATCH | /api/v1/work-orders/:id/status | Thay đổi trạng thái |

---

### 8. ✅ Module Kiểm tra chất lượng (QC Record)

**Mô tả**: Quản lý biên bản kiểm tra chất lượng sản phẩm trong quá trình sản xuất.

**Chức năng**:
- **Tạo biên bản QC**: Ghi nhận kết quả kiểm tra sản phẩm
- **Danh sách biên bản**: Lọc theo lệnh sản xuất, kết quả, thời gian
- **Chi tiết biên bản**: Xem thông tin kiểm tra, lỗi phát hiện
- **Ghi nhận lỗi**: Mô tả chi tiết các lỗi nếu có
- **Liên kết với lệnh sản xuất**: Mỗi biên bản QC gắn với một lệnh sản xuất

**Kết quả kiểm tra**:
| Kết quả | Mô tả |
|---------|-------|
| PASS | Đạt yêu cầu chất lượng |
| FAIL | Không đạt, cần xử lý |
| CONDITIONAL | Đạt có điều kiện (cần sửa nhỏ) |

**Thông tin biên bản QC**:
- Ngày kiểm tra
- Số lượng kiểm tra
- Số lượng đạt / không đạt
- Mô tả lỗi (nếu có)
- Ghi chú của QC

**API Endpoints**:
| Phương thức | Endpoint | Mô tả |
|-------------|----------|-------|
| POST | /api/v1/qc-records | Tạo biên bản QC |
| GET | /api/v1/qc-records | Danh sách biên bản QC |
| GET | /api/v1/qc-records/:id | Chi tiết biên bản QC |

---

### 9. 📊 Module Quản lý kho (Inventory)

**Mô tả**: Quản lý tồn kho với khả năng phân biệt hàng công ty và hàng ký gửi của khách.

**Chức năng**:
- **Xem tồn kho**: Danh sách tồn kho theo sản phẩm, vật tư, kho
- **Chi tiết tồn kho**: Số lượng hiện có, đã đặt trước, khả dụng
- **Nhập kho**: Ghi nhận nhập hàng mới (mua, sản xuất xong, nhận ký gửi)
- **Điều chỉnh tồn kho**: Tăng/giảm do kiểm kê, hao hụt
- **Lịch sử giao dịch**: Theo dõi mọi biến động tồn kho
- **Phân loại theo quyền sở hữu**: Hàng công ty vs Hàng ký gửi

**Loại quyền sở hữu**:
| Loại | Mô tả |
|------|-------|
| COMPANY | Hàng của công ty |
| CONSIGNMENT | Hàng ký gửi của khách |

**Loại giao dịch kho**:
| Loại | Mô tả |
|------|-------|
| IN | Nhập kho |
| OUT | Xuất kho |
| ADJUST | Điều chỉnh |
| RESERVE | Đặt trước cho đơn hàng |
| RELEASE | Giải phóng đặt trước |

**API Endpoints**:
| Phương thức | Endpoint | Mô tả |
|-------------|----------|-------|
| GET | /api/v1/inventory | Danh sách tồn kho |
| GET | /api/v1/inventory/:id | Chi tiết tồn kho |
| POST | /api/v1/inventory/receive | Nhập kho |
| POST | /api/v1/inventory/adjust | Điều chỉnh tồn kho |

---

### 10. 🚚 Module Giao hàng & Lắp đặt (Delivery)

**Mô tả**: Quản lý lịch giao hàng và lắp đặt sản phẩm cho khách hàng.

**Chức năng**:
- **Tạo lịch giao hàng**: Lên lịch giao/lắp đặt cho đơn hàng
- **Danh sách giao hàng**: Lọc theo đơn hàng, ngày, trạng thái
- **Chi tiết giao hàng**: Thông tin địa chỉ, liên hệ, sản phẩm
- **Cập nhật thông tin**: Sửa đổi lịch, địa chỉ, ghi chú
- **Quản lý trạng thái**: Theo dõi tiến độ giao hàng
- **Mã giao hàng tự động**: `DLV{YYMM}{XXXX}` (giao hàng), `INS{YYMM}{XXXX}` (lắp đặt)

**Loại giao hàng**:
| Loại | Mô tả |
|------|-------|
| DELIVERY | Giao hàng thông thường |
| INSTALLATION | Lắp đặt tại nhà/công trình |

**Trạng thái giao hàng**:
| Trạng thái | Mô tả |
|------------|-------|
| SCHEDULED | Đã lên lịch |
| IN_TRANSIT | Đang vận chuyển |
| DELIVERED | Đã giao/lắp đặt xong |
| FAILED | Giao hàng thất bại |
| RESCHEDULED | Đã đổi lịch |

**API Endpoints**:
| Phương thức | Endpoint | Mô tả |
|-------------|----------|-------|
| POST | /api/v1/deliveries | Tạo lịch giao hàng |
| GET | /api/v1/deliveries | Danh sách giao hàng |
| GET | /api/v1/deliveries/:id | Chi tiết giao hàng |
| PUT | /api/v1/deliveries/:id | Cập nhật giao hàng |
| PATCH | /api/v1/deliveries/:id/status | Thay đổi trạng thái |

---

## Swagger Documentation

Truy cập **http://localhost:3000/api-docs** để xem tài liệu API đầy đủ với Swagger UI.

---

## Quy trình nghiệp vụ tổng quan

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Báo giá    │───▶│  Đơn hàng   │───▶│  Sản xuất   │───▶│  Giao hàng  │
│  Quotation  │    │   Order     │    │ Work Order  │    │  Delivery   │
└─────────────┘    └─────────────┘    └──────┬──────┘    └─────────────┘
                                             │
                                             ▼
                                      ┌─────────────┐
                                      │  Kiểm tra   │
                                      │  QC Record  │
                                      └─────────────┘
```

**Luồng chính**:
1. **Báo giá** → Tư vấn, lập báo giá cho khách hàng
2. **Đơn hàng** → Khách duyệt báo giá, tạo đơn hàng
3. **Sản xuất** → Tạo lệnh sản xuất, phân công công đoạn
4. **QC** → Kiểm tra chất lượng sau mỗi công đoạn/sản phẩm
5. **Giao hàng** → Lên lịch và thực hiện giao hàng/lắp đặt

## Tài khoản mẫu

Sau khi seed dữ liệu:

| Email | Mật khẩu | Vai trò |
|-------|----------|---------|
| admin@example.com | admin123 | ADMIN |
| sales@example.com | sales123 | SALES |

## Ví dụ sử dụng API

### Đăng nhập

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "admin123"}'
```

### Tạo khách hàng

```bash
curl -X POST http://localhost:3000/api/v1/customers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "name": "Công ty ABC",
    "type": "COMPANY",
    "email": "contact@abc.com",
    "phone": "0901234567"
  }'
```

## Tài liệu

Xem chi tiết tại thư mục `/docs`:

- [01-overview.md](docs/01-overview.md) - Tổng quan hệ thống
- [02-requirements.md](docs/02-requirements.md) - Yêu cầu hệ thống
- [03-domain-model.md](docs/03-domain-model.md) - Mô hình miền
- [04-architecture.md](docs/04-architecture.md) - Kiến trúc
- [05-api-spec.md](docs/05-api-spec.md) - Đặc tả API
- [06-database-schema.md](docs/06-database-schema.md) - Cấu trúc cơ sở dữ liệu
- [07-roles-permissions.md](docs/07-roles-permissions.md) - Phân quyền
- [08-workflows.md](docs/08-workflows.md) - Quy trình nghiệp vụ
- [09-backlog.md](docs/09-backlog.md) - Danh sách công việc

## Scripts

```bash
npm run dev              # Chạy server ở chế độ phát triển
npm run build            # Build cho môi trường sản xuất
npm start                # Chạy server ở chế độ sản xuất
npm run prisma:generate  # Tạo Prisma client
npm run prisma:migrate   # Chạy migration cơ sở dữ liệu
npm run prisma:studio    # Mở Prisma Studio
```

## Giấy phép

ISC