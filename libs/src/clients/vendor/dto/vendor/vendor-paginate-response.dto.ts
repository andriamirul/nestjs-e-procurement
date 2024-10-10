import { PaginateResponseDto } from '@libs/common/dto/pagination/paginate-response.dto';
import { VendorResponse } from './vendor-response.dto';

export class VendorPaginateResponse extends PaginateResponseDto<VendorResponse> {
  data: VendorResponse[];

  constructor(args: VendorPaginateResponse) {
    super(args);
    this.data = args.data;
  }
}
