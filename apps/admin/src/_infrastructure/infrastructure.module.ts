import {
  INestApplication,
  Module,
  OnModuleInit,
  ValidationPipe,
} from '@nestjs/common';

import { AdminModule } from '@admin/admin.module';
import { RpcExceptionFilter, validationPipeOptions } from '@libs';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { useContainer } from 'class-validator';
import { ConfigModule } from './config/config.module';
import { Config } from './config/config.schema';
import { DatabaseModule } from './database/database.module';
import { generateMermaidFile } from './dependencies-graph/generate';
import { InfrastructureService } from './infrastructure.service';
import { buildSwagger } from './swagger/swagger';

@Module({
  imports: [ConfigModule, DatabaseModule],
  providers: [InfrastructureService],
  exports: [InfrastructureService],
})
export class InfrastructureModule implements OnModuleInit {
  app: INestApplication;

  constructor(
    private configService: ConfigService<Config>,
    private service: InfrastructureService,
  ) {}

  async onModuleInit() {
    this.app = this.service.app;

    const jobs: Promise<any>[] = [];
    console.info(`Infrastructure Installing`);

    // SWAGGER
    console.log('building swagger');
    jobs.push(
      buildSwagger(this.app).then(() => {
        console.log('swagger has been built');
      }),
    );

    // DEPENDENCIES GRAPH
    console.log('building dependencies graph');
    jobs.push(
      generateMermaidFile(this.app).then(() => {
        console.log('dependencies graph has been built');
      }),
    );

    // VALIDATOR CONTAINER
    console.log('using container for validation');
    useContainer(this.app.select(AdminModule), {
      fallbackOnErrors: true,
    });
    console.log('used container for validation');

    // VALIDATION PIPELINE
    console.log('add global validation pipeline');
    this.app.useGlobalPipes(new ValidationPipe(validationPipeOptions));
    console.log('added global validation pipeline');

    // ADDING FILTER
    console.log('add global exception filter');
    const { httpAdapter } = this.app.get(HttpAdapterHost);
    this.app.useGlobalFilters(new RpcExceptionFilter(httpAdapter));
    console.log('added global exception filter');

    // CREATE MICROSERVICE
    const service = this.configService.getOrThrow<Config['service']>('service');
    console.log(
      `building microservice in  ${service.admin.host}:${service.admin.port}`,
    );
    this.app.connectMicroservice<MicroserviceOptions>(
      {
        transport: Transport.TCP,
        options: {
          host: service.admin.host,
          port: Number(service.admin.port),
        },
      },
      {
        inheritAppConfig: true,
      },
    );

    jobs.push(
      this.app
        .startAllMicroservices()
        .then(() => console.log('microservice added')),
    );

    await Promise.all(jobs).catch((error: Error) => {
      console.error(error.message);
    });

    console.info('Infrastructure Installed');
  }
}
