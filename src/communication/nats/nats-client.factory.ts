import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NatsConfig } from '../../config/types';
import { connect, NatsConnection } from 'nats';

export class NatsConnectionOptions {
  servers: Array<string>;
  username?: string;
  password?: string;
}

@Injectable()
export class NatsClientFactory {
  private readonly connectionOptions = new NatsConnectionOptions();

  constructor(private configService: ConfigService) {
    const config = configService.get<NatsConfig>('nats');
    this.connectionOptions.servers = config.servers;
    if (config.username && config.password) {
      this.connectionOptions.username = config.username;
      this.connectionOptions.password = config.password;
    }
  }

  public async create(): Promise<NatsConnection> {
    const { servers, username, password } = this.connectionOptions;
    if (username && password) {
      return connect({ servers: servers, user: username, pass: password });
    }
    return connect({ servers: servers });
  }
}
