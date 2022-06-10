import { EventEmitterModuleOptions } from '@nestjs/event-emitter/dist/interfaces';

export const eventEmitterSetup = {
  delimiter: '.',
  wildcard: false,
  newListener: false,
  removeListener: false,
  verboseMemoryLeak: true,
  ignoreErrors: false,
} as EventEmitterModuleOptions;
