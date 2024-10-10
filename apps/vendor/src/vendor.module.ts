import { Module } from '@nestjs/common';
import { InfrastructureModule } from './_infrastructure/infrastructure.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [InfrastructureModule, AuthModule, ProductModule],
})
export class VendorModule {}
