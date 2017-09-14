import {endsWith} from "./stringHelpers";
import {createLogger} from "./Logger";
import {application} from "./application";

const logger = createLogger("DI");

export function resolve(name: string): any {
    if(endsWith(name, "Provider")) {
        return application.providerInjector.get(name);
    }
    else if(name == "$provide") {
        return application.provide;
    }
    else {
        return application.injector.get(name);
    }
}

export function run(func, locals?) {
    return application.injector.invoke(func, locals);
}

export function config(func, locals?) {
    return application.providerInjector.invoke(func, locals);
}

export function instantiate(ctor, locals?) {
    logger.log("instantiate", ctor, locals);

    return application.injector.instantiate(ctor, locals);
}

