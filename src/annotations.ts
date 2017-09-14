import {
    ComponentOptions, ComponentOptionsInternal,
    ModuleOptions,
    ServiceOptions, ServiceOptionsInternal
} from "./Registry";

export function Component(options: ComponentOptions) {
    return function (target: Function) {
        Reflect.defineMetadata("component", options, target);

        (<ComponentOptionsInternal>options).controller = target;

        set$inject(target);
    }
}

export function Service(options: ServiceOptions) {
    return function (target: Function) {
        Reflect.defineMetadata("service", options, target);

        (<ServiceOptionsInternal>options).service = target;

        set$inject(target);
    }
}

export function Module(options: ModuleOptions) {
    return function moduleDecorator(target: Function) {
        Reflect.defineMetadata("module", options, target);

        set$inject(target);
    }
}

export function Inject(name) {
    return function(target: Object, propertyKey: string | symbol, parameterIndex: number) {
        var params = Reflect.getMetadata("injectAnnotations", target);
        if(!params) {
            params = [];
            Reflect.defineMetadata("injectAnnotations", params, target);
        }

        params[parameterIndex] = {
            index: parameterIndex,
            name: name,
        };
    }
}

function set$inject(target) {
    var paramtypes: any[] = Reflect.getMetadata("design:paramtypes", target);
    if(!paramtypes) {
        target.$inject = [];
        return;
    }

    var injectAnnotations: any[] = Reflect.getMetadata("injectAnnotations", target);

    var $inject = [
    ];

    paramtypes.forEach((type, index) => {

        var parameterName = null;
        var metadata = null;
        var _target = target;
        var injectAnnotation = null;

        if(injectAnnotations && (injectAnnotation = injectAnnotations[index])) {
            parameterName = injectAnnotation.name;
        }
        else if (metadata = Reflect.getMetadata("service", type)) {
            parameterName = metadata.name;
        }
        else {
            throw new Error("Failed to resolve dependency: " + type);
        }

        $inject.push(parameterName);
    });

    target.$inject = $inject;
}

export type ComponentEvent<T> = (args: {$event: T})=>void;
