import {Component, ComponentEvent} from "../src/Annotations";
import {Contact} from "./app.service";

@Component({
    tagName: "app-contact-list",
    template: require("./contactList.component.html"),
    styles: require("./contactList.component.css"),
    bindings: {
        contacts: "<",
        onContactDeleted: "&",
    }
})
export class ContactListComponent {
    contacts: Contact[];
    onContactDeleted: ComponentEvent<Contact>;

    constructor() {
    }

    remove(contact: Contact) {
        this.onContactDeleted({$event: contact});
    }
}
