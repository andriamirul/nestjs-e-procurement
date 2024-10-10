import { ProductMessagePattern } from '@libs/clients/enum/product-message-pattern.enum';
import { ProductPaginateRequest } from '@libs/clients/vendor/dto/product/product-paginate-request.dto';
import { ProductPaginateResponse } from '@libs/clients/vendor/dto/product/product-paginate-response.dto';
import { ProductResponse } from '@libs/clients/vendor/dto/product/product-response.dto';
import {
  ClassSerializerInterceptor,
  Controller,
  UseInterceptors,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ProductService } from './product.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class ProductClientController {
  constructor(private readonly productService: ProductService) {}
  @MessagePattern(ProductMessagePattern.productPaginate)
  async paginate(
    req: ProductPaginateRequest,
  ): Promise<ProductPaginateResponse> {
    return await this.productService.paginate(req);
  }

  @MessagePattern(ProductMessagePattern.productFindOne)
  async findOne(id: number): Promise<ProductResponse> {
    return new ProductResponse(await this.productService.findOneOrThrow(id));
  }
}
