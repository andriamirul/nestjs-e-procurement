import { ClientName } from '@libs/clients/enum/client-name.enum';
import { ProductClientService } from '@libs/clients/vendor/services/product-client.service';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Config } from '../config/config.schema';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: ClientName.VENDOR,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.getOrThrow<Config['service']>('service').vendor
              .host,
            port: Number(
              configService.getOrThrow<Config['service']>('service').vendor
                .port,
            ),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [ProductClientService],
  exports: [ProductClientService],
})
export class VendorClientModule {}
