import { BadRequestError } from '@libs/common/exceptions/bad-request';
import { HttpException } from '@libs/common/exceptions/http-exception';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { Config } from '../config/config.schema';

export async function buildSwagger(app: INestApplication) {
  const config = app.get(ConfigService<Config>);
  const serviceConfig = config.getOrThrow<Config['service']>('service');

  const title = serviceConfig.name;

  const swaggerDoc = new DocumentBuilder()
    .setTitle(title)
    .setVersion(serviceConfig.version)
    .setContact('Our Best', undefined, serviceConfig.maintainer)
    .addBearerAuth()
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerName: string, methodName: string) =>
      methodName,
    extraModels: [HttpException, BadRequestError],
  };

  const document = SwaggerModule.createDocument(app, swaggerDoc, options);

  SwaggerModule.setup('docs', app, document, {
    customCss: '.topbar { display: none !important; }',
    customSiteTitle: title,
    swaggerOptions: {
      docExpansion: 'none',
    },
    customfavIcon: '-',
  });
}
