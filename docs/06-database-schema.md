# Database Schema

## 1. Tổng quan

- **Database**: PostgreSQL
- **ORM**: Prisma
- **Naming Convention**: snake_case cho tables và columns

## 2. Entity Relationship Diagram

```
                                    ┌──────────────┐
                                    │    users     │
                                    ├──────────────┤
                                    │ id (PK)      │
                           ┌────────│ email        │
                           │        │ password_hash│
                           │        │ full_name    │
                           │        │ role         │
                           │        │ status       │
                           │        └──────────────┘
                           │               │
                           │               │ 1:N
                           │               ▼
                           │        ┌──────────────┐
                           │        │refresh_tokens│
                           │        ├──────────────┤
                           │        │ id (PK)      │
                           │        │ token_hash   │
                           │        │ user_id (FK) │
                           │        │ expires_at   │
                           │        └──────────────┘
                           │
     ┌─────────────────────┼─────────────────────┐
     │                     │                     │
     ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐      ┌──────────────┐
│  customers   │    │  quotations  │      │   orders     │
├──────────────┤    ├──────────────┤      ├──────────────┤
│ id (PK)      │◄───│ customer_id  │      │ id (PK)      │
│ code         │    │ created_by_id│──────│ quotation_id │
│ name         │    │ status       │      │ customer_id  │◄─┐
│ type         │    │ valid_until  │      │ status       │  │
│ email        │    │ total        │      │ total        │  │
│ phone        │    └──────┬───────┘      └──────┬───────┘  │
└──────────────┘           │                     │          │
       │                   │ 1:N                 │ 1:N      │
       │                   ▼                     ▼          │
       │           ┌──────────────┐       ┌──────────────┐  │
       │           │quotation_items│      │ order_items  │  │
       │           ├──────────────┤       ├──────────────┤  │
       │           │ id (PK)      │       │ id (PK)      │  │
       │           │ quotation_id │       │ order_id     │  │
       │           │ item_type    │       │ item_type    │  │
       │           │ product_id   │       │ product_id   │  │
       │           │ window_name  │       │ window_name  │  │
       │           │ width/height │       │ batch_code   │  │
       │           │ batch_code   │       │ quantity     │  │
       │           └──────────────┘       └──────┬───────┘  │
       │                                         │          │
       │                                         │ 1:N      │
       │                                         ▼          │
       │                                  ┌──────────────┐  │
       │                                  │ work_orders  │  │
       │                                  ├──────────────┤  │
       │                                  │ id (PK)      │  │
       │                                  │ order_id (FK)│  │
       │                                  │ order_item_id│  │
       │                                  │ assignee_id  │  │
       │                                  │ status       │  │
       │                                  └──────┬───────┘  │
       │                                         │          │
       │                                         │ 1:N      │
       │                                         ▼          │
       │                                  ┌────────────────┐│
       │                                  │work_order_steps││
       │                                  ├────────────────┤│
       │                                  │ id (PK)        ││
       │                                  │ work_order_id  ││
       │                                  │ routing_step_id││
       │                                  │ status         ││
       │                                  └────────────────┘│
       │                                                    │
       │           ┌──────────────┐                         │
       └───────────│  inventory   │─────────────────────────┘
                   ├──────────────┤
                   │ id (PK)      │
                   │ product_id   │
                   │ material_id  │
                   │ ownership    │
                   │ customer_id  │  (for consignment)
                   │ warehouse    │
                   │ quantity     │
                   └──────────────┘
```

## 3. Tables Detail

### 3.1. users
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Primary key |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Email đăng nhập |
| password_hash | VARCHAR(255) | NOT NULL | Bcrypt hash |
| full_name | VARCHAR(255) | NOT NULL | Họ tên |
| phone | VARCHAR(20) | | Số điện thoại |
| role | ENUM | NOT NULL, DEFAULT 'SALES' | UserRole |
| status | ENUM | NOT NULL, DEFAULT 'ACTIVE' | UserStatus |
| created_at | TIMESTAMP | DEFAULT NOW() | |
| updated_at | TIMESTAMP | | Auto update |

