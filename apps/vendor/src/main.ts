import { NestFactory } from '@nestjs/core';
import { VendorModule } from './vendor.module';

async function bootstrap() {
  const app = await NestFactory.create(VendorModule);
  await app.listen(3001);
}
bootstrap();
