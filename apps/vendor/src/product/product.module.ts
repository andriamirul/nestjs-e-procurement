import { Module } from '@nestjs/common';
import { ProductClientController } from './product-client.controller';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepository } from './repositories/product.repository';

@Module({
  controllers: [ProductController, ProductClientController],
  providers: [ProductService, ProductRepository],
  exports: [ProductService],
})
export class ProductModule {}
