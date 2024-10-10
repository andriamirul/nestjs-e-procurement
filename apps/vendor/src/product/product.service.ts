import { ProductPaginateRequest } from '@libs/clients/vendor/dto/product/product-paginate-request.dto';
import { ProductPaginateResponse } from '@libs/clients/vendor/dto/product/product-paginate-response.dto';
import { ProductResponse } from '@libs/clients/vendor/dto/product/product-response.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Vendor } from '@vendor/auth/entities/vendor.entity';
import { isEmpty, isNotEmpty } from 'class-validator';
import { FindManyOptions, ILike } from 'typeorm';
import { CreateProductRequest } from './dto/create-product-request.dto';
import { UpdateProductRequest } from './dto/update-product-request.dto';
import { Product } from './entities/product.entity';
import { ProductRepository } from './repositories/product.repository';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async create(
    req: CreateProductRequest,
    currentUser: Vendor,
  ): Promise<ProductResponse> {
    const product = await this.productRepository.save({
      name: req.name,
      stock: req.stock,
      vendorId: currentUser.id,
    });

    return new ProductResponse({
      id: product.id,
      name: product.name,
      stock: product.stock,
    });
  }

  async paginate(
    req: ProductPaginateRequest,
  ): Promise<ProductPaginateResponse> {
    const skip = (req.page - 1) * req.size;
    const options: FindManyOptions<Product> = {
      skip,
      take: req.size,
      order: {},
    };

    if (isNotEmpty(req.sortBy)) {
      req.sortBy.forEach((sortField, index) => {
        const [relation, field] = sortField.toString().split('.');
        if (field) {
          options.order[relation][field] = req.orderBy[index] ?? 'ASC';
          return;
        }
        options.order[sortField] = req.orderBy[index] ?? 'ASC';
      });
    }

    if (isNotEmpty(req.filter)) {
      options.where = {
        name: ILike(`%${req.filter.toLowerCase()}%`),
      };
    }

    const [data, total] = await this.productRepository.findAndCount(options);
    return new ProductPaginateResponse({
      data: data,
      total: total,
    });
  }

  async findOneOrThrow(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (isEmpty(product)) throw new NotFoundException(`product not found`);
    return product;
  }

  async findOneOrThrowWithVendorId(id: number, vendorId: number) {
    const product = await this.productRepository.findOne({
      where: { id, vendorId },
    });
    if (isEmpty(product)) throw new NotFoundException(`product not found`);
    return product;
  }

  async update(
    id: number,
    req: UpdateProductRequest,
    currentUser: Vendor,
  ): Promise<Product> {
    const product = await this.findOneOrThrowWithVendorId(id, currentUser.id);
    return await this.productRepository.save({
      name: req.name || product.name,
      stock: req.stock || product.stock,
    });
  }

  async remove(id: number): Promise<void> {
    await this.findOneOrThrow(id);
    await this.productRepository.delete(id);
  }
}
