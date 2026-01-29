import { Request, Response, NextFunction } from 'express';
import {
  ListInventoryUseCase,
  GetInventoryUseCase,
  ReceiveStockUseCase,
  AdjustStockUseCase,
} from '../../application/use-cases/inventory';

export class InventoryController {
  constructor(
    private listInventoryUseCase: ListInventoryUseCase,
    private getInventoryUseCase: GetInventoryUseCase,
    private receiveStockUseCase: ReceiveStockUseCase,
    private adjustStockUseCase: AdjustStockUseCase
  ) {}

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.listInventoryUseCase.execute({
        productId: req.query.productId as string,
        materialId: req.query.materialId as string,
        ownership: req.query.ownership as any,
        warehouse: req.query.warehouse as string,
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : undefined,
      });

      res.json({
        success: true,
        data: result.data,
        pagination: {
          total: result.total,
          page: result.page,
          pageSize: result.pageSize,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.getInventoryUseCase.execute(req.params.id);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  receive = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.receiveStockUseCase.execute(req.body);

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  adjust = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.adjustStockUseCase.execute(req.body);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
