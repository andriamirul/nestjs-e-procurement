import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Config } from '@vendor/_infrastructure/config/config.schema';
import { VendorModule } from '@vendor/vendor.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    VendorModule,
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
  providers: [AuthService],
})
export class AuthModule {}
