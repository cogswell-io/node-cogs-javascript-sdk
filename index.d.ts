// Type definitions for Node Cogswell SDK
// Project: https://github.com/cogswell-io/node-cogs-javascript-sdk
// Definitions by: Cogswell http://cogswell.io
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module "cogs-sdk" {
    import { EventEmitter } from "eventemitter3";

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

        type ErrorResponseHandler = (response: PubSubErrorResponse) => void;
        type MessageHandler = (record: MessageRecord) => void;

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

    interface ApiKey {
        secret: string;
        access: string;
    }

    interface ClientKey {
        secret: string;
        salt: string;
    }

    interface HttpConfig {
        http_request_timeout: number;
        base_url: string;
    }

    interface WebsocketConfig {
        websocket_connect_timeout: number;
        base_ws_url: string;
        websocket_auto_reconnect?: boolean;
    }

    interface Loggable {
        log_level?: string;
    }

    export namespace ws {

        class BaseWS extends EventEmitter {
            constructor(url: string, headers: object, timeout: number);
        }

        class NodeWS extends BaseWS {
          constructor(url: string, headers: object, timeout: number);

          close(): Promise<void>;
          ping(): void;
          send(data: object): Promise<void>;

        }

        class BrowserWS extends BaseWS {
          constructor(url: string, headers: object, timeout: number);

          close(): Promise<void>;
          ping(): void;
          send(data: object): Promise<void>;
          
        }
    }

    export namespace api {
        interface ApiClientConfig extends HttpConfig, WebsocketConfig, Loggable {
            api_key: ApiKey;
            client_key: ClientKey;
        }

        class PushWebSocket extends EventEmitter {
            constructor(config: ApiClientConfig, namespace: string,
                        attributes: object, autoAcknowledge?: boolean);

            close(): void;
            disconnect(): void;
            ack(messageId: string): void;
            acknowledge(messageId: string): void;
            connect(): Promise<void>;
        }

        interface EventSendResponse {
            message: string;
            event_id: string;
        }

        interface CepMessageRecord {
            campaign_name: string;
            campaign_id: number;
            data?: string;
            namespace: string;
            event_name: string;
            topic: object;
            message_id: string;
            ciid_hash: string;
            url?: string;
            notification_msg?: string;
            forwarded_event? : {
              namespace: string;
              event_name: string;
              attributes: object;
              timestamp: Date;
            }
        }

        class ApiClient {
            constructor(config: ApiClientConfig);

            baseUrl(): string;
            baseWsUrl(): string;
            accessKey(): string;
            clientSalt(): string;
            clientSecret(): string;

            subscribe(namespace: string, attributes: object, autoAcknowledge?: boolean): PushWebSocket;
            sendEvent(namespace: string, eventName: string, attributes: object, options?: object): Promise<EventSendResponse>;
            getEventTrace(namespace: string, attributes: object, eventId: string): Promise<object>;
            getChannelSummary(namespace: string, attributes: object): Promise<object>;
            getMessage(namespace: string, topicAttributes: object, messageId: string): Promise<CepMessageRecord>;
        }

        function getClient(configPath: string): Promise<ApiClient>;
        function getClientWithConfig(config: ApiClientConfig): Promise<ApiClient>;
    }

    export namespace tools {
        interface ToolsClientConfig extends HttpConfig, WebsocketConfig, Loggable {
            api_key: ApiKey;
        }

        interface ClientKey {
          client_salt: string;
          client_secret: string;
        }

        class ToolsClient {
            constructor(config: ToolsClientConfig);

            baseUrl(): string;
            baseWsUrl(): string;
            accessKey(): string;
            secretKey(): string;

            getApiClientWithNewKey(): Promise<api.ApiClient>;
            getNamespaceSchema(namespace: string): Promise<object>;
            newRandomUuid(): Promise<string>;
            newClientKey(): Promise<ClientKey>;
        }

        function getClient(configPath: string): Promise<ToolsClient>;
        function getClientWithConfig(config: ToolsClientConfig): Promise<ToolsClient>;
    }

    export namespace info {

        interface InfoClientConfig {
            base_url: string;
            http_request_timeout: number;
            log_level?: string;
        }

        class InfoClient {
            constructor(cfg: InfoClientConfig);

            baseUrl(): string;
            getStatus(): Promise<object>;
            getApiDocs(): Promise<object>;
            getBuildInfo(): Promise<object>;
            //makeRequest(method: string, path: string, data?: any): Promise<any>;
        }

        function getClient(configPath: string): Promise<InfoClient>;
        function getClientWithConfig(config: InfoClientConfig): Promise<InfoClient>;
    }
}
