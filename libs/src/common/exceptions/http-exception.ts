import { BadRequestError } from './bad-request';

export class HttpException {
  statusCode: number;
  message: string;
  errors?: BadRequestError[];
}
