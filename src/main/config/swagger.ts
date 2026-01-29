import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './index';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Curtain & Embroidery ERP API',
      version: '1.0.0',
      description: `
## Hệ thống ERP Quản lý Rèm & Gia công Thêu/Đệm

API Documentation cho hệ thống ERP quản lý:
- **Rèm trọn gói**: Tư vấn, đo đạc, sản xuất, lắp đặt rèm cửa
- **Gia công thêu/đệm**: Nhận gia công thêu, may đệm theo đơn hàng hoặc theo lô

### Tính năng chính
- 🔐 Authentication với JWT (Access Token + Refresh Token)
- 👥 Quản lý khách hàng (cá nhân, công ty, ký gửi)
- 📦 Đơn hàng đa hạng mục
- 🏭 Quản lý sản xuất theo công đoạn
- 📊 Quản lý kho (Công ty vs Ký gửi)

### Roles
- **ADMIN**: Quản trị hệ thống toàn quyền
- **SALES**: Nhân viên kinh doanh
- **WAREHOUSE**: Nhân viên kho
- **PRODUCTION**: Nhân viên sản xuất
- **QC**: Nhân viên kiểm tra chất lượng
- **INSTALLER**: Nhân viên lắp đặt
- **ACCOUNTANT**: Kế toán
      `,
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.app.port}/api/v1`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token',
        },
      },
      schemas: {
        // Error Response
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: {
              type: 'object',
              properties: {
                code: { type: 'string', example: 'VALIDATION_ERROR' },
                message: { type: 'string', example: 'Validation failed' },
                details: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      field: { type: 'string' },
                      message: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
        // Auth
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'admin@example.com' },
            password: { type: 'string', example: 'admin123' },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                accessToken: { type: 'string' },
                refreshToken: { type: 'string' },
                user: { $ref: '#/components/schemas/User' },
              },
            },
          },
        },
        RefreshTokenRequest: {
          type: 'object',
          required: ['refreshToken'],
          properties: {
            refreshToken: { type: 'string' },
          },
        },
        RefreshTokenResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                accessToken: { type: 'string' },
              },
            },
          },
        },
        // User
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            fullName: { type: 'string' },
            phone: { type: 'string', nullable: true },
            role: { $ref: '#/components/schemas/UserRole' },
            status: { $ref: '#/components/schemas/UserStatus' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        UserRole: {
          type: 'string',
          enum: ['ADMIN', 'SALES', 'WAREHOUSE', 'PRODUCTION', 'QC', 'INSTALLER', 'ACCOUNTANT'],
        },
        UserStatus: {
          type: 'string',
          enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
        },
        // Customer
        Customer: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            code: { type: 'string', example: 'CUS-0001' },
            name: { type: 'string', example: 'Công ty ABC' },
            type: { $ref: '#/components/schemas/CustomerType' },
            email: { type: 'string', format: 'email', nullable: true },
            phone: { type: 'string', nullable: true },
            address: { type: 'string', nullable: true },
            taxCode: { type: 'string', nullable: true },
            contactPerson: { type: 'string', nullable: true },
            notes: { type: 'string', nullable: true },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CustomerType: {
          type: 'string',
          enum: ['INDIVIDUAL', 'COMPANY', 'CONSIGNMENT'],
          description: 'INDIVIDUAL: Cá nhân, COMPANY: Công ty, CONSIGNMENT: Khách ký gửi',
        },
        CreateCustomerRequest: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', example: 'Công ty ABC' },
            type: { $ref: '#/components/schemas/CustomerType' },
            email: { type: 'string', format: 'email', example: 'contact@abc.com' },
            phone: { type: 'string', example: '0901234567' },
            address: { type: 'string', example: '123 Nguyễn Huệ, Q1, HCM' },
            taxCode: { type: 'string', example: '0123456789' },
            contactPerson: { type: 'string', example: 'Nguyễn Văn A' },
            notes: { type: 'string' },
          },
        },
        UpdateCustomerRequest: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            type: { $ref: '#/components/schemas/CustomerType' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            address: { type: 'string' },
            taxCode: { type: 'string' },
            contactPerson: { type: 'string' },
            notes: { type: 'string' },
            isActive: { type: 'boolean' },
          },
        },
        CustomerResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { $ref: '#/components/schemas/Customer' },
          },
        },
        CustomerListResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/Customer' },
            },
            meta: {
              type: 'object',
              properties: {
                page: { type: 'integer', example: 1 },
                pageSize: { type: 'integer', example: 20 },
                total: { type: 'integer', example: 100 },
                totalPages: { type: 'integer', example: 5 },
              },
            },
          },
        },
        // Pagination
        PaginationMeta: {
          type: 'object',
          properties: {
            page: { type: 'integer' },
            pageSize: { type: 'integer' },
            total: { type: 'integer' },
            totalPages: { type: 'integer' },
          },
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Customers', description: 'Customer management endpoints' },
    ],
  },
  apis: ['./src/presentation/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
