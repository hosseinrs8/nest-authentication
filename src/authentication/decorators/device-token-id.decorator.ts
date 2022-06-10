import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthorizedRequest } from '../interfaces';

export const DeviceTokenId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): number => {
    const request: AuthorizedRequest = ctx.switchToHttp().getRequest();
    return request.user.tokenId;
  },
);
