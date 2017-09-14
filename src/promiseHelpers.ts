import * as angular from "angular";
import {application} from "./application";

export function cachePromise<T>(func: (...args: any[]) => ng.IPromise<T>) : CachedPromise<T> {
    return new CachedPromise<T>(func);
}

export function delay(interval): ng.IPromise<{}> {
    var deferred = application.q.defer();

    setTimeout(function() {
        deferred.resolve();
    }, interval);

    return deferred.promise;
}

export function aggregate<T1, T2>(p1: ng.IPromise<T1>, p2: ng.IPromise<T2>) : ng.IPromise<{val1: T1, val2: T2}> {
    return application.q.all([p1, p2]).then(res => {
        return {
            val1: res[0],
            val2: res[1],
        };
    });
}

export class CachedPromise<T> {
    private promise: ng.IPromise<T>;
    private data: any;

    constructor(public func: (...args: any[]) => ng.IPromise<T>) {
    }

    get(...args: any[]) : ng.IPromise<T> {
        var data = [];
        for(var i=0; i<arguments.length; i++) {
            data["arg" + i] = arguments[i];
        }

        if(!angular.equals(this.data, data)) {
            var func = this.func;
            this.promise = func.apply(null, arguments);
            this.data = data;
        }

        return this.promise;
    }
}

export function valueOrFunc<T>(value: T, func: ()=>ng.IPromise<T>){
    if(value){
        return application.q.when(value);
    }
    
    return func();
}

export function promisify(val) {
    if(typeof val == "object" && val!==null && val.then) {
        return val;
    }
    else {
        return application.q.when(val);
    }
}

export function firstTruthy<T>(... args: any[]) : ng.IPromise<T> {
    let deferred = application.q.defer<T>();
    let index = -1;

    //
    //  Transform all simple values to function that return a promise
    //
    for(var i=0; i<args.length; i++) {
        if(typeof args[i] != "function") {
            let val = args[i];
            args[i] = () => promisify(val);
        }
    }

    function processNext() {
        if(++index == args.length) {
            //
            //  All promises returned failed value
            //
            deferred.reject(new Error("Non empty value was not found"));
        }

        let func = args[index];
        let promise = promisify(func());

        promise.then(function (val) {
            if (val) {
                deferred.resolve(val);
            }
            else {
                processNext();
            }
        }).catch(function (err) {
            deferred.reject(err);
        });
    }

    processNext();

    return deferred.promise;
}

export function wrapPromiseWithNgPromise(promise): ng.IPromise<any> {
    const deferred = application.q.defer();

    promise.then(function(val) {
        deferred.resolve(val);
    }).catch(function(err) {
        deferred.reject(err);
    });

    return deferred.promise;
}

export function resolve() {
    return application.q.when();
}

export function all(promises) {
    return application.q.all(promises);
}

export function create(func) {
    const deferred = application.q.defer();

    func(function resolve(val) {
        deferred.resolve(val);
    }, function reject(err) {
        deferred.reject(err);
    });

    return deferred.promise;
}
