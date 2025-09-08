//@ts-ignore
import * as logLevel from "loglevel";
//@ts-ignore

import { Logger as LogLevelLogger } from "loglevel";

export declare type LogSeverity =
  | "trace"
  | "debug"
  | "info"
  | "warn"
  | "error"
  | "silent";

export class Logger {
  /**
   * This method is the correct way to obtain a logger.
   * @param name The logger name, for example: UserService.ts
   * @param level The logger level, see LogSeverity
   */
  public static get(name: string, level: LogSeverity = "warn"): Logger {
    const internalLogger = logLevel.getLogger(name);
    internalLogger.setLevel(level);
    return new Logger(name, internalLogger);
  }

  public static setGlobalLevel(level: LogSeverity): void {
    logLevel.setLevel(level);
    logLevel.setDefaultLevel(level);
  }

  private constructor(private name: string, private logger: LogLevelLogger) {}

  public disable(): void {
    this.logger.setLevel("silent");
  }

  public log(message: string | Error, data?: any): void {
    this.logger.log(message, data || "");
  }

  public debug(message: string | Error, data?: any): void {
    this.logger.debug(this.normalizeMessage(message), data || "");
  }

  public info(message: string | Error, data?: any): void {
    this.logger.info(this.normalizeMessage(message), data || "");
  }

  public warn(message: string | Error, data?: any): void {
    this.logger.warn(this.normalizeMessage(message), data || "");
  }

  public error(message: string | Error, data?: any): void {
    this.logger.error(this.normalizeMessage(message), data || "");
  }

  private normalizeMessage(message: string | Error): string {
    return `[${new Date().toISOString()}][${this.name}] ${message}`;
  }
}
