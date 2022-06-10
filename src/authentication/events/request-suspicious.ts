export class RequestSuspicious {
  constructor(
    public token: string,
    public ip: string,
    public userAgent: string,
  ) {}
}
