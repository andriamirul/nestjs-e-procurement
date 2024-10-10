import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Config } from '../config/config.schema';
import { DatabaseLogger } from './database.logger';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      /**
       * Depedencies
       */
      inject: [ConfigService],

      /**
       * Config Factory
       *
       */
      useFactory: (
        configService: ConfigService<Config>,
      ): TypeOrmModuleOptions => {
        const logger = new Logger(DatabaseModule.name);
        const config = configService.getOrThrow<Config['mysql']>('mysql');

        const { pass, ...rest } = config;

        logger.log(
          `MySQL database connection information ${JSON.stringify(rest)}`,
        );

        return {
          type: 'mysql',
          host: config.host,
          port: config.port,
          username: config.user,
          password: config.pass,
          database: config.dbname,
          logging: true,
          logger: DatabaseLogger.forConnection(logger, true),
          entities: [`${__dirname}/../../**/*.entity.{js,ts}`],
          autoLoadEntities: true,
          namingStrategy: new SnakeNamingStrategy(),
          migrations: [`${__dirname}/migrations/**/*.{js,ts}`],
          migrationsRun: true,
        };
      },

      /**
       * Build from real datasource
       *
       */
      async dataSourceFactory(options) {
        const datasource = new DataSource(options);

        return datasource;
      },
    }),
  ],
})
export class DatabaseModule {}
