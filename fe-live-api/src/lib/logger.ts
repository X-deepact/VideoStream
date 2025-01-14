type LogLevel = 'log' | 'warn' | 'error';

const env = import.meta.env.VITE_ENV;

class Logger {
  private isEnabled: boolean;

  constructor() {
    // enable logging only in development and test environments
    this.isEnabled = env === 'development' || env === 'test';
  }

  private logMessage(level: LogLevel, ...args: unknown[]) {
    if (this.isEnabled) console[level](...args);
  }

  log(...args: unknown[]) {
    this.logMessage('log', ...args);
  }

  warn(...args: unknown[]) {
    this.logMessage('warn', ...args);
  }

  error(...args: unknown[]) {
    this.logMessage('error', ...args);
  }
}

const logger = new Logger();
export default logger;
