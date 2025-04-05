//* This is an example of a mod that supports saving.

import { Building } from "./buildings.js";
import { game, modHandler } from "./main.js";
import { Mod } from "./mods.js";
import { Upgrade, UpgradeData } from "./upgrades.js";

interface ModSave {
    superCookies: number;
}

export class NewMod extends Mod {
    superCookies: number;

    banana: Building;

    private readonly UPGRADES_DATA: UpgradeData[];
    constructor() {
        super("modname");

        this.superCookies = 5;

        this.banana = new Building(game.clickercookie, {
            name: "banaan",
            namePlural: "many bannaa",
            quote: "i love anana",
            upgradeCost: 8,
            CPSGain: 5
        });
        this.buildingHandler.register("banana", this.banana);

        this.UPGRADES_DATA = [
            {
                uid: "newmod-xyz1",
                name: "xyz upgrade",
                quote: "so funy haha",
                price: 69,
                desc: "multiplies stuff and stuff",
                building: this.banana,
                buildingsRequired: 3
            }
        ];
        for (let i in this.UPGRADES_DATA) {
            this.upgradeHandler.register(this.UPGRADES_DATA[i].uid, new Upgrade(game.clickercookie, this.UPGRADES_DATA[i]));
        }

        document.getElementById("cookieCount")!.addEventListener("click", () => {this.superCookies++});

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

const newmod = new NewMod();

modHandler.register(newmod.NAMESPACE, newmod);