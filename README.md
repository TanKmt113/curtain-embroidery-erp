# Hệ thống ERP Quản lý Rèm & Gia công Thêu/Đệm

Hệ thống ERP (Enterprise Resource Planning) được xây dựng theo Clean Architecture trên nền tảng Node.js, Express, TypeScript và PostgreSQL.

## Tính năng chính

- 🔐 **Authentication**: JWT Access Token + Refresh Token
- 👥 **Customer Management**: Quản lý khách hàng (cá nhân, công ty, ký gửi)
- 📦 **Order Management**: Đơn hàng đa hạng mục (Rèm theo cửa, Gia công theo lô)
- 🏭 **Production**: Quản lý sản xuất theo công đoạn (Routing)
- 📊 **Inventory**: Quản lý kho (Công ty vs Ký gửi)
- ✅ **QC**: Kiểm tra chất lượng
- 🚚 **Delivery**: Giao hàng và lắp đặt

## Công nghệ sử dụng

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

## Cấu trúc thư mục

```
src/
├── domain/                    # Enterprise Business Rules
│   ├── entities/              # Domain entities
│   ├── repositories/          # Repository interfaces
│   └── errors/                # Domain errors
│
├── application/               # Application Business Rules
│   ├── use-cases/             # Use case implementations
│   ├── dtos/                  # Data Transfer Objects
│   └── interfaces/            # Application interfaces
│
├── infrastructure/            # Frameworks & Drivers
│   ├── database/              # Database connection
│   ├── repositories/          # Repository implementations
│   └── security/              # JWT, Hashing
│
├── presentation/              # Interface Adapters
│   ├── controllers/           # HTTP Controllers
│   ├── routes/                # Express routes
│   ├── middlewares/           # Express middlewares
│   └── validators/            # Zod validators
│
└── main/                      # Main/Composition Root
    ├── config/                # Configuration
    ├── factories/             # Factory functions
    └── server.ts              # Application entry point
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
# Copy file .env.example thành .env
cp .env.example .env

# Sửa DATABASE_URL trong .env với thông tin PostgreSQL của bạn
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/curtain_erp?schema=public"
```

### 4. Tạo database và migrate

```bash
# Tạo database (nếu chưa có)
# Trong PostgreSQL: CREATE DATABASE curtain_erp;

# Chạy migration
npx prisma migrate dev --name init

# Seed dữ liệu mẫu (optional)
npx ts-node prisma/seed.ts
```

### 5. Chạy ứng dụng

```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

Server sẽ chạy tại: http://localhost:3000

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/auth/login | Đăng nhập |
| POST | /api/v1/auth/refresh | Làm mới access token |
| POST | /api/v1/auth/logout | Đăng xuất |

### Customers

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/customers | Tạo khách hàng |
| GET | /api/v1/customers | Danh sách khách hàng |
| GET | /api/v1/customers/:id | Chi tiết khách hàng |
| PUT | /api/v1/customers/:id | Cập nhật khách hàng |

## Tài khoản mẫu

Sau khi seed dữ liệu:

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | admin123 | ADMIN |
| sales@example.com | sales123 | SALES |

## Ví dụ sử dụng API

### Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "admin123"}'
```

### Create Customer

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
- [03-domain-model.md](docs/03-domain-model.md) - Mô hình domain
- [04-architecture.md](docs/04-architecture.md) - Kiến trúc
- [05-api-spec.md](docs/05-api-spec.md) - API Specification
- [06-database-schema.md](docs/06-database-schema.md) - Database Schema
- [07-roles-permissions.md](docs/07-roles-permissions.md) - Phân quyền
- [08-workflows.md](docs/08-workflows.md) - Quy trình nghiệp vụ
- [09-backlog.md](docs/09-backlog.md) - Product Backlog

## Scripts

```bash
npm run dev           # Chạy development server
npm run build         # Build production
npm start             # Chạy production server
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Chạy database migration
npm run prisma:studio    # Mở Prisma Studio
```

## License

ISC