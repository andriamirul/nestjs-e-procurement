import { PaginateResponseDto } from '@libs/common/dto/pagination/paginate-response.dto';
import { ProductResponse } from './product-response.dto';

export class ProductPaginateResponse extends PaginateResponseDto<ProductResponse> {
  data: ProductResponse[];

  constructor(args: ProductPaginateResponse) {
    super(args);
    this.data = args.data;
  }
}
