import { VendorClientModule } from '@customer/_infrastructure/clients/vendor-client.module';
import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [VendorClientModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
