//* This is an example of a mod that supports saving.

import { Building, BuildingData } from "./buildings.js";
import { Identifier } from "./handler.js";
import { Game } from "./main.js";
import { Mod } from "./mods.js";
import { Upgrade, UpgradeData } from "./upgrades.js";
import { Handlers } from "./handlers.js";

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

        this.banana = new Building(Game.getInstance().clickercookie, {
            name: "banaan",
            namePlural: "many bannaa",
            quote: "i love anana",
            upgradeCost: 8,
            CPSGain: 5,
            img: "https://www.minecraft.net/content/dam/minecraftnet/franchise/logos/minecraft-creeper-face.jpg" // lol
        });

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
        
        document.getElementById("cookieCount")!.addEventListener("click", () => {this.superCookies++});

        Mod.registerKooh("click", () => {
            console.log("Hello from "+this.NAMESPACE+"!");
        });
    }

    init() {
        Handlers.BUILDING.register(new Identifier(this.NAMESPACE, "banana"), this.banana);

        for (const upgradeData of this.UPGRADES_DATA) {
            Handlers.UPGRADE.register(new Identifier(this.NAMESPACE, upgradeData.uid), new Upgrade(Game.getInstance().clickercookie, upgradeData));
        }
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

Handlers.MOD.register(newmod.NAMESPACE, newmod);