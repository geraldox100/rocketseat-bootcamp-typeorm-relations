import { getRepository, Repository, In, getConnection } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }
  
  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const entity = this.ormRepository.create({
      name,
      price,
      quantity,
    });

    await this.ormRepository.save(entity);
    
    return entity;
  }

  public async save(products: Product[]): Promise<void> {
    await this.ormRepository.save(products);
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne({
        where:{ name }
    });
    return product;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    return await this.ormRepository.findByIds(products);
  }

  public async updateQuantity(products: IUpdateProductsQuantityDTO[]): Promise<Product[]> {
    products.forEach( async product =>{
      await getConnection()
            .createQueryBuilder()
            .update(Product)
            .set({ quantity: product.quantity })
            .where("id = :id", { id: product.id })
            .execute();
    });
    const entities = await this.ormRepository.find({
      where:{
        id: In(products.map( p=> p.id))
      }
    });
    return entities;
  }
}

export default ProductsRepository;
