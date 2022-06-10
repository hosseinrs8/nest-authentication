import { plainToInstance, instanceToPlain } from 'class-transformer';
import { validateSync } from 'class-validator';
import { accessSync, constants as FSConstants } from 'fs';
import { Configs } from './types';

function logicalValidation(configs: Configs): Array<Error> {
  const errors: Array<Error> = [];
  if (
    !configs.registration.requiredEmail &&
    !configs.registration.requiredPhone
  ) {
    errors.push(
      new Error(
        'one of email[registration.requiredEmail=False]/phone[registration.requiredPhone=False] must be required!',
      ),
    );
  }
  if (
    !configs.registration.requiredEmail &&
    configs.registration.autoVerifyEmail
  ) {
    errors.push(
      new Error(
        'auto verify email(registration.requiredEmail=True) is only work when email is required(registration.autoVerifyEmail=False)!',
      ),
    );
  }
  if (
    !configs.registration.requiredPhone &&
    configs.registration.autoVerifyPhone
  ) {
    errors.push(
      new Error(
        'auto verify phone(registration.autoVerifyPhone=True) is only work when phone is required(registration.requiredPhone=False)!',
      ),
    );
  }
  try {
    accessSync(configs.authentication.jwt.privateKeyPath, FSConstants.R_OK);
  } catch (e) {
    if (e.errno === -13) {
      errors.push(
        new Error(
          '[authentication.jwt.privateKeyPath] jwt private Key not accessible!',
        ),
      );
    } else if (e.errno === -2) {
      errors.push(
        new Error(
          '[authentication.jwt.privateKeyPath] jwt private Key not exist!',
        ),
      );
    } else {
      errors.push(e);
    }
  }
  try {
    accessSync(configs.authentication.jwt.publicKeyPath, FSConstants.R_OK);
  } catch (e) {
    if (e.errno === -13) {
      errors.push(
        new Error(
          '[authentication.jwt.publicKeyPath] jwt public Key not accessible!',
        ),
      );
    } else if (e.errno === -2) {
      errors.push(
        new Error(
          '[authentication.jwt.publicKeyPath] jwt public Key not exist!',
        ),
      );
    } else {
      errors.push(e);
    }
  }
  try {
    accessSync(configs.crypto.encryptionDefaultKeyPath, FSConstants.R_OK);
  } catch (e) {
    if (e.errno === -13) {
      errors.push(
        new Error(
          '[authentication.crypto.encryptionDefaultKeyPath] jwt public Key not accessible!',
        ),
      );
    } else if (e.errno === -2) {
      errors.push(
        new Error(
          '[authentication.crypto.encryptionDefaultKeyPath] jwt public Key not exist!',
        ),
      );
    } else {
      errors.push(e);
    }
  }
  return errors;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(Configs, config, {
    enableImplicitConversion: true,
  });
  const syntaxErrors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });
  if (syntaxErrors.length > 0) {
    console.log(syntaxErrors.toString());
    process.exit(1);
  }
  const logicalErrors = logicalValidation(validatedConfig);
  if (logicalErrors.length > 0) {
    console.log(logicalErrors.toString());
    process.exit(1);
  }
  return instanceToPlain(validatedConfig);
}

// export function validate(config: Record<string, unknown>) {
//   const validatedConfig = plainToInstance(Configs, config, {
//     enableImplicitConversion: true,
//   });
//   return instanceToPlain(validatedConfig);
// }
