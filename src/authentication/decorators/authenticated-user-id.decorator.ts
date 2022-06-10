import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthorizedRequest } from '../interfaces';

export const AuthenticatedUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): number => {
    const request: AuthorizedRequest = ctx.switchToHttp().getRequest();
    return request.user.id;
  },
);
