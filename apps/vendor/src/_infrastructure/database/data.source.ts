import * as dotenv from 'dotenv';
import * as path from 'path';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
const migrations = path.resolve(__dirname + '/migrations/**/*.js');

const envPath = path.resolve(__dirname, `../../../.env`);
dotenv.config({
  path: envPath,
});

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  username: process.env.MYSQL_DBNAME,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DBNAME,
  migrations: [migrations],
});
