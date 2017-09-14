import {Service} from "../src/Annotations";

export interface Contact {
    id: number;
    name: string;
}

export interface AppState {
    contacts: Contact[];
}

export const appState: AppState = {
    contacts: [
        {"id": 1, "name": "Ori"},
        {"id": 2, "name": "Roni"},
        {"id": 3, "name": "Udi"},
        {"id": 4, "name": "Tommy"},
    ]
}

@Service({
    name: "appService",
})
export class AppService {
    get state() {
        return appState;
    }

    deleteContact(contact: Contact) {
        const index = this.state.contacts.indexOf(contact);
        if(index!=-1) {
            this.state.contacts.splice(index, 1);
        }
    }
}
