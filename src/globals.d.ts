/// <reference path="../node_modules/reflect-metadata/Reflect.d.ts" />

declare module "*.html" {
    const content: string;
    export default content;
}

declare module "*.css" {
    const content: string;
    export default content;
}
