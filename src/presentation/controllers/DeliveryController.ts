import { Request, Response, NextFunction } from 'express';
import {
  ListDeliveriesUseCase,
  GetDeliveryUseCase,
  CreateDeliveryUseCase,
  UpdateDeliveryStatusUseCase,
} from '../../application/use-cases/delivery';

export class DeliveryController {
  constructor(
    private listDeliveriesUseCase: ListDeliveriesUseCase,
    private getDeliveryUseCase: GetDeliveryUseCase,
    private createDeliveryUseCase: CreateDeliveryUseCase,
    private updateDeliveryStatusUseCase: UpdateDeliveryStatusUseCase
  ) {}

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.listDeliveriesUseCase.execute({
        orderId: req.query.orderId as string,
        type: req.query.type as any,
        status: req.query.status as any,
        fromDate: req.query.fromDate as string,
        toDate: req.query.toDate as string,
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
      const result = await this.getDeliveryUseCase.execute(req.params.id);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.sub;
      const result = await this.createDeliveryUseCase.execute(req.body, userId);

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.updateDeliveryStatusUseCase.execute(req.params.id, req.body);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