### 3.2. refresh_tokens
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Primary key |
| token_hash | VARCHAR(255) | UNIQUE, NOT NULL | SHA256 hash của token |
| user_id | UUID | FK → users.id | |
| expires_at | TIMESTAMP | NOT NULL | Thời điểm hết hạn |
| created_at | TIMESTAMP | DEFAULT NOW() | |
| revoked_at | TIMESTAMP | | Thời điểm thu hồi |

### 3.3. customers
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Primary key |
| code | VARCHAR(20) | UNIQUE, NOT NULL | Mã KH (auto-gen) |
| name | VARCHAR(255) | NOT NULL | Tên khách hàng |
| type | ENUM | NOT NULL, DEFAULT 'INDIVIDUAL' | CustomerType |
| email | VARCHAR(255) | | Email |
| phone | VARCHAR(20) | | SĐT |
| address | TEXT | | Địa chỉ |
| tax_code | VARCHAR(20) | | Mã số thuế |
| contact_person | VARCHAR(255) | | Người liên hệ |
| notes | TEXT | | Ghi chú |
| is_active | BOOLEAN | DEFAULT TRUE | Trạng thái |
| created_at | TIMESTAMP | DEFAULT NOW() | |
| updated_at | TIMESTAMP | | |

### 3.4. products
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Primary key |
| code | VARCHAR(50) | UNIQUE, NOT NULL | Mã SP |
| name | VARCHAR(255) | NOT NULL | Tên SP |
| type | ENUM | NOT NULL | ProductType |
| unit | VARCHAR(20) | NOT NULL | Đơn vị |
| description | TEXT | | Mô tả |
| base_price | DECIMAL(15,2) | NOT NULL | Giá cơ bản |
| is_active | BOOLEAN | DEFAULT TRUE | |
| created_at | TIMESTAMP | DEFAULT NOW() | |
| updated_at | TIMESTAMP | | |

### 3.5. materials
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Primary key |
| code | VARCHAR(50) | UNIQUE, NOT NULL | Mã vật tư |
| name | VARCHAR(255) | NOT NULL | Tên |
| unit | VARCHAR(20) | NOT NULL | Đơn vị |
| description | TEXT | | |
| min_stock | DECIMAL(15,2) | DEFAULT 0 | Tồn kho tối thiểu |
| is_active | BOOLEAN | DEFAULT TRUE | |
| created_at | TIMESTAMP | DEFAULT NOW() | |
| updated_at | TIMESTAMP | | |

### 3.6. quotations
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Primary key |
| code | VARCHAR(20) | UNIQUE, NOT NULL | Mã báo giá |
| customer_id | UUID | FK → customers.id | |
| created_by_id | UUID | FK → users.id | Người tạo |
| status | ENUM | DEFAULT 'DRAFT' | QuotationStatus |
| valid_until | DATE | | Hạn hiệu lực |
| subtotal | DECIMAL(15,2) | DEFAULT 0 | Tạm tính |
| discount | DECIMAL(15,2) | DEFAULT 0 | Chiết khấu |
| tax | DECIMAL(15,2) | DEFAULT 0 | Thuế |
| total | DECIMAL(15,2) | DEFAULT 0 | Tổng cộng |
| notes | TEXT | | |
| created_at | TIMESTAMP | DEFAULT NOW() | |
| updated_at | TIMESTAMP | | |

### 3.7. quotation_items
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Primary key |
| quotation_id | UUID | FK → quotations.id | |
| item_type | ENUM | NOT NULL | ItemType |
| product_id | UUID | FK → products.id | |
| description | TEXT | | Mô tả chi tiết |
| window_name | VARCHAR(255) | | Tên cửa (for CURTAIN) |
| width | DECIMAL(10,2) | | Chiều rộng cm |
| height | DECIMAL(10,2) | | Chiều cao cm |
| batch_code | VARCHAR(50) | | Mã lô (for BATCH) |
| batch_quantity | INTEGER | | SL lô |
| quantity | DECIMAL(15,2) | NOT NULL | Số lượng |
| unit | VARCHAR(20) | NOT NULL | Đơn vị |
| unit_price | DECIMAL(15,2) | NOT NULL | Đơn giá |
| amount | DECIMAL(15,2) | NOT NULL | Thành tiền |
| notes | TEXT | | |

