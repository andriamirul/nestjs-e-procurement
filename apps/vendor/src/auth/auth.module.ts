import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Config } from '@vendor/_infrastructure/config/config.schema';
import { AuthClientController } from './auth-client.controller';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { VendorRepository } from './repositories/vendor.repository';

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
  controllers: [AuthController, AuthClientController],
  providers: [AuthService, VendorRepository],
  exports: [AuthService],
})
export class AuthModule {}
