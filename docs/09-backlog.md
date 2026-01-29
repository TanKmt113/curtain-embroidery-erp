# Product Backlog

## 1. Epic Overview

| Epic ID | Tên | Mô tả | Priority |
|---------|-----|-------|----------|
| E01 | Authentication | Xác thực và phân quyền | P0 |
| E02 | Customer Management | Quản lý khách hàng | P0 |
| E03 | Product Management | Quản lý sản phẩm, vật tư | P1 |
| E04 | Quotation Management | Quản lý báo giá | P0 |
| E05 | Order Management | Quản lý đơn hàng | P0 |
| E06 | Production Management | Quản lý sản xuất | P1 |
| E07 | Inventory Management | Quản lý kho | P1 |
| E08 | QC Management | Quản lý kiểm tra chất lượng | P2 |
| E09 | Delivery Management | Quản lý giao hàng/lắp đặt | P2 |
| E10 | Reporting | Báo cáo thống kê | P2 |

## 2. Sprint Backlog

### Sprint 1: Foundation (2 weeks)

| ID | User Story | Tasks | Points |
|----|------------|-------|--------|
| S1-01 | Setup project structure | - Init project<br>- Setup Clean Architecture<br>- Configure Prisma | 5 |
| S1-02 | Implement Auth Login | - Create User entity<br>- Login use case<br>- JWT service | 8 |
| S1-03 | Implement Auth Refresh | - Refresh token use case<br>- Token hash storage | 5 |
| S1-04 | Implement Customer CRUD | - Customer entity<br>- CRUD use cases<br>- API endpoints | 8 |
| S1-05 | Error handling | - Domain errors<br>- Error middleware<br>- Response format | 3 |
| S1-06 | Logging setup | - Pino logger<br>- Request logging | 2 |

**Total: 31 points**

### Sprint 2: Sales Module (2 weeks)

| ID | User Story | Tasks | Points |
|----|------------|-------|--------|
| S2-01 | Product CRUD | - Product entity<br>- CRUD use cases | 5 |
| S2-02 | Material CRUD | - Material entity<br>- CRUD use cases | 5 |
| S2-03 | Create Quotation | - Quotation entity<br>- Create use case<br>- Multi-item support | 8 |
| S2-04 | Quotation Items | - CURTAIN_WINDOW type<br>- PROCESSING_BATCH type | 5 |
| S2-05 | Quotation Workflow | - Send, Approve, Reject<br>- Status transitions | 5 |
| S2-06 | Convert to Order | - Conversion use case<br>- Data mapping | 5 |

**Total: 33 points**

### Sprint 3: Order & Production (2 weeks)

| ID | User Story | Tasks | Points |
|----|------------|-------|--------|
| S3-01 | Order Management | - Order entity<br>- CRUD use cases | 8 |
| S3-02 | Order Status Flow | - Status transitions<br>- Validation rules | 5 |
| S3-03 | Routing Setup | - RoutingStep entity<br>- Product routing | 5 |
| S3-04 | Work Order Creation | - WorkOrder entity<br>- Auto-create from Order | 8 |
| S3-05 | Work Order Steps | - Step management<br>- Progress tracking | 5 |
| S3-06 | Work Order Assignment | - Assign worker<br>- Priority management | 3 |

**Total: 34 points**

### Sprint 4: Inventory & QC (2 weeks)

| ID | User Story | Tasks | Points |
|----|------------|-------|--------|
| S4-01 | Inventory Setup | - Inventory entity<br>- Ownership types | 5 |
| S4-02 | Stock In/Out | - Transaction handling<br>- Quantity validation | 8 |
| S4-03 | Consignment Inventory | - Customer inventory<br>- Isolation rules | 5 |
| S4-04 | Stock Reservation | - Reserve for order<br>- Release reservation | 5 |
| S4-05 | QC Records | - QCRecord entity<br>- CRUD operations | 5 |
| S4-06 | QC Workflow | - Pass/Fail/Rework<br>- Link to Order status | 5 |

**Total: 33 points**

### Sprint 5: Delivery & Polish (2 weeks)

