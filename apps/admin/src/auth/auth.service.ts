import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isEmpty } from 'class-validator';
import { AdminAccessToken } from './dto/admin-access-token.dto';
import { AdminLoginRequest } from './dto/admin-login-request.dto';
import { AdminLoginResponse } from './dto/admin-login-response.dto';
import { Admin } from './entities/admin.entity';
import { AdminRepository } from './repositories/admin.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(req: AdminLoginRequest): Promise<AdminLoginResponse> {
    const admin = await this.findOneByEmailOrThrow(req.email);
    const payload: AdminAccessToken = {
      id: admin.id,
      email: admin.email,
    };

    return {
      name: admin.name,
      accessToken: this.jwtService.sign(payload),
    };
  }

  async findOneByEmailOrThrow(email: string): Promise<Admin> {
    const admin = await this.adminRepository.findOne({
      where: {
        email: email,
      },
    });

    if (isEmpty(admin)) throw new NotFoundException(`admin not found`);
    return admin;
  }

  async findOneOrThrow(id: number): Promise<Admin> {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (isEmpty(admin)) throw new NotFoundException(`admin not found`);
    return admin;
  }
}
