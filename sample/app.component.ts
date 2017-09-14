import {Component} from "../src/Annotations";
import {AppService, Contact} from "./app.service";

@Component({
    tagName: "app-root",
    template: require("./app.component.html"),
    styles: require("./app.component.css"),
})
export class AppComponent {
    constructor(private appService: AppService) {
    }

    get contacts() {
        return this.appService.state.contacts;
    }

    onContactDeleted(contact: Contact) {
        this.appService.deleteContact(contact);
    }
}
