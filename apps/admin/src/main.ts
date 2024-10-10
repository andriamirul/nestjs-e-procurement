import { NestFactory } from '@nestjs/core';
import { InfrastructureService } from './_infrastructure/infrastructure.service';
import { AdminModule } from './admin.module';

async function bootstrap() {
  const app = await NestFactory.create(AdminModule, {
    cors: true,
    abortOnError: true,
  });

  app.get(InfrastructureService).app = app;
  await app.listen(3000);
}
bootstrap();
