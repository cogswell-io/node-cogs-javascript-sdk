// Type definitions for Node Cogswell SDK
// Project: https://github.com/cogswell-io/node-cogs-javascript-sdk
// Definitions by: Cogswell http://cogswell.io
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module "cogs-sdk" {
  import {EventEmitter} from "eventemitter3";

  export namespace errors {
    class CogsError extends Error {
      constructor(message: string, cause: Error, statusCode?: number, details?: string);

      toString(): string;
    }
    class ConfigError extends CogsError {
      constructor(message: string, cause: Error);
    }
    class MonitorError extends CogsError {
      constructor(message: string, cause: Error);
    }
    class TimeoutError extends CogsError {
      constructor(message: string, cause: Error);
    }
    class PushError extends CogsError {
      constructor(message: string, cause: Error);
    }
    class AuthKeyError extends CogsError {
      constructor(message: string, cause: Error);
    }
    class ApiError extends CogsError {
      constructor(message: string, cause: Error, statusCode?: number, details?: string);
    }
    class InfoError extends CogsError {
      constructor(message: string, cause: Error, statusCode?: number, details?: string);
    }
    class ToolsError extends CogsError {
      constructor(message: string, cause: Error, statusCode?: number, details?: string);
    }
    class PubSubError extends CogsError {
      constructor(message: string, cause: Error, statusCode?: number, details?: string);
    }
    class PubSubResponseError extends CogsError {
      constructor(code: number, details: string, action: string, message: string, sequence: number);
    }
    class PubSubFailureResponse extends PubSubError {
      constructor(message: string, cause: Error, code?: number, details?: string, record?: string);
    }
    class PubSubResponseTimeout extends PubSubError {
      constructor(message: string, details: string, seq: number);
    }
  }

  export namespace pubsub {
    interface PubSubOptions {
      url?: string;
      autoReconnect?: boolean;
      connectTimeout?: number;
      sessionUuid?: string;
    }

    interface PubSubErrorResponse {
      code: number;
      details?: string;
      action?: string;
      message?: string;
      sequence?: number;
    }

    interface MessageRecord {
      channel: string;
      message: string;
      timestamp: Date;
      id: string;
    }

    interface DropConnectionOptions {
      autoReconnectDelay?: number;
    }

    type ErrorResponseHandler = (response:PubSubErrorResponse) => void;
    type MessageHandler = (record:MessageRecord) => void;

    function connect(keys: string[], options?: PubSubOptions): Promise<PubSubWebSocket>;

    class PubSubWebSocket extends EventEmitter {
      constructor(keys: string[], options?: PubSubOptions);

      getSessionUuid(): Promise<string>;
      publishWithAck(channel: string, message: string): Promise<string>;
      publish(channel: string, message: string, errorHandler?: ErrorResponseHandler): Promise<number>;
      subscribe(channel: string, handler: MessageHandler): Promise<string[]>;
      unsubscribe(channel: string): Promise<string[]>;
      unsubscribeAll(): Promise<string[]>;
      listSubscriptions(): Promise<string[]>;
      close(): Promise<void>;
      disconnect(): Promise<void>;
      dropConnection(dropConnectionOptions: DropConnectionOptions): void;
    }
  }
}
