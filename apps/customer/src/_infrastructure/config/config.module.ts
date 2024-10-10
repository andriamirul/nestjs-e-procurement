import { Logger, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { config } from './config.schema';
import { ConfigValidation } from './config.validation';

@Module({
  imports: [
    NestConfigModule.forRoot({
      load: [config],
      envFilePath: 'apps/admin/.env',
      isGlobal: true,
      async validate(config) {
        const logger = new Logger(ConfigModule.name);
        const schema = plainToInstance(ConfigValidation, config);
        process.env = { ...process.env, ...config };

        await validate(schema).then((errors) => {
          if (errors.length > 0) {
            logger.fatal(
              'config is not meet expected, maybe some part not work as expected',
              errors,
            );
          } else {
            logger.log(`config has been validated`);
          }
        });

        return config;
      },
    }),
  ],
})
export class ConfigModule {}
