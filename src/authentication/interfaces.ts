import { Request as HttpRequest } from 'express';

export enum AuthenticationMode {
  normal = 'normal',
  safeMode = 'safeMode',
}

export type AuthorizedRequest = HttpRequest & {
  user: {
    id: number;
    tokenId: number;
    roleId?: number;
  };
};

export interface JWTPayload {
  userId: number;
  sub: string;
}

export enum AuthenticationTokenStatus {
  ok,
  notFound,
  ownershipMismatch,
  revoked,
  suspiciousDevice,
  suspiciousIP,
}

export enum AuthenticationRefreshTokenStatus {
  ok,
  wrongCode,
  notFound,
  notDefined,
  revoked,
  suspiciousDevice,
  suspiciousIP,
}
