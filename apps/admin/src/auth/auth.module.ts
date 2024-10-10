import { Config } from '@admin/_infrastructure/config/config.schema';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './guards/jwt.strategy';
import { AdminRepository } from './repositories/admin.repository';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Config>) => {
        const config = configService.getOrThrow<Config['jwt']>('jwt');
        return {
          secret: config.secret,
          signOptions: {
            expiresIn: config.expired_time,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AdminRepository, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
