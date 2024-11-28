//* This is an example of a mod that supports saving.

// import { saveHandler } from "./main.js";
import { SaveProvider } from "./saving.js";

interface ModSave {
    superCookies: number;
}

export class ModProvider extends SaveProvider {
    NAMESPACE: string;

    superCookies: number;
    constructor() {
        super();

        this.NAMESPACE = "modname";

        this.superCookies = 5;

        document.getElementById("cookieCounter")!.addEventListener("click", () => {this.superCookies++})
    }

    getSaveData(): ModSave {
        return {
            superCookies: this.superCookies
        }
    }

    loadSaveData(saveData: ModSave): void {
        this.superCookies = saveData.superCookies
    }
}

// const modProvider = new ModProvider();

// saveHandler.registerProvider(modProvider.NAMESPACE, modProvider)