export class VendorResponse {
  id: number;
  name: string;
  email: string;
  status: string;

  constructor(args: VendorResponse) {
    this.id = args.id;
    this.name = args.name;
    this.email = args.email;
    this.status = args.status;
  }
}
