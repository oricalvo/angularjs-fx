import * as angular from "angular";
import * as promiseHelpers from "./promiseHelpers";
import {resolve} from "./promiseHelpers";
import {createLogger} from "./Logger";
import * as DI from "./DI";
import {registerComponent, ModuleOptions, registerService} from "./Registry";
import {isBundled} from "./application";

var logger = createLogger("ModuleLoader");

export interface ModuleRegistration {
    name: string;
    main: string;
    instance?: any;
}

export interface ModuleLoaderConfiguration {
    bundlesLocation: string;
}

const modules: {[moduleName: string]: any} = {};
const config: ModuleLoaderConfiguration = {
    bundlesLocation: "",
};

function loadMain(modulePath: string) {
    logger.log("Loading module from: " + modulePath);

    return resolve().then(function() {
        if (isBundled()) {
            logger.log("Under production cannot load main script directly. Need to load the bundle first");

            const bundle = getBundleLocation(modulePath);
            logger.log("Loading bundle from: " + bundle);

            return SystemJS.import(bundle);
        }
    }).then(function() {
        return promiseHelpers.wrapPromiseWithNgPromise(SystemJS.import(modulePath + "/module")).then(res => res.default);
    });
}

/*
modulePath is something like "app/lines"
 */
export function loadModule(modulePath: string) {
    return resolve().then(function() {
        logger.log("loadModule", modulePath);

        const module = modules[modulePath];
        if (module) {
            logger.log("Module: " + modulePath + " was already loaded");
            return;
        }

        return loadMain(modulePath).then(function (moduleCtor) {
            logger.log("Loaded module ctor is", moduleCtor);

            const moduleOptions: ModuleOptions = Reflect.getMetadata("module", moduleCtor);
            if(!moduleOptions) {
                throw new Error("Failed to read module metadata for module ctor");
            }

            if(moduleOptions.services) {
                for (let service of moduleOptions.services) {
                    registerService(service);
                }
            }

            for(let component of moduleOptions.components) {
                registerComponent(component);
            }

            modules[modulePath] = DI.instantiate(moduleCtor);
        });
    });
}

export function loadModules(modulesToLoad: string[]) {
    logger.log("loadModules", modulesToLoad);

    const promises = modulesToLoad.map(loadModule);

    return promiseHelpers.all(promises);
}

// export function loadModulesByState(stateName) {
//     logger.log("loadModulesByState", stateName);
//
//     const routeState = Routes.get(stateName);
//     const modules = routeState.modules || [];
//
//     return loadModules(modules);
// }

function getBundleLocation(main: string): string {
    //
    //  main points to the full path of module.js file. For example, "app/lines"
    //  Bundle name should be lines.bundle.js
    //
    const index1 = main.lastIndexOf("/");
    if(index1 == -1) {
        throw new Error("Invalid script location: " + main);
    }

    const name = main.substring(index1 + 1);
    const bundleName = name + ".bundle.js";
    const bundleLocation = config.bundlesLocation + "/" + bundleName;
    return bundleLocation;
}

export function registerModule(entry: ModuleRegistration) {
    logger.log("registerModule", entry);

    if(modules[entry.name]) {
        throw new Error("A module with name: " + entry.name + " is already registered");
    }

    modules[entry.name] = entry;
}

export function configure(options: ModuleLoaderConfiguration) {
    angular.extend(config, options);
}
