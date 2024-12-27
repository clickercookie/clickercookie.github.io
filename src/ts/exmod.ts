//* This is an example of a mod that supports saving.

// import { saveHandler } from "./main.js";
import { Building } from "./buildings.js";
import { game } from "./main.js";
import { Mod } from "./mods.js";
import { SaveProvider } from "./saving.js";
import { Upgrade, UpgradeData } from "./upgrades.js";

interface ModSave {
    superCookies: number;
}

export class NewMod extends Mod {
    superCookies: number;

    private UPGRADES: UpgradeData[] = [
        {
            uid: "newmod-xyz1",
            name: "xyz upgrade",
            quote: "so funy haha",
            price: 69,
            desc: "multiplies stuff and stuff",
            building: this.buildings[0],
            buildingsRequired: 3
        }
    ]
    constructor() {
        super("modname");

        this.superCookies = 5;

        this.buildings.push(new Building(game, "xyz", "we be making potatoes with this one", 1, 5))

        for (let i in this.UPGRADES) {
            this.upgradesHandler.register(new Upgrade(game, this.UPGRADES[i]));
        }

        document.getElementById("cookieCounter")!.addEventListener("click", () => {this.superCookies++});

        Mod.registerKooh("click", () => {
            console.log("Hello from "+this.NAMESPACE+"!");
        });
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