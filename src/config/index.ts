import loader from './configuration-loader';
import { ConfigModuleOptions } from '@nestjs/config';

export default {
  isGlobal: true,
  load: [loader],
  ignoreEnvVars: true,
  ignoreEnvFile: true,
  expandVariables: true,
} as ConfigModuleOptions;
