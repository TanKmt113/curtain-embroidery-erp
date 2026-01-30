import { Router } from 'express';
import { createAuthRouter } from './authRoutes';
import { createCustomerRouter } from './customerRoutes';
import { createUserRoutes } from './userRoutes';
import { createRoleRoutes } from './roleRoutes';
import { createProductRoutes } from './productRoutes';
import { createQuotationRoutes } from './quotationRoutes';
import { createOrderRoutes } from './orderRoutes';
import { createWorkOrderRoutes } from './workOrderRoutes';
import { createInventoryRoutes } from './inventoryRoutes';
import { createQCRecordRoutes } from './qcRecordRoutes';
import { createDeliveryRoutes } from './deliveryRoutes';
import { createUploadRoutes } from './uploadRoutes';
import { 
  AuthController, 
  CustomerController,
  UserController,
  RoleController,
  ProductController,
  QuotationController,
  OrderController,
  WorkOrderController,
  InventoryController,
  QCRecordController,
  DeliveryController,
  UploadController
} from '../controllers';
import { ITokenService } from '../../application/interfaces';

export interface ApiRouterControllers {
  authController: AuthController;
  customerController: CustomerController;
  userController: UserController;
  roleController: RoleController;
  productController: ProductController;
  quotationController: QuotationController;
  orderController: OrderController;
  workOrderController: WorkOrderController;
  inventoryController: InventoryController;
  qcRecordController: QCRecordController;
  deliveryController: DeliveryController;
  uploadController: UploadController;
}

export function createApiRouter(
  controllers: ApiRouterControllers,
  tokenService: ITokenService
): Router {
  const router = Router();

  // Auth routes (public)
  router.use('/auth', createAuthRouter(controllers.authController, tokenService));
  
  // User routes
  router.use('/users', createUserRoutes(controllers.userController, tokenService));
  
  // Role routes
  router.use('/roles', createRoleRoutes(controllers.roleController, tokenService));
  
  // Customer routes
  router.use('/customers', createCustomerRouter(controllers.customerController, tokenService));
  
  // Product routes
  router.use('/products', createProductRoutes(controllers.productController, tokenService));
  
  // Quotation routes
  router.use('/quotations', createQuotationRoutes(controllers.quotationController, tokenService));
  
  // Order routes
  router.use('/orders', createOrderRoutes(controllers.orderController, tokenService));
  
  // Work Order routes
  router.use('/work-orders', createWorkOrderRoutes(controllers.workOrderController, tokenService));
  
  // Inventory routes
  router.use('/inventory', createInventoryRoutes(controllers.inventoryController, tokenService));
  
  // QC Record routes
  router.use('/qc-records', createQCRecordRoutes(controllers.qcRecordController, tokenService));
  
  // Delivery routes
  router.use('/deliveries', createDeliveryRoutes(controllers.deliveryController, tokenService));

  // Upload routes
  router.use('/upload', createUploadRoutes(controllers.uploadController, tokenService));

  // Health check endpoint
  router.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  return router;
}

export { createAuthRouter } from './authRoutes';
export { createCustomerRouter } from './customerRoutes';
export { createUserRoutes } from './userRoutes';
export { createRoleRoutes } from './roleRoutes';
export { createProductRoutes } from './productRoutes';
export { createQuotationRoutes } from './quotationRoutes';
export { createOrderRoutes } from './orderRoutes';
export { createWorkOrderRoutes } from './workOrderRoutes';
export { createInventoryRoutes } from './inventoryRoutes';
export { createQCRecordRoutes } from './qcRecordRoutes';
export { createDeliveryRoutes } from './deliveryRoutes';
export { createUploadRoutes } from './uploadRoutes';
