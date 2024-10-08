import { VendorStatus } from '@libs/clients/enum/vendor-status.enum';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isEmpty, isNotEmpty } from 'class-validator';
import { VendorAccessToken } from './dto/vendor-access-token.dto';
import { VendorLoginRequest } from './dto/vendor-login-request.dto';
import { VendorLoginResponse } from './dto/vendor-login-response.dto';
import { vendorRegisterRequest } from './dto/vendor-register-request.dto';
import { Vendor } from './entities/vendor.entity';
import { VendorRepository } from './repositories/vendor.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly vendorRepository: VendorRepository,
    private readonly jwtService: JwtService,
  ) {}
  async register(req: vendorRegisterRequest): Promise<string> {
    const vendor = await this.vendorRepository.findOne({
      where: {
        email: req.email,
      },
    });
    if (isNotEmpty(vendor))
      throw new UnprocessableEntityException(`email already taken`);

    await this.vendorRepository.save({
      email: req.email,
      name: req.name,
      status: VendorStatus.PENDING,
    });

    return `vendor successfully registered`;
  }

  async login(req: VendorLoginRequest): Promise<VendorLoginResponse> {
    const vendor = await this.findOneByEmailOrThrow(req.email);
    if (vendor.status !== VendorStatus.APPROVED)
      throw new UnauthorizedException(`vendor not verified`);

    const payload: VendorAccessToken = {
      id: vendor.id,
      email: vendor.email,
    };

    return {
      name: vendor.name,
      accessToken: this.jwtService.sign(payload),
    };
  }

  async findOneByEmailOrThrow(email: string): Promise<Vendor> {
    const vendor = await this.vendorRepository.findOne({
      where: {
        email: email,
      },
    });

    if (isEmpty(vendor)) throw new NotFoundException(`vendor not found`);
    return vendor;
  }

  async findOneOrThrow(id: number): Promise<Vendor> {
    const vendor = await this.vendorRepository.findOne({ where: { id } });
    if (isEmpty(vendor)) throw new NotFoundException(`vendor not found`);
    return vendor;
  }
}
