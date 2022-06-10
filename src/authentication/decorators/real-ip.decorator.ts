import * as requestIp from 'request-ip';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IncomingMessage } from 'http';

export function getIP(request: IncomingMessage): string | undefined {
  return requestIp.getClientIp(request);
}

export const RealIP = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return getIP(request);
  },
);
