import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { validate } from './configuration-validation';

function getConfigPath(): string {
  if (process.env.CONFIG_FILE_PATH && process.env.CONFIG_FILE_PATH.length > 0) {
    return process.env.CONFIG_FILE_PATH;
  }
  try {
    return 'config.yaml';
  } catch (e) {
    return e;
  }
}

function loadConfigs() {
  return yaml.load(readFileSync(getConfigPath(), 'utf8')) as Record<
    string,
    any
  >;
}

export default () => {
  return validate({
    ...loadConfigs(),
  });
};
