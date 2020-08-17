import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';
import Customer from '@modules/customers/infra/typeorm/entities/Customer';
import Product from '@modules/products/infra/typeorm/entities/Product';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository') private ordersRepository: IOrdersRepository,
    @inject('ProductsRepository') private productsRepository: IProductsRepository,
    @inject('CustomersRepository') private customersRepository: ICustomersRepository,
  ) {}

  public verifyCustomer(customer:Customer | undefined, customer_id:string){
    if(!customer){
      throw new AppError(`customer ${customer_id} not found`, 400);
    }
  }

  public verifyProducts(products:IProduct[] | Product[]){
    if(!products || products.length == 0){
      throw new AppError(`Orders should have at least one product`,400);
    }
  }

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    this.verifyCustomer(customer,customer_id);
    this.verifyProducts(products);    

    const realProducts = await this.productsRepository.findAllById(products);

    this.verifyProducts(realProducts);

    const finalProducts = realProducts.map( p =>{
      const quantity = products.find( p1=> p1.id == p.id)?.quantity;

      if(!quantity || quantity > p.quantity){
        throw new AppError(`Invalid quantity`,400);
      }

      p.quantity = p.quantity - quantity;
      return {
        product_id: p.id,
        quantity: quantity || 0,
        price: p.price
      }
    })

    const order = await this.ordersRepository.create({
      customer,
      products:finalProducts
    });

    await this.productsRepository.save(realProducts);

    return order;
  }
}

export default CreateOrderService;
