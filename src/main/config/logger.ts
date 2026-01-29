import pino from 'pino';
import { config } from './index';

export const logger = pino({
  level: config.logging.level,
  transport:
    config.app.env === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
  base: {
    app: config.app.name,
    env: config.app.env,
  },
});
