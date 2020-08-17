import { Request, Response } from 'express';

import CreateCustomerService from '@modules/customers/services/CreateCustomerService';

import { container } from 'tsyringe';

export default class CustomersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email } = request.body;
    const service = container.resolve(CreateCustomerService);
    const custumer = await service.execute( {name, email});
    return response.status(200).json(custumer);
  }
}
