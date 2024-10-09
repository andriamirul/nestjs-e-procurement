import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { VendorModule } from './vendor/vendor.module';

@Module({
  imports: [AuthModule, VendorModule],
})
export class AdminModule {}
