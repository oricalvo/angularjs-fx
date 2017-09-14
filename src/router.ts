import {loadModules} from "./ModuleLoader";
import {createLogger} from "./Logger";
import {RouterState, RouterRedirectState, BaseRouterState} from "./Registry";
import * as Registry from "./Registry";
import * as Router from "./Router";
import {resolve} from "./promiseHelpers";

const logger = createLogger("Router");

function getRouteTemplate(route: RouterState) {
    return "<" + route.component + "></" + route.component + ">";
}

function loadRouteModules(route: RouterState) {
    return resolve().then(function() {
        if(!route.modules) {
            return;
        }

        return loadModules(route.modules);
    });
}

export function registerRouteIntoUIRouter($stateProvider, route: BaseRouterState) {
    $stateProvider.state(route.name, {
        name: route.name,
        url: route.url,
        templateProvider: function() {
            return loadRouteModules(<RouterState>route).then(function() {
                return getRouteTemplate(<RouterState>route);
            }).catch(err => {
                //
                //  UI router does not report errors returned from templateProvider
                //
                logger.error(err);
            });
        },
        reloadOnSearch: false,
        redirectTo: (<RouterRedirectState>route).redirectTo,
        isSharing: (<RouterRedirectState>route).isSharing,
    });
}

configure["$inject"] = [
    "$stateProvider",
    "$urlRouterProvider"
]
export function configure($stateProvider, $urlRouterProvider) {
    //
    //  Removed for now. Allows us to keep a simple moovitapp.com
    //  URL
    //
    $urlRouterProvider.otherwise("/");

    Registry.routes.forEach(r => {
        Router.registerRouteIntoUIRouter($stateProvider, r);
    });
}
