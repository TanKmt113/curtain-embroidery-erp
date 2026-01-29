import { Request, Response, NextFunction } from 'express';
import {
  ListWorkOrdersUseCase,
  GetWorkOrderUseCase,
  CreateWorkOrderUseCase,
  UpdateWorkOrderStatusUseCase,
  CompleteWorkOrderUseCase,
} from '../../application/use-cases/work-order';

export class WorkOrderController {
  constructor(
    private listWorkOrdersUseCase: ListWorkOrdersUseCase,
    private getWorkOrderUseCase: GetWorkOrderUseCase,
    private createWorkOrderUseCase: CreateWorkOrderUseCase,
    private updateWorkOrderStatusUseCase: UpdateWorkOrderStatusUseCase,
    private completeWorkOrderUseCase: CompleteWorkOrderUseCase
  ) {}

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.listWorkOrdersUseCase.execute({
        orderId: req.query.orderId as string,
        status: req.query.status as any,
        assigneeId: req.query.assigneeId as string,
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
      const result = await this.getWorkOrderUseCase.execute(req.params.id);

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
      const result = await this.createWorkOrderUseCase.execute(req.body);

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
      const result = await this.updateWorkOrderStatusUseCase.execute(req.params.id, req.body);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  complete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.completeWorkOrderUseCase.execute(req.params.id, req.body);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
