// Type definitions for Node Cogswell SDK
// Project: https://github.com/cogswell-io/node-cogs-javascript-sdk
// Definitions by: Cogswell http://cogswell.io
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module "cogs-sdk" {
    export namespace errors {
        export class CogsError extends Error {
            constructor(message: string, cause?: Error, statusCode?: number, details?: string);

            toString(): string;
        }
    }
}
