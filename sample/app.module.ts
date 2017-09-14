import "angular-ui-router";
import {AppComponent} from "./app.component";
import {ContactListComponent} from "./contactList.component";
import {AppService} from "./app.service";
import {Module} from "../src/Annotations";

@Module({
    name: "myApp",
    components: [
        AppComponent,
        ContactListComponent,
    ],
    services: [
        AppService
    ],
    imports: [
        "ui.router"
    ]
})
export class AppModule {
    constructor() {
        console.log();
    }
}
