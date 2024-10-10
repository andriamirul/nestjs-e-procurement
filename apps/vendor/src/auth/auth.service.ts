import { VendorStatus } from '@libs/clients/enum/vendor-status.enum';
import { VendorPaginateRequest } from '@libs/clients/vendor/dto/vendor-paginate-request.dto';
import { VendorPaginateResponse } from '@libs/clients/vendor/dto/vendor-paginate-response.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isEmpty, isNotEmpty } from 'class-validator';
import { FindManyOptions, ILike } from 'typeorm';
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

  async approve(id: number): Promise<boolean> {
    const vendor = await this.findOneOrThrow(id);
    if (vendor.status === VendorStatus.APPROVED)
      throw new BadRequestException(`vendor already approved`);

    await this.vendorRepository.update(id, {
      status: VendorStatus.APPROVED,
    });

    return true;
  }

  async paginate(req: VendorPaginateRequest): Promise<VendorPaginateResponse> {
    const skip = (req.page - 1) * req.size;
    const options: FindManyOptions<Vendor> = {
      skip,
      take: req.size,
      order: {},
    };

    if (isNotEmpty(req.sortBy)) {
      req.sortBy.forEach((sortField, index) => {
        const [relation, field] = sortField.toString().split('.');
        if (field) {
          options.order[relation][field] = req.orderBy[index] ?? 'ASC';
          return;
        }
        options.order[sortField] = req.orderBy[index] ?? 'ASC';
      });
    }

    if (isNotEmpty(req.filter)) {
      options.where = [
        {
          name: ILike(`%${req.filter.toLowerCase()}%`),
        },
        {
          email: ILike(`%${req.filter.toLowerCase()}%`),
        },
      ];
    }

    const [data, total] = await this.vendorRepository.findAndCount(options);
    return {
      data: data,
      total: total,
    };
  }

  async remove(id: number): Promise<void> {
    await this.vendorRepository.delete(id);
  }
}
