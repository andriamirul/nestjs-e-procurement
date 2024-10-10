import { Module } from '@nestjs/common';
import { InfrastructureModule } from './_infrastructure/infrastructure.module';
import { AuthModule } from './auth/auth.module';
import { VendorModule } from './vendor/vendor.module';

@Module({
  imports: [InfrastructureModule, AuthModule, VendorModule],
})
export class AdminModule {}