| ID | User Story | Tasks | Points |
|----|------------|-------|--------|
| S5-01 | Delivery Scheduling | - Delivery entity<br>- Schedule management | 5 |
| S5-02 | Installation Tracking | - Installation type<br>- Completion tracking | 5 |
| S5-03 | Audit Logging | - AuditLog entity<br>- Auto-logging middleware | 5 |
| S5-04 | Basic Reports | - Sales summary<br>- Inventory report | 8 |
| S5-05 | API Documentation | - Swagger/OpenAPI<br>- Postman collection | 3 |
| S5-06 | Performance Optimization | - Query optimization<br>- Caching | 5 |

**Total: 31 points**

## 3. User Stories Detail

### E01: Authentication

#### US-01: Login
```
AS A user
I WANT TO login with email and password
SO THAT I can access the system

Acceptance Criteria:
- Valid credentials return access token + refresh token
- Invalid credentials return 401
- Inactive user cannot login
- Login attempt is logged
```

#### US-02: Token Refresh
```
AS A user
I WANT TO refresh my access token
SO THAT I can continue using the system without re-login

Acceptance Criteria:
- Valid refresh token returns new access token
- Expired refresh token returns 401
- Revoked refresh token returns 401
```

### E02: Customer Management

#### US-03: Create Customer
```
AS A sales person
I WANT TO create a new customer
SO THAT I can manage their orders

Acceptance Criteria:
- Auto-generate customer code (CUS-XXXX)
- Support 3 types: INDIVIDUAL, COMPANY, CONSIGNMENT
- Validate email format
- Validate phone format
```

#### US-04: Search Customers
```
AS A user
I WANT TO search customers by name, code, phone
SO THAT I can quickly find a customer

Acceptance Criteria:
- Search across multiple fields
- Support pagination
- Filter by type
- Filter by active status
```

### E04: Quotation Management

#### US-05: Create Quotation with Multiple Items
```
AS A sales person
I WANT TO create a quotation with both curtain and processing items
SO THAT I can quote for complex orders

Acceptance Criteria:
- Support CURTAIN_WINDOW items with dimensions
- Support PROCESSING_BATCH items with batch info
- Auto-calculate line amounts
- Auto-calculate subtotal, discount, tax, total
```

#### US-06: Convert Quotation to Order
```
AS A sales person
I WANT TO convert approved quotation to order
SO THAT I can start the fulfillment process

Acceptance Criteria:
- Only APPROVED quotation can be converted
- Copy all items to order
- Link order to quotation
- Change quotation status
- One quotation = one order
```

### E06: Production Management

#### US-07: Create Work Orders from Order
```
AS A production manager
I WANT TO automatically create work orders
SO THAT production can start

Acceptance Criteria:
- Create WO for each order item
- Copy routing steps to WO steps
- Set default status PENDING
- Link WO to order and order item
```

#### US-08: Track Production Progress
```
AS A production worker
I WANT TO update work order step status
SO THAT progress is tracked

Acceptance Criteria:
- Steps must be completed in order
- Record start and complete time
- Update WO status based on steps
- Trigger order status update when all WO complete
```

### E07: Inventory Management

#### US-09: Manage Consignment Inventory
```
AS A warehouse staff
I WANT TO track consignment inventory separately
SO THAT customer goods are not mixed

Acceptance Criteria:
- Mark inventory with ownership type
- Link to customer for consignment
- Prevent cross-customer usage
- Track separately in reports
```

## 4. Technical Debt

| ID | Description | Priority | Estimated Effort |
|----|-------------|----------|------------------|
| TD-01 | Add unit tests | P1 | 5 days |
| TD-02 | Add integration tests | P1 | 5 days |
| TD-03 | Add API rate limiting | P2 | 2 days |
| TD-04 | Add request validation caching | P3 | 1 day |
| TD-05 | Database query optimization | P2 | 3 days |
| TD-06 | Add Redis for session/cache | P2 | 3 days |
| TD-07 | Docker containerization | P2 | 2 days |
| TD-08 | CI/CD pipeline | P2 | 3 days |

## 5. Future Enhancements

### Phase 2 Features
- [ ] Multi-warehouse support
- [ ] Supplier management
- [ ] Purchase orders
- [ ] Cost tracking
- [ ] Profit calculation

### Phase 3 Features
- [ ] Mobile app for installers
- [ ] Customer portal
- [ ] Real-time notifications
- [ ] Dashboard analytics
- [ ] Integration with accounting software

### Phase 4 Features
- [ ] Multi-tenant support
- [ ] Advanced reporting (BI)
- [ ] Workflow automation
- [ ] Document management
- [ ] API for third-party integration
