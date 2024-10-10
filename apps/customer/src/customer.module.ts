import { Module } from '@nestjs/common';
import { InfrastructureModule } from './_infrastructure/infrastructure.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [InfrastructureModule, ProductModule],
})
export class CustomerModule {}
