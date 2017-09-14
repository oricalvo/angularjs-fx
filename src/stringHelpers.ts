export function camelCaseToSnakeCase(str: string): string {
    var arr = [];

    for(var i=0; i<str.length; i++) {
        var ch = str[i];

        if(isUpper(ch)) {
            arr.push("-" + ch.toLowerCase());
        }
        else {
            arr.push(ch);
        }
    }

    var res = arr.join("");
    return res;
}

export function snakeCaseToCamelCase(str: string): string {
    var arr = [];

    for(var i=0; i<str.length; i++) {
        var ch = str[i];
        var nextCh = str[i+1];

        if(ch=="-") {
            arr.push(nextCh.toUpperCase());
            i++;
        }
        else {
            arr.push(ch);
        }
    }

    var res = arr.join("");
    return res;
}

export function isUpper(str: string): boolean {
    var res = str.toUpperCase() == str;
    return res;
}

export function padLeft(str, size, ch) {
    var buffer = [];

    for(var i=0; i<size-str.length; i++) {
        buffer.push(ch);
    }

    buffer.push(str);

    let res = buffer.join("");
    return res;
}

export function startsWith(str: string, head: string) {
    var tmp = str.substring(0, head.length);
    var res = (tmp == head);
    return res;
}

export function endsWith(str: string, tail: string) {
    var tmp = str.substring(str.length-tail.length);
    var res = (tmp == tail);
    return res;
}

export function extractSearchFromUrl(url:string): Object {
    var result = {};
    if (url && url.indexOf('?') > 0) {
        var searchPart = url.split('?')[1],
            searchArr = searchPart.split('&');
        for (var i = 0; i < searchArr.length; i++) {
            var keyValue = searchArr[i].split('=');
            result[keyValue[0]] = keyValue[1];
        }
    }
    return result;
}

export function formatString(string:string, ...args:any[]) {
    var i;
    if (args instanceof Array) {
        for (i = 0; i < args.length; i++) {
            string = string.replace(new RegExp('\\{' + i + '\\}', 'gm'), args[i]);
        }
        return string;
    }
    for (i = 0; i < arguments.length - 1; i++) {
        string = string.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i + 1]);
    }
    return string;
}