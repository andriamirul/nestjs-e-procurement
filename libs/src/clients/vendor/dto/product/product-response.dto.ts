import { VendorResponse } from '../vendor/vendor-response.dto';

export class ProductResponse {
  id: number;
  vendor: VendorResponse;
  name: string;
  stock: number;

  constructor(args: ProductResponse) {
    this.id = args.id;
    this.vendor = new VendorResponse(args.vendor);
    this.name = args.name;
    this.stock = args.stock;
  }
}
