import { ProductPaginateRequest } from '@libs/clients/vendor/dto/product/product-paginate-request.dto';
import { ProductPaginateResponse } from '@libs/clients/vendor/dto/product/product-paginate-response.dto';
import { ProductResponse } from '@libs/clients/vendor/dto/product/product-response.dto';
import { ProductClientService } from '@libs/clients/vendor/services/product-client.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductService {
  constructor(private readonly productClientService: ProductClientService) {}
  async paginate(
    req: ProductPaginateRequest,
  ): Promise<ProductPaginateResponse> {
    return await this.productClientService.paginate(req);
  }

  async findOne(id: number): Promise<ProductResponse> {
    return await this.productClientService.findOne(id);
  }
}
