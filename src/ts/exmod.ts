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
            CPSGain: 5,
            img: "https://www.minecraft.net/content/dam/minecraftnet/franchise/logos/minecraft-creeper-face.jpg" // lol
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
                buildingsRequired: 3,
                img: "https://cdn.modrinth.com/data/AANobbMI/295862f4724dc3f78df3447ad6072b2dcd3ef0c9_96.webp" // lol
            }
        ];
        for (const upgrade of this.UPGRADES_DATA) {
            this.upgradeHandler.register(upgrade.uid, new Upgrade(game.clickercookie, upgrade));
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