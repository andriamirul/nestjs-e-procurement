import { IdParamDto } from '@libs';
import { ProductPaginateRequest } from '@libs/clients/vendor/dto/product/product-paginate-request.dto';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  paginate(@Query() req: ProductPaginateRequest) {
    return this.productService.paginate(req);
  }

  @Get(':id')
  findOne(@Param() req: IdParamDto) {
    return this.productService.findOne(req.id);
  }
}
