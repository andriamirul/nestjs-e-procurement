import { ClientName } from '@libs/clients/enum/client-name.enum';
import { ProductMessagePattern } from '@libs/clients/enum/product-message-pattern.enum';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ProductPaginateRequest } from '../dto/product/product-paginate-request.dto';
import { ProductPaginateResponse } from '../dto/product/product-paginate-response.dto';
import { ProductResponse } from '../dto/product/product-response.dto';

@Injectable()
export class ProductClientService {
  constructor(
    @Inject(ClientName.VENDOR) private readonly vendorService: ClientProxy,
  ) {}

  async paginate(
    req: ProductPaginateRequest,
  ): Promise<ProductPaginateResponse> {
    return await lastValueFrom(
      this.vendorService.send<ProductPaginateResponse>(
        ProductMessagePattern.productPaginate,
        req,
      ),
    );
  }

  async findOne(id: number): Promise<ProductResponse> {
    return await lastValueFrom(
      this.vendorService.send<ProductResponse>(
        ProductMessagePattern.productFindOne,
        id,
      ),
    );
  }
}
