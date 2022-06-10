import { NestFactory } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configModuleSetups from './index';
import { WebServerConfig } from './types';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../app.module';
import { readFileSync } from 'fs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export async function initApp(): Promise<INestApplication> {
  const tlsConfig = (await getWebServerConfigs()).tls;
  let ca, cert, key;
  if (tlsConfig) {
    if (tlsConfig.caPath) {
      ca = readFileSync(tlsConfig.caPath).toString();
    }
    if (tlsConfig.certPath) {
      cert = readFileSync(tlsConfig.certPath).toString();
    }
    if (tlsConfig.keyPath) {
      key = readFileSync(tlsConfig.keyPath).toString();
    }
    return NestFactory.create(AppModule, {
      httpsOptions: {
        ca,
        cert,
        key,
      },
    });
  }
  return NestFactory.create(AppModule);
}
export async function setupSwaggerDoc(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Meta-State')
    .setDescription('')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
}

export async function bootWebServer(app: INestApplication) {
  const webServerOptions = await getWebServerConfigs();
  if (webServerOptions.host && webServerOptions.port) {
    return app.listen(webServerOptions.port, webServerOptions.host);
  } else {
    return app.listen(3000, '0.0.0.0');
  }
}

async function getWebServerConfigs(): Promise<WebServerConfig> | undefined {
  const configApp = await NestFactory.create(
    ConfigModule.forRoot(configModuleSetups),
  );
  const configService: ConfigService = configApp.get(ConfigService);
  return configService.get<WebServerConfig>('webServer');
}
