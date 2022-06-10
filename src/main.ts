import {
  bootWebServer,
  initApp,
  setupSwaggerDoc,
} from './config/web-server-setup';

async function bootstrap() {
  const app = await initApp();
  app.setGlobalPrefix('/api/v1');
  setupSwaggerDoc(app);
  bootWebServer(app);
}
bootstrap();
