export interface ILogger {
    prefix: string;
    log(message, ... args: any[]);
    info(message, ... args: any[]);
    error(message, ... args: any[]);
    create(prefix): ILogger;
}

export function createLogger(prefix: string) : ILogger {
    const logger: ILogger = <any>{
        prefix: prefix
    };
    logger.log = console.log.bind(console, prefix);
    logger.error = console.error.bind(console, prefix);
    logger.info = console.info.bind(console, prefix);
    logger.create = function(prefix) {
        return createLogger(logger.prefix + prefix);
    }

    return logger;
}

export class NullLogger implements ILogger {
    prefix: string = "";

    constructor() {
    }

    log(message, ... args: any[]) {
    }

    info(message, ... args: any[]) {
    }

    error(message, ... args: any[]) {
    }

    create() {
        return this;
    }
}
