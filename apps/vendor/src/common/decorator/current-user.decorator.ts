import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Vendor } from '@vendor/auth/entities/vendor.entity';
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Vendor => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
