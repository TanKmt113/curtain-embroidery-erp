# Kiến trúc Hệ thống (Architecture)

## 1. Tổng quan Clean Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      PRESENTATION                           │
│    Controllers, Routes, Middlewares, Validators             │
├─────────────────────────────────────────────────────────────┤
│                      APPLICATION                            │
│         Use Cases, DTOs, Interfaces (Ports)                 │
├─────────────────────────────────────────────────────────────┤
│                        DOMAIN                               │
│       Entities, Value Objects, Repository Interfaces        │
├─────────────────────────────────────────────────────────────┤
│                     INFRASTRUCTURE                          │
│    Database, External Services, Repository Implementations  │
├─────────────────────────────────────────────────────────────┤
│                         MAIN                                │
│     Composition Root, DI Container, Server Bootstrap        │
└─────────────────────────────────────────────────────────────┘
```

## 2. Cấu trúc thư mục

```
src/
├── domain/                    # Enterprise Business Rules
│   ├── entities/              # Domain entities
│   ├── value-objects/         # Value objects
│   ├── repositories/          # Repository interfaces
│   └── errors/                # Domain errors
│
├── application/               # Application Business Rules
│   ├── use-cases/             # Use case implementations
│   │   ├── auth/
│   │   ├── customer/
│   │   └── ...
│   ├── dtos/                  # Data Transfer Objects
│   └── interfaces/            # Application interfaces
│
├── infrastructure/            # Frameworks & Drivers
│   ├── database/              # Database connection
│   ├── repositories/          # Repository implementations
│   ├── services/              # External services
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

## 3. Dependency Rule

```
Presentation → Application → Domain
      ↓              ↓
Infrastructure ─────────────→ Domain
      ↓
    Main (composes everything)
```

**Quy tắc quan trọng:**
- Domain layer không phụ thuộc vào bất kỳ layer nào
- Application layer chỉ phụ thuộc vào Domain
- Infrastructure implement interfaces định nghĩa ở Domain/Application
- Presentation gọi Use Cases từ Application
- Main layer là nơi duy nhất biết về tất cả các layers

## 4. Chi tiết các Layers

### 4.1. Domain Layer

**Entities**: Business objects với identity
```typescript
// domain/entities/Customer.ts
export interface Customer {
  id: string;
  code: string;
  name: string;
  type: CustomerType;
  email?: string;
  phone?: string;
  // ...
}
```

**Repository Interfaces**: Contracts cho data access
```typescript
// domain/repositories/ICustomerRepository.ts
export interface ICustomerRepository {
  findById(id: string): Promise<Customer | null>;
  findByCode(code: string): Promise<Customer | null>;
  save(customer: Customer): Promise<Customer>;
  // ...
}
```

### 4.2. Application Layer

**Use Cases**: Application-specific business rules
```typescript
// application/use-cases/customer/CreateCustomer.ts
export class CreateCustomerUseCase {
  constructor(private customerRepo: ICustomerRepository) {}
  
  async execute(dto: CreateCustomerDTO): Promise<Customer> {
    // Business logic
  }
}
```

**DTOs**: Data structures for use case input/output
```typescript
// application/dtos/CustomerDTO.ts
export interface CreateCustomerDTO {
  name: string;
  type: CustomerType;
  email?: string;
  // ...
}
```

### 4.3. Infrastructure Layer

**Repository Implementations**: Actual data access
```typescript
// infrastructure/repositories/PrismaCustomerRepository.ts
export class PrismaCustomerRepository implements ICustomerRepository {
  constructor(private prisma: PrismaClient) {}
  
  async findById(id: string): Promise<Customer | null> {
    return this.prisma.customer.findUnique({ where: { id } });
  }
}
```

**Services**: External integrations
```typescript
// infrastructure/security/JwtService.ts
export class JwtService implements ITokenService {
  generateAccessToken(payload: TokenPayload): string { }
  verifyAccessToken(token: string): TokenPayload { }
}
```

### 4.4. Presentation Layer

**Controllers**: Handle HTTP requests
```typescript
// presentation/controllers/CustomerController.ts
export class CustomerController {
  constructor(private createCustomerUseCase: CreateCustomerUseCase) {}
  
  async create(req: Request, res: Response): Promise<void> {
    const result = await this.createCustomerUseCase.execute(req.body);
    res.status(201).json(result);
  }
}
```

**Middlewares**: Cross-cutting concerns
```typescript
// presentation/middlewares/authMiddleware.ts
export const authMiddleware = (tokenService: ITokenService) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Verify token
  };
};
```

### 4.5. Main Layer

**Composition Root**: Wire everything together
```typescript
// main/factories/customerFactory.ts
export const makeCustomerController = () => {
  const repository = new PrismaCustomerRepository(prisma);
  const useCase = new CreateCustomerUseCase(repository);
  return new CustomerController(useCase);
};
```

## 5. Data Flow

### Request Flow
```
HTTP Request
     ↓
Route → Middleware (Auth, Validation)
     ↓
Controller
     ↓
Use Case
     ↓
Repository Interface
     ↓
Repository Implementation
     ↓
Database
```

### Response Flow
```
Database
     ↓
Repository Implementation
     ↓
Domain Entity
     ↓
Use Case (transform to DTO)
     ↓
Controller (format response)
     ↓
HTTP Response
```

## 6. Error Handling Strategy

### 6.1. Domain Errors
```typescript
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
  }
}

export class EntityNotFoundError extends DomainError { }
export class ValidationError extends DomainError { }
export class BusinessRuleViolationError extends DomainError { }
```

### 6.2. HTTP Error Mapping
| Domain Error | HTTP Status |
|--------------|-------------|
| ValidationError | 400 |
| UnauthorizedError | 401 |
| ForbiddenError | 403 |
| EntityNotFoundError | 404 |
| ConflictError | 409 |
| DomainError | 500 |

## 7. Security Architecture

### 7.1. Authentication Flow
```
Login Request (email, password)
        ↓
Verify credentials
        ↓
Generate Access Token (15min) + Refresh Token (7days)
        ↓
Store Refresh Token Hash in DB
        ↓
Return tokens to client
```

### 7.2. Token Refresh Flow
```
Refresh Request (refresh token)
        ↓
Verify refresh token signature
        ↓
Check hash exists in DB & not revoked
        ↓
Generate new Access Token
        ↓
Return new access token
```

## 8. Logging Strategy

```typescript
// Using Pino logger
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: { colorize: true }
  }
});

// Log levels
logger.fatal() // System is unusable
logger.error() // Error conditions
logger.warn()  // Warning conditions
logger.info()  // Informational messages
logger.debug() // Debug-level messages
logger.trace() // Detailed trace
```

## 9. Configuration Management

```typescript
// main/config/index.ts
export const config = {
  app: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  },
  database: {
    url: process.env.DATABASE_URL,
  }
};
```
