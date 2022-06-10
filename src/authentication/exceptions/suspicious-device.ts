import { HttpException, HttpStatus } from '@nestjs/common';

export class SuspiciousDevice extends HttpException {
  constructor() {
    super('suspicious device', HttpStatus.FORBIDDEN);
  }
}
