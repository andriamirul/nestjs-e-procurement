import { NestFactory } from '@nestjs/core';
import { InfrastructureService } from './_infrastructure/infrastructure.service';
import { VendorModule } from './vendor.module';

async function bootstrap() {
  const app = await NestFactory.create(VendorModule, {
    cors: true,
    abortOnError: true,
  });

  app.get(InfrastructureService).app = app;
  await app.listen(3001);
}
bootstrap();
