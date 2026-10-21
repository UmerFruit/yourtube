import pino from 'pino';

const isBrowser = typeof window !== 'undefined';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  messageKey: 'msg',
  formatters: {
    level: (label) => ({ level: label }),
  },
  ...(isBrowser ? { browser: { asObject: true } } : {}),
});

logger.info({ env: process.env.NODE_ENV, level: process.env.LOG_LEVEL || 'info' }, 'Logger initialized');

export default logger;