### 3.8. orders
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Primary key |
| code | VARCHAR(20) | UNIQUE, NOT NULL | Mã đơn hàng |
| quotation_id | UUID | FK, UNIQUE | Từ báo giá |
| customer_id | UUID | FK → customers.id | |
| created_by_id | UUID | FK → users.id | |
| status | ENUM | DEFAULT 'PENDING' | OrderStatus |
| order_date | TIMESTAMP | DEFAULT NOW() | Ngày đặt |
| delivery_date | TIMESTAMP | | Ngày giao dự kiến |
| install_date | TIMESTAMP | | Ngày lắp đặt |
| subtotal | DECIMAL(15,2) | DEFAULT 0 | |
| discount | DECIMAL(15,2) | DEFAULT 0 | |
| tax | DECIMAL(15,2) | DEFAULT 0 | |
| total | DECIMAL(15,2) | DEFAULT 0 | |
| paid_amount | DECIMAL(15,2) | DEFAULT 0 | Đã thanh toán |
| shipping_address | TEXT | | Địa chỉ giao |
| notes | TEXT | | |
| created_at | TIMESTAMP | DEFAULT NOW() | |
| updated_at | TIMESTAMP | | |

### 3.9. inventory
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Primary key |
| product_id | UUID | FK, NULL | Sản phẩm |
| material_id | UUID | FK, NULL | Vật tư |
| ownership | ENUM | DEFAULT 'COMPANY' | InventoryOwnership |
| customer_id | UUID | FK, NULL | KH (for CONSIGNMENT) |
| warehouse | VARCHAR(50) | DEFAULT 'MAIN' | Kho |
| location | VARCHAR(100) | | Vị trí |
| quantity | DECIMAL(15,2) | DEFAULT 0 | Số lượng |
| reserved_qty | DECIMAL(15,2) | DEFAULT 0 | Đã đặt trước |
| unit | VARCHAR(20) | NOT NULL | Đơn vị |
| last_updated | TIMESTAMP | | Auto update |

**Unique Constraint**: (product_id, material_id, ownership, customer_id, warehouse)

## 4. Indexes

```sql
-- Performance indexes
CREATE INDEX idx_customers_code ON customers(code);
CREATE INDEX idx_customers_type ON customers(type);
CREATE INDEX idx_quotations_customer ON quotations(customer_id);
CREATE INDEX idx_quotations_status ON quotations(status);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_work_orders_order ON work_orders(order_id);
CREATE INDEX idx_work_orders_status ON work_orders(status);
CREATE INDEX idx_inventory_product ON inventory(product_id);
CREATE INDEX idx_inventory_ownership ON inventory(ownership);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity, entity_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
```

## 5. Data Types (Enums)

```sql
CREATE TYPE user_role AS ENUM (
  'ADMIN', 'SALES', 'WAREHOUSE', 'PRODUCTION', 'QC', 'INSTALLER', 'ACCOUNTANT'
);

CREATE TYPE user_status AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

CREATE TYPE customer_type AS ENUM ('INDIVIDUAL', 'COMPANY', 'CONSIGNMENT');

CREATE TYPE quotation_status AS ENUM ('DRAFT', 'SENT', 'APPROVED', 'REJECTED', 'EXPIRED');

CREATE TYPE order_status AS ENUM (
  'PENDING', 'CONFIRMED', 'IN_PRODUCTION', 'QC_PENDING', 
  'QC_PASSED', 'READY_DELIVERY', 'INSTALLING', 'COMPLETED', 'CANCELLED'
);

CREATE TYPE work_order_status AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD');

CREATE TYPE inventory_ownership AS ENUM ('COMPANY', 'CONSIGNMENT');

CREATE TYPE product_type AS ENUM ('CURTAIN', 'EMBROIDERY', 'MATERIAL', 'ACCESSORY');

CREATE TYPE item_type AS ENUM ('CURTAIN_WINDOW', 'PROCESSING_BATCH');

CREATE TYPE qc_result AS ENUM ('PENDING', 'PASSED', 'FAILED', 'REWORK');
```
