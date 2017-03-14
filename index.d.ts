// Type definitions for Node Cogswell SDK
// Project: https://github.com/cogswell-io/node-cogs-javascript-sdk
// Definitions by: Cogswell http://cogswell.io
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module "cogs-sdk" {
  export namespace errors {
    export class CogsError extends Error {
      constructor(message: string, cause: Error, statusCode?: number, details?: string);

      toString(): string;
    }
    export class ConfigError extends CogsError {
      constructor(message: string, cause: Error);
    }
    export class MonitorError extends CogsError {
      constructor(message: string, cause: Error);
    }
    export class TimeoutError extends CogsError {
      constructor(message: string, cause: Error);
    }
    export class PushError extends CogsError {
      constructor(message: string, cause: Error);
    }
    export class AuthKeyError extends CogsError {
      constructor(message: string, cause: Error);
    }
    export class ApiError extends CogsError {
      constructor(message: string, cause: Error, statusCode?: number, details?: string);
    }
    export class InfoError extends CogsError {
      constructor(message: string, cause: Error, statusCode?: number, details?: string);
    }
    export class ToolsError extends CogsError {
      constructor(message: string, cause: Error, statusCode?: number, details?: string);
    }
    export class PubSubError extends CogsError {
      constructor(message: string, cause: Error, statusCode?: number, details?: string);
    }
    export class PubSubResponseError extends CogsError {
      constructor(code: number, details: string, action: string, message: string, sequence: number);
    }
    export class PubSubFailureResponse extends PubSubError {
      constructor(message: string, cause: Error, code?: number, details?: string, record?: string);
    }
    export class PubSubResponseTimeout extends PubSubError {
      constructor(message: string, details: string, seq: number);
    }
  }
}
