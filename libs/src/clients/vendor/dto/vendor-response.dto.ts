export class VendorResponse {
  name: string;
  email: string;
  status: string;

  constructor(args: VendorResponse) {
    this.name = args.name;
    this.email = args.email;
    this.status = args.status;
  }
}
