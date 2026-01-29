import { Request, Response } from 'express';
import {
  CreateCustomerUseCase,
  ListCustomersUseCase,
  GetCustomerUseCase,
  UpdateCustomerUseCase,
} from '../../application/use-cases/customer';
import { CreateCustomerDTO, UpdateCustomerDTO, ListCustomersDTO } from '../../application/dtos';
import { CustomerType } from '../../domain/entities';

export class CustomerController {
  constructor(
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly listCustomersUseCase: ListCustomersUseCase,
    private readonly getCustomerUseCase: GetCustomerUseCase,
    private readonly updateCustomerUseCase: UpdateCustomerUseCase
  ) {}

  create = async (req: Request, res: Response): Promise<void> => {
    const dto: CreateCustomerDTO = {
      name: req.body.name,
      type: req.body.type,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      taxCode: req.body.taxCode,
      contactPerson: req.body.contactPerson,
      notes: req.body.notes,
    };

    const customer = await this.createCustomerUseCase.execute(dto);

    res.status(201).json({
      success: true,
      data: customer,
    });
  };

  list = async (req: Request, res: Response): Promise<void> => {
    const dto: ListCustomersDTO = {
      page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
      pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : undefined,
      search: req.query.search as string | undefined,
      type: req.query.type as CustomerType | undefined,
      isActive:
        req.query.isActive !== undefined ? req.query.isActive === 'true' : undefined,
    };

    const result = await this.listCustomersUseCase.execute(dto);

    res.status(200).json({
      success: true,
      data: result.data,
      meta: {
        page: result.page,
        pageSize: result.pageSize,
        total: result.total,
        totalPages: result.totalPages,
      },
    });
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const customer = await this.getCustomerUseCase.execute(id);

    res.status(200).json({
      success: true,
      data: customer,
    });
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const dto: UpdateCustomerDTO = {
      name: req.body.name,
      type: req.body.type,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      taxCode: req.body.taxCode,
      contactPerson: req.body.contactPerson,
      notes: req.body.notes,
      isActive: req.body.isActive,
    };

    const customer = await this.updateCustomerUseCase.execute(id, dto);

    res.status(200).json({
      success: true,
      data: customer,
    });
  };
}
