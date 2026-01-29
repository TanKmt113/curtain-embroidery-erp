# API Specification

## 1. Tổng quan

- **Base URL**: `/api/v1`
- **Content-Type**: `application/json`
- **Authentication**: Bearer Token (JWT)

## 2. Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  }
}
```

## 3. Authentication APIs

### 3.1. Login
```
POST /api/v1/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "fullName": "Nguyen Van A",
      "role": "SALES"
    }
  }
}
```

**Errors:**
- 400: Invalid request body
- 401: Invalid credentials

### 3.2. Refresh Token
```
POST /api/v1/auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Errors:**
- 400: Invalid request body
- 401: Invalid or expired refresh token

### 3.3. Logout
```
POST /api/v1/auth/logout
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

## 4. Customer APIs

### 4.1. Create Customer
```
POST /api/v1/customers
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "name": "Công ty ABC",
  "type": "COMPANY",
  "email": "contact@abc.com",
  "phone": "0901234567",
  "address": "123 Nguyễn Huệ, Q1, HCM",
  "taxCode": "0123456789",
  "contactPerson": "Nguyễn Văn A",
  "notes": "Khách hàng VIP"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "code": "CUS-0001",
    "name": "Công ty ABC",
    "type": "COMPANY",
    "email": "contact@abc.com",
    "phone": "0901234567",
    "address": "123 Nguyễn Huệ, Q1, HCM",
    "taxCode": "0123456789",
    "contactPerson": "Nguyễn Văn A",
    "notes": "Khách hàng VIP",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Errors:**
- 400: Validation error
- 401: Unauthorized
- 409: Customer with email already exists

### 4.2. List Customers
```
GET /api/v1/customers?page=1&pageSize=20&search=abc&type=COMPANY
Authorization: Bearer <access_token>
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| page | number | Page number (default: 1) |
| pageSize | number | Items per page (default: 20, max: 100) |
| search | string | Search by name, code, email, phone |
| type | string | Filter by type (INDIVIDUAL, COMPANY, CONSIGNMENT) |
| isActive | boolean | Filter by active status |

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "code": "CUS-0001",
      "name": "Công ty ABC",
      "type": "COMPANY",
      "email": "contact@abc.com",
      "phone": "0901234567",
      "isActive": true
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

### 4.3. Get Customer by ID
```
GET /api/v1/customers/:id
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "code": "CUS-0001",
    "name": "Công ty ABC",
    "type": "COMPANY",
    "email": "contact@abc.com",
    "phone": "0901234567",
    "address": "123 Nguyễn Huệ, Q1, HCM",
    "taxCode": "0123456789",
    "contactPerson": "Nguyễn Văn A",
    "notes": "Khách hàng VIP",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Errors:**
- 401: Unauthorized
- 404: Customer not found

### 4.4. Update Customer
```
PUT /api/v1/customers/:id
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "name": "Công ty ABC Updated",
  "phone": "0909876543",
  "address": "456 Lê Lợi, Q1, HCM"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "code": "CUS-0001",
    "name": "Công ty ABC Updated",
    ...
  }
}
```

**Errors:**
- 400: Validation error
- 401: Unauthorized
- 404: Customer not found

## 5. Quotation APIs

### 5.1. Create Quotation
```
POST /api/v1/quotations
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "customerId": "customer-uuid",
  "validUntil": "2024-02-15",
  "notes": "Báo giá rèm phòng khách",
  "items": [
    {
      "itemType": "CURTAIN_WINDOW",
      "productId": "product-uuid",
      "windowName": "Cửa sổ phòng khách",
      "width": 200,
      "height": 250,
      "quantity": 1,
      "unitPrice": 1500000
    },
    {
      "itemType": "PROCESSING_BATCH",
      "productId": "product-uuid",
      "batchCode": "BATCH-001",
      "batchQuantity": 100,
      "quantity": 100,
      "unitPrice": 50000
    }
  ]
}
```

### 5.2. Approve Quotation
```
POST /api/v1/quotations/:id/approve
Authorization: Bearer <access_token>
```

### 5.3. Convert to Order
```
POST /api/v1/quotations/:id/convert-to-order
Authorization: Bearer <access_token>
```

## 6. Order APIs

### 6.1. Create Order
```
POST /api/v1/orders
Authorization: Bearer <access_token>
```

### 6.2. Update Order Status
```
PATCH /api/v1/orders/:id/status
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "status": "IN_PRODUCTION"
}
```

## 7. Work Order APIs

### 7.1. Create Work Order
```
POST /api/v1/work-orders
Authorization: Bearer <access_token>
```

### 7.2. Update Step Status
```
PATCH /api/v1/work-orders/:id/steps/:stepNumber
Authorization: Bearer <access_token>
```

## 8. Inventory APIs

### 8.1. List Inventory
```
GET /api/v1/inventory?warehouse=MAIN&ownership=COMPANY
Authorization: Bearer <access_token>
```

### 8.2. Stock In
```
POST /api/v1/inventory/stock-in
Authorization: Bearer <access_token>
```

### 8.3. Stock Out
```
POST /api/v1/inventory/stock-out
Authorization: Bearer <access_token>
```

## 9. Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| VALIDATION_ERROR | 400 | Invalid request data |
| UNAUTHORIZED | 401 | Missing or invalid token |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Resource already exists |
| INTERNAL_ERROR | 500 | Internal server error |

## 10. Rate Limiting

- Login API: 5 requests per minute per IP
- Other APIs: 100 requests per minute per user
