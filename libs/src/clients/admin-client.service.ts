import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ClientName } from './enum/client-name.enum';

@Injectable()
export class VendorClientService {
  constructor(
    @Inject(ClientName.VENDOR) private readonly vendorService: ClientProxy,
  ) {}

  async approve(): Promise<void> {}
}
