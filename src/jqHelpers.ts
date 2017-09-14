import * as angular from "angular";

export function getSingleNode(element: JQuery): Element {
    if(!element.length) {
        throw new Error("JQuery element is empty");
    }

    var res = element[0];
    return res;
}

export function isParent(parent, element) {
    while(true) {
        if(element[0]==parent[0]) {
            return true;
        }

        if(element[0] == document.rootElement) {
            return false;
        }

        element = element.parent();
    }
}

export function markEventAsHandled(jqEvent) {
    var originalEvent = jqEvent;//.originalEvent;
    if(originalEvent) {
        originalEvent.moovitHandled = true;
    }
}

export function wasEventHandled(jqEvent) {
    var originalEvent = jqEvent;//.originalEvent;
    if(!originalEvent) {
        return false;
    }

    return originalEvent.moovitHandled;
}

export function find(selector: string, element?: JQuery) {
    let nodes;

    if (element) {
        nodes = element[0].querySelectorAll(selector);
    }
    else {
        nodes = document.querySelectorAll(selector);
    }

    const res = angular.element(nodes);
    return res;
}

/* Polyfills */

Array.prototype["find"] = Array.prototype["find"] || function(callback) {
    if (this === null) {
        throw new TypeError('Array.prototype.find called on null or undefined');
    } else if (typeof callback !== 'function') {
        throw new TypeError('callback must be a function');
    }
    var list = Object(this);
    // Makes sures is always has an positive integer as length.
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    for (var i = 0; i < length; i++) {
        var element = list[i];
        if ( callback.call(thisArg, element, i, list) ) {
            return element;
        }
    }
};