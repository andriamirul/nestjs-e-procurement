import { VendorClientModule } from '@admin/_infrastructure/clients/vendor-client.module';
import { Module } from '@nestjs/common';
import { VendorController } from './vendor.controller';
import { VendorService } from './vendor.service';

@Module({
  imports: [VendorClientModule],
  controllers: [VendorController],
  providers: [VendorService],
})
export class VendorModule {}
