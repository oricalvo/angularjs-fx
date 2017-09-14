import {createLogger} from "./Logger";
import {snakeCaseToCamelCase} from "./stringHelpers";
import {IComponentOptions} from "angular";
import {application, isBootstrapped} from "./application";
import * as DI from "./DI";

const logger = createLogger("Registry");

export const routes: BaseRouterState[] = [];
export const modules: ModuleOptions[] = [];

export interface ComponentOptions {
    tagName: string;
    template: string;
    bindings?: any;
    styles?: string;
    transclude?: boolean;
    hostAttributes?: {};
}

export interface ComponentOptionsInternal extends ComponentOptions {
    controller?: Function;
}

export interface ModuleOptions {
    name: string;
    components: any[];
    directives?: any[];
    services?: any[];
    imports?: string[];
}

export interface ServiceOptions {
    name: string;
}

export interface ServiceOptionsInternal extends ServiceOptions {
    service?: Function;
}

export interface RouteOptions {
    isDesktop: boolean;
    isMobile: boolean;
}

export interface BaseRouterState {
    name: string;
    url: string;
}

export interface RouterState extends BaseRouterState{
    component: string;
    modules?: string[];

    //
    //  User defined data. Can be anyhting
    //  Is used by the application to attach some state to each route
    //
    data: RouteOptions;
}

export interface RouterRedirectState extends BaseRouterState{
    redirectTo?: string;
    isSharing: boolean;
}

export function registerModule(module: ModuleOptions) {
    modules.push(module);
}

export function registerRoute(route: BaseRouterState) {
    routes.push(route);
}

export function registerComponent(component) {
    const options: ComponentOptionsInternal = Reflect.getMetadata("component", component)

    var directiveName = snakeCaseToCamelCase(options.tagName);

    const componentOptions: IComponentOptions = {
        controller: <any>options.controller,
        template: options.template,
        bindings: options.bindings,
    };

    if (isBootstrapped()) {
        DI.resolve("$compileProvider").component(directiveName, componentOptions);
    }
    else {
        application.module.component(directiveName, componentOptions);
    }
}

export function registerService(service) {
    const options: ServiceOptionsInternal = Reflect.getMetadata("service", service);
    if(!options) {
        throw new Error("Service decorator is missing on service " + service.name);
    }

    if(isBootstrapped()) {
        DI.resolve("$provide").service(options.name, options.service);
    }
    else {
        application.module.service(options.name, options.service);
    }
}
