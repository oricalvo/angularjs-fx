//
//  Fixing IE that does not support (function f(){}).name
//
(function() {
    var f: any = function f() {
    };

    if (!f.name) {
        try{
            Object.defineProperty(Function.prototype, 'name', {
                get: function () {
                    const match = this.toString().match(/^function\s*([^\s(]+)/);
                    if(!match || !match.length) {
                        return "UNKNWON";
                    }

                    var name = match[1];
                    if(!name) {
                        return "UNKNWON";
                    }

                    // For better performance only parse once, and then cache the
                    // result through a new accessor for repeated access.
                    Object.defineProperty(this, 'name', {value: name});
                    return name;
                }
            });
        }
        catch (ex) {
        }
    }
})();

//
//  Below implementation relies on function.name
//  However on minified code the behaviour is broken and therefore was commented out
//
// export function getClassName(obj, removeSuffix?: boolean) {
//     if(!obj.constructor) {
//         throw new Error("Object has no constructor: " + obj);
//     }
//
//     var name = obj.constructor.name;
//
//     var fix = (removeSuffix===undefined ? false : removeSuffix);
//     if(fix) {
//         let end = name.length - "Component".length;
//         if (name.indexOf("Component") == end) {
//             name = name.substring(0, end);
//         }
//
//         end = name.length - "Service".length;
//         if (name.indexOf("Service") == end) {
//             name = name.substring(0, end);
//         }
//     }
//
//     return name;
// }

export function isEmptyObject(obj) {
    for(var key in obj) {
        return false;
    }
    
    return true;
}

export function hook(obj, methodName, factory) {
    var original = obj[methodName];
    obj[methodName] = factory(original);
}

export function toBoolean(val, defValue) {
    if(val === undefined) {
        return !!defValue;
    }

    return !!val;
}
