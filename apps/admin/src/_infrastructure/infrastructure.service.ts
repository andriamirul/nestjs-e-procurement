import { INestApplication, Injectable } from '@nestjs/common';

@Injectable()
export class InfrastructureService {
  public app: INestApplication;
}
