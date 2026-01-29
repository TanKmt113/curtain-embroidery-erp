# Roles & Permissions

## 1. Tổng quan

Hệ thống sử dụng Role-Based Access Control (RBAC) với 7 roles chính.

## 2. Danh sách Roles

| Role | Code | Mô tả |
|------|------|-------|
| Administrator | ADMIN | Quản trị hệ thống toàn quyền |
| Sales | SALES | Nhân viên kinh doanh |
| Warehouse | WAREHOUSE | Nhân viên kho |
| Production | PRODUCTION | Nhân viên sản xuất |
| Quality Control | QC | Nhân viên kiểm tra chất lượng |
| Installer | INSTALLER | Nhân viên lắp đặt |
| Accountant | ACCOUNTANT | Kế toán |

## 3. Permission Matrix

### 3.1. User Management

| Action | ADMIN | SALES | WAREHOUSE | PRODUCTION | QC | INSTALLER | ACCOUNTANT |
|--------|:-----:|:-----:|:---------:|:----------:|:--:|:---------:|:----------:|
| Create User | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View Users | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Update User | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Delete User | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Change Password | ✅ | 👤 | 👤 | 👤 | 👤 | 👤 | 👤 |

👤 = Own account only

### 3.2. Customer Management

| Action | ADMIN | SALES | WAREHOUSE | PRODUCTION | QC | INSTALLER | ACCOUNTANT |
|--------|:-----:|:-----:|:---------:|:----------:|:--:|:---------:|:----------:|
| Create Customer | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View Customers | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| Update Customer | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Delete Customer | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

### 3.3. Product & Material Management

| Action | ADMIN | SALES | WAREHOUSE | PRODUCTION | QC | INSTALLER | ACCOUNTANT |
|--------|:-----:|:-----:|:---------:|:----------:|:--:|:---------:|:----------:|
| Create Product | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View Products | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Update Product | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage BOM | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Manage Routing | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |

### 3.4. Quotation Management

| Action | ADMIN | SALES | WAREHOUSE | PRODUCTION | QC | INSTALLER | ACCOUNTANT |
|--------|:-----:|:-----:|:---------:|:----------:|:--:|:---------:|:----------:|
| Create Quotation | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View Quotations | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Update Quotation | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Send Quotation | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Approve Quotation | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Convert to Order | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

### 3.5. Order Management

| Action | ADMIN | SALES | WAREHOUSE | PRODUCTION | QC | INSTALLER | ACCOUNTANT |
|--------|:-----:|:-----:|:---------:|:----------:|:--:|:---------:|:----------:|
| Create Order | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View Orders | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Update Order | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Cancel Order | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Confirm Order | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Record Payment | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

### 3.6. Work Order Management

| Action | ADMIN | SALES | WAREHOUSE | PRODUCTION | QC | INSTALLER | ACCOUNTANT |
|--------|:-----:|:-----:|:---------:|:----------:|:--:|:---------:|:----------:|
| Create Work Order | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| View Work Orders | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Assign Worker | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Update Progress | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Complete Step | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |

### 3.7. Inventory Management

| Action | ADMIN | SALES | WAREHOUSE | PRODUCTION | QC | INSTALLER | ACCOUNTANT |
|--------|:-----:|:-----:|:---------:|:----------:|:--:|:---------:|:----------:|
| View Inventory | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Stock In | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Stock Out | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Adjust Stock | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Reserve Stock | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| View Consignment | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |

### 3.8. QC Management

| Action | ADMIN | SALES | WAREHOUSE | PRODUCTION | QC | INSTALLER | ACCOUNTANT |
|--------|:-----:|:-----:|:---------:|:----------:|:--:|:---------:|:----------:|
| Create QC Record | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| View QC Records | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ |
| Pass/Fail QC | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Request Rework | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |

### 3.9. Delivery & Installation

| Action | ADMIN | SALES | WAREHOUSE | PRODUCTION | QC | INSTALLER | ACCOUNTANT |
|--------|:-----:|:-----:|:---------:|:----------:|:--:|:---------:|:----------:|
| Schedule Delivery | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| View Deliveries | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| Complete Delivery | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ |
| Schedule Installation | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Complete Installation | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |

### 3.10. Reports

| Action | ADMIN | SALES | WAREHOUSE | PRODUCTION | QC | INSTALLER | ACCOUNTANT |
|--------|:-----:|:-----:|:---------:|:----------:|:--:|:---------:|:----------:|
| Sales Reports | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Inventory Reports | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Production Reports | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| QC Reports | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |
| Financial Reports | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

## 4. Implementation

### 4.1. Middleware Check
```typescript
const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      throw new ForbiddenError('Insufficient permissions');
    }
    next();
  };
};

// Usage
router.post('/customers', 
  authenticate, 
  authorize('ADMIN', 'SALES'), 
  customerController.create
);
```

### 4.2. Permission Constants
```typescript
export const PERMISSIONS = {
  CUSTOMER_CREATE: ['ADMIN', 'SALES'],
  CUSTOMER_READ: ['ADMIN', 'SALES', 'WAREHOUSE', 'INSTALLER', 'ACCOUNTANT'],
  CUSTOMER_UPDATE: ['ADMIN', 'SALES'],
  CUSTOMER_DELETE: ['ADMIN'],
  
  ORDER_CREATE: ['ADMIN', 'SALES'],
  ORDER_READ: ['ADMIN', 'SALES', 'WAREHOUSE', 'PRODUCTION', 'QC', 'INSTALLER', 'ACCOUNTANT'],
  // ...
};
```

## 5. Best Practices

1. **Principle of Least Privilege**: Cấp quyền tối thiểu cần thiết
2. **Separation of Duties**: Phân tách nhiệm vụ (VD: Production tạo WO, QC kiểm tra)
3. **Audit Trail**: Ghi log mọi thao tác quan trọng
4. **Regular Review**: Định kỳ rà soát quyền truy cập
