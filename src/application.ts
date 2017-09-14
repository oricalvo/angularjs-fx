import {ModuleLoaderConfiguration} from "./ModuleLoader";
import {createLogger} from "./Logger";
import {BaseRouterState, ModuleOptions, registerComponent, registerService} from "./Registry";
import * as Router from "./Router";
import * as DI from "./DI";
import * as angular from "angular";
import {ICompileProvider, ICompileService, IModule, IQService, IRootScopeService, ITimeoutService} from "angular";
import IInjectorService = angular.auto.IInjectorService;
import IProvideService = angular.auto.IProvideService;

export interface Application {
    module: IModule,
    injector: IInjectorService;
    providerInjector: IInjectorService,
    q: IQService;
    timeout: ITimeoutService,
    rootScope: IRootScopeService,
    compile: ICompileService,
    compileProvider: ICompileProvider,
    provide: IProvideService
}

export let application: Application;

var logger = createLogger("Application");

export interface BootstrapOptions {
    element: Element;
    appModule: IModule;
    routes: BaseRouterState[];
    loader: ModuleLoaderConfiguration;
}

interface ModuleContructor {
    new(...args);
}

export function bootstrap(moduleCtor: ModuleContructor, element?: Element) {
    if(!element) {
        element = document.querySelector("html");
    }

    const moduleOptions: ModuleOptions = Reflect.getMetadata("module", moduleCtor);
    if(!moduleOptions) {
        throw new Error("No Module decorator on module " + moduleCtor.name);
    }

    application = <any>{};
    const appModule = application.module = angular.module(moduleOptions.name, moduleOptions.imports);

    if(moduleOptions.components) {
        for (let component of moduleOptions.components) {
            registerComponent(component);
        }
    }

    if(moduleOptions.services) {
        for (let service of moduleOptions.services) {
            registerService(service);
        }
    }

    appModule.config(["$provide", "$injector", "$compileProvider", function($provide, providerInjector, $compileProvider) {
        Object.assign(application, {
            provide: $provide,
            providerInjector: providerInjector,
            compileProvider: $compileProvider,
        });

        DI.config(Router.configure);
    }]);

    appModule.run(["$rootScope", "$injector", "$q", "$timeout", function($rootScope, $injector, $q, $timeout, $compile) {
        appBootstrapped = true;

        Object.assign(application, {
            rootScope: $rootScope,
            injector: $injector,
            q: $q,
            timeout: $timeout,
            compile: $compile,
        });

        $injector.instantiate(moduleCtor);
    }]);

    angular.bootstrap(element, [moduleOptions.name], {
        strictDi: true,
    });
}

let appBootstrapped = false;

export function isBootstrapped() {
    return appBootstrapped;
}

export function isBundled() {
    return false;
}

export function ensureBootstrapped() {
    if(!appBootstrapped) {
        throw new Error("Promise.$q is not available. Did angular bootstrap already ?");
    }
}
