import { NestFactory } from '@nestjs/core';
import { InfrastructureService } from './_infrastructure/infrastructure.service';
import { CustomerModule } from './customer.module';

async function bootstrap() {
  const app = await NestFactory.create(CustomerModule, {
    cors: true,
    abortOnError: true,
  });

  app.get(InfrastructureService).app = app;
  await app.listen(3002);
}
bootstrap();
