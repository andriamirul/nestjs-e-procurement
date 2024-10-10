import { Logger } from '@nestjs/common';
import { QueryRunner, Logger as TypeOrmLogger } from 'typeorm';
import { LoggerOptions as TypeOrmLoggerOptions } from 'typeorm/logger/LoggerOptions';

export class DatabaseLogger implements TypeOrmLogger {
  static forConnection(logger: Logger, options: TypeOrmLoggerOptions) {
    return new DatabaseLogger(logger, options);
  }

  constructor(
    private readonly logger: Logger,
    private readonly options: TypeOrmLoggerOptions,
  ) {}

  /**
   * Logs query and parameters used in it.
   */
  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    if (
      this.options === 'all' ||
      this.options === true ||
      (this.options instanceof Array && this.options.indexOf('query') !== -1)
    ) {
      const sql =
        query +
        (parameters?.length
          ? ' -- PARAMETERS: ' + this.stringifyParams(parameters)
          : '');
      this.logger.log('query' + ': ' + sql);
    }
  }

  /**
   * Logs query that is failed.
   */
  logQueryError(
    error: string,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    if (
      this.options === 'all' ||
      this.options === true ||
      (this.options instanceof Array && this.options.indexOf('error') !== -1)
    ) {
      const sql =
        query +
        (parameters?.length
          ? ' -- PARAMETERS: ' + this.stringifyParams(parameters)
          : '');
      this.logger.log(`query failed: ` + sql);
      this.logger.log(`error:`, error);
    }
  }

  /**
   * Logs query that is slow.
   */
  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    const sql =
      query +
      (parameters?.length
        ? ' -- PARAMETERS: ' + this.stringifyParams(parameters)
        : '');
    this.logger.log(`query is slow: ` + sql);
    this.logger.log(`execution time: ` + time);
  }

  /**
   * Logs events from the schema build process.
   */
  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    if (
      this.options === 'all' ||
      (this.options instanceof Array && this.options.indexOf('schema') !== -1)
    ) {
      this.logger.log(message);
    }
  }

  /**
   * Logs events from the migrations run process.
   */
  logMigration(message: string, queryRunner?: QueryRunner) {
    this.logger.log(message);
  }

  /**
   * Perform logging using given logger, or by default to the this._logger.
   * Log has its own level and message.
   */
  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner) {
    switch (level) {
      case 'log':
        if (
          this.options === 'all' ||
          (this.options instanceof Array && this.options.indexOf('log') !== -1)
        )
          this.logger.log(message);
        break;
      case 'info':
        if (
          this.options === 'all' ||
          (this.options instanceof Array && this.options.indexOf('info') !== -1)
        )
          this.logger.debug(message);
        break;
      case 'warn':
        if (
          this.options === 'all' ||
          (this.options instanceof Array && this.options.indexOf('warn') !== -1)
        )
          this.logger.warn(message);
        break;
    }
  }

  /**
   * Converts parameters to a string.
   * Sometimes parameters can have circular objects and therefor we are handle this case too.
   */
  protected stringifyParams(parameters: any[]) {
    try {
      return JSON.stringify(parameters);
    } catch (error) {
      // most probably circular objects in parameters
      return parameters;
    }
  }
}
