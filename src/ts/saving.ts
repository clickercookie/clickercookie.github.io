import { Identifier } from "./handler.js";
import { Handlers, SaveHandler } from "./handlers.js";
import { branchQuickSwitch, isObject } from "./helper.js";
import { Game, VersionBranch } from "./main.js";
import { SimplePopup } from "./popup.js";

export class Savinator {
    private saveHandler: SaveHandler;

    // these are useful for debugging when i need to change the name of the local storage key temporarily
    saveName: string;
    betaSaveName: string;
    developSaveName: string;

    public get currentSaveName(): string {
        return branchQuickSwitch(this.saveName, this.betaSaveName, this.developSaveName) as string;
    }

    /** If this value is false, when you save when a mod is registered with the saveHandler, then reload the page to a state where it isn't, a save will overwrite that mod's data. */
    preserveUnusedNamespacesInSaves: boolean;
    constructor(saveHandler: SaveHandler) {
        this.saveHandler = saveHandler;

        this.preserveUnusedNamespacesInSaves = true;

        this.saveName = "save";
        this.betaSaveName = "betaSave";
        this.developSaveName = "developSave";
    }

    // these two methods could probably be static
    setLocalStorageSave(value: string) {
        localStorage.setItem(this.currentSaveName, value);
    }

    getLocalStorageSave(): Save | null {
        if (localStorage.getItem(this.currentSaveName) === null) {
            return null;
        } else {
            const parsedSave = JSON.parse(localStorage.getItem(this.currentSaveName)!);

            if (!Save.isValidSaveData(parsedSave)) {
                console.warn("Savinator tried to get a Save from localStorage but the value was not a valid save. Returning null.");
                return null;
            }

            return new Save(parsedSave);
        }
    }

    /**
     * Save a stringified {@link Save} to localStorage with {@link Savinator.saveHandler}'s savedata dump as the data.
     * If {@link Savinator.preserveUnusedNamespacesInSaves} is true, then an additional statement will be run that will ensure that if a namespace is present in localStorage and is not present in the dump, that that namespace's data is copied to the new save.
     * @param [save=undefined] The {@link Save} to use for the save. If defined, will not create a new {@link Save} using {@link Savinator.saveHandler}'s dump but will instead use this parameter.
    */
    save(save: Save=undefined) {
        if (save === undefined) {
            const newSave = new Save();
            const saveDump = this.saveHandler.dumpSaveData();
            if (this.preserveUnusedNamespacesInSaves && this.getLocalStorageSave() !== null) {
                const localStorageSave = this.getLocalStorageSave()!;
                for (const namespace of localStorageSave.getNamespaces()) {
                    if (!(namespace in saveDump)) {
                        newSave.addData(namespace, localStorageSave.getData(namespace));
                        console.log(`Preserved data for ${namespace} namespace (unused).`);
                    }
                }
            }
            for (const i in saveDump) {
                newSave.addData(i, saveDump[i]);
                console.log(`Added data to save for ${i} namespace.`);
            }
            this.setLocalStorageSave(newSave.stringify());
            console.log("Saved!");
        } else {
            this.setLocalStorageSave(save.stringify());
            console.log("Saved (with custom Save)!");
        }

        // Update saving notification
        const indicator = document.getElementById("savingIndicator");
        indicator.style.opacity = "1";

        setTimeout(function() {
            indicator.style.opacity = "0";
        }, 1500);
    }

    /**
     * Run the {@link SaveProvider.loadSaveData()} method of all the providers in this instance's handler with their data in localStorage as the param.
     * 
     * {@link Game.loadSaveData} is always run last.
     */
    load() {
        const localStorageSave = this.getLocalStorageSave();
        if (localStorageSave === null) {
            console.warn("Tried to load save but nothing was found in localStorage.");
            return;
        }

        for (const provider of this.saveHandler) {
            const namespace = this.saveHandler.getKeyFromValue(provider)!;
            if (localStorageSave.getNamespaces().includes(namespace) && namespace !== "game") {
                provider.loadSaveData(localStorageSave.getData(namespace));
                console.log(`Loaded save data for "${namespace}" namespace.`);
            }
        }
        if (this.saveHandler.getFromKey("game") !== undefined) { // game should always be there, but just in case it isn't we check
            this.saveHandler.getFromKey("game")!.loadSaveData(localStorageSave.getData("game"));
            console.log("Loaded save data for game namespace.");
        }

        Game.getInstance().AUTOSAVE_INTERVAL.reset();
    }

    export() {
        this.save(); //? should we do this? can we do it a different way that would be better?
        const dataJSON = localStorage.getItem(this.currentSaveName);

        const textToBLOB = new Blob([dataJSON], { type: "text/plain" });

        const newLink = document.createElement("a");
        newLink.download = "save.ccsave";

        if (window.webkitURL !== null) {
            newLink.href = window.webkitURL.createObjectURL(textToBLOB);
        } else {
            newLink.href = window.URL.createObjectURL(textToBLOB);
            newLink.style.display = "none";
            document.body.appendChild(newLink);
        }

        newLink.click(); 
    }

    import() {
        this.save(); //? do we need to do this?
        const input = document.getElementById("importDataInput") as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) {
            alert("somehow, you managed to not select a file. impressive work!");
            return;
        }
        const reader = new FileReader();

        reader.onload = () => {
            const importedData = new Save(JSON.parse(reader.result as string)); //? "as string" way to not? detect mime type from blob make sure js?
            // helper.consoleLogDev("imported data: ");
            // helper.consoleLogDev(importedData.toString());

            const versionBranchToDisplay = branchQuickSwitch("main", "beta", "develop");
            if (importedData.getHeader().versionBranch !== Game.VERSION_BRANCH) {
                new SimplePopup({x: 300, y: 150, text: `This is a save file from another version branch (${versionBranchToDisplay}), which is incompatible with this version. Please use a different file.`, title: "Alert", isError: true});
            }

            this.save(importedData);
            this.load();
        };
        reader.onerror = (e) => alert(`something broke, don't expect me to fix it :D \nerror: ${e}`);

        reader.readAsText(file);
    }

    reset() {
        localStorage.removeItem(this.currentSaveName);
        location.reload();
    }
}

/**
 * Represents an object that can save/load its own data. 
 * 
 * This includes features such as buildings, upgrades, and even mods themselves.
 */
export interface SaveProvider<T> {
    /**
     * This should return your objects savedata, to then be loaded in {@link loadSaveData()}.
     * @returns Anything you want. You will be responsible for parsing whatever the save data is, personally I like saving it as an object, but anything works. You can even do it Orteil-style with pipes and junk (if you know, you know).
     */
    getSaveData(): T;
    /**
     * Whatever you do to load your savadata, do it here. This will be whatever was returned from {@link getSaveData()}.
     */
    loadSaveData(saveData: T): void;
}

interface SaveDataHeader {
    /** Current game version ({@link Game.VERSION}) */
    version: string;
    /** Current game version branch ({@link Game.VERSION_BRANCH}) */
    versionBranch: VersionBranch;
    /** Format for this save. Currently is always set to `4` but major updates to the spec will increment this. */
    format: number
}

interface SaveData {
    header: SaveDataHeader;
    data: Record<string, unknown>
}

export class Save {
    /**
     * Tests if a given object is a valid {@link Save}, and returns a boolean based on if it is
     * @param save The *object* to test the validity of
     */
    static isValidSaveData(save: unknown): save is SaveData {
        if (!isObject(save)) return false;

        const header = save["header"];
        const data = save["data"];

        if (!isObject(header)) return false;

        return (
            typeof header["version"] === "string" ||
            typeof header["versionBranch"] === "string" ||
            typeof header["format"] === "string"
        ) && data !== undefined;
    }

    static VERSION_FORMAT = 4;

    private data: SaveData; //? this is private, which is why we have so many get() methods. should it just be public?
    constructor(data: SaveData=undefined) {
        if (data === undefined) {
            this.data = {
                header: {
                    version: Game.VERSION,
                    versionBranch: Game.VERSION_BRANCH,
                    format: Save.VERSION_FORMAT
                },
                data: {}
            };
        } else {
            this.data = data; //! todo: we might want some error checking here
        }
    }

    addData(namespace: string, value: unknown) {
        this.data.data[namespace] = value;
    }

    getData(namespace: string=undefined): unknown {
        if (namespace) {
            if (this.data.data[namespace] === undefined || this.data.data[namespace] === null) 
                throw new Error(`Tried to obtain data from a Save with a namespace (${namespace}) that does not exist on the save.`);
    
            return this.data.data[namespace];
        } else {
            return this.data.data;
        }
    }
    getHeader() {
        return this.data.header;
    }
    getNamespaces() {
        return Object.keys(this.data.data);
    }

    stringify(): string {
        return JSON.stringify(this.data);
    }
}

/**
 * Takes in a given 0.6 save and manually applies its data, then does a normal save and refreshes the page.
 * @param save The direct local storage key, i.e a stringified object
 */
export function convert06Save(save: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parsedSave: Record<string, any> = JSON.parse(save);

    const game = Game.getInstance();

    game.clickercookie.cookies = parsedSave["core.cookies"];
    game.clickercookie.totalCookies = parsedSave["core.totalCookies"];
    game.clickercookie.cookiesPerSecond = parsedSave["core.cookiesPerSecond"];
    /* buildings */
    //* we do not need to load upgrade cost, it is calculated programmatically
    // keyboard
    game.clickercookie.keyboard.CPSGiven = parsedSave["keyboard.CPSGiven"];
    game.clickercookie.keyboard.CPSGain = parsedSave["keyboard.CPSGain"];
    game.clickercookie.keyboard.bought = parsedSave["keyboard.bought"];
    // grandpa
    game.clickercookie.grandpa.CPSGiven = parsedSave["grandpa.CPSGiven"];
    game.clickercookie.grandpa.CPSGain = parsedSave["grandpa.CPSGain"];
    game.clickercookie.grandpa.bought = parsedSave["grandpa.bought"];
    // ranch
    game.clickercookie.ranch.CPSGiven = parsedSave["ranch.CPSGiven"];
    game.clickercookie.ranch.CPSGain = parsedSave["ranch.CPSGain"];
    game.clickercookie.ranch.bought = parsedSave["ranch.bought"];
    // television
    game.clickercookie.television.CPSGiven = parsedSave["television.CPSGiven"];
    game.clickercookie.television.CPSGain = parsedSave["television.CPSGain"];
    game.clickercookie.television.bought = parsedSave["television.bought"];
    // worker
    game.clickercookie.worker.CPSGiven = parsedSave["worker.CPSGiven"];
    game.clickercookie.worker.CPSGain = parsedSave["worker.CPSGain"];
    game.clickercookie.worker.bought = parsedSave["worker.bought"];
    // wallet
    game.clickercookie.wallet.CPSGiven = parsedSave["wallet.CPSGiven"];
    game.clickercookie.wallet.CPSGain = parsedSave["wallet.CPSGain"];
    game.clickercookie.wallet.bought = parsedSave["wallet.bought"];
    // church
    game.clickercookie.church.CPSGiven = parsedSave["church.CPSGiven"];
    game.clickercookie.church.CPSGain = parsedSave["church.CPSGain"];
    game.clickercookie.church.bought = parsedSave["church.bought"];

    /* upgrades */
    //* important note: we prefix each assignment with !! since these value are numbers and we need them to be booleans. one ! will negate the value and another ! will negate it again, leaving us with the same boolean but instead of a number it's a real boolean. if you don't understand write !!0 and !!1 inside of devtools and see what comes out  
    // keyboard
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "keyboard1"))!.unlocked = !!parsedSave["upgrades.unlocked"][0];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "keyboard1"))!.bought = !!parsedSave["upgrades.bought"][0];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "keyboard2"))!.unlocked = !!parsedSave["upgrades.unlocked"][1];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "keyboard2"))!.bought = !!parsedSave["upgrades.bought"][1];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "keyboard3"))!.unlocked = !!parsedSave["upgrades.unlocked"][2];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "keyboard3"))!.bought = !!parsedSave["upgrades.bought"][2];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "keyboard4"))!.unlocked = !!parsedSave["upgrades.unlocked"][3];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "keyboard4"))!.bought = !!parsedSave["upgrades.bought"][3];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "keyboard5"))!.unlocked = !!parsedSave["upgrades.unlocked"][4];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "keyboard5"))!.bought = !!parsedSave["upgrades.bought"][4];
    // grandpa
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "grandpa1"))!.unlocked = !!parsedSave["upgrades.unlocked"][5];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "grandpa1"))!.bought = !!parsedSave["upgrades.bought"][5];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "grandpa2"))!.unlocked = !!parsedSave["upgrades.unlocked"][6];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "grandpa2"))!.bought = !!parsedSave["upgrades.bought"][6];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "grandpa3"))!.unlocked = !!parsedSave["upgrades.unlocked"][7];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "grandpa3"))!.bought = !!parsedSave["upgrades.bought"][7];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "grandpa4"))!.unlocked = !!parsedSave["upgrades.unlocked"][8];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "grandpa4"))!.bought = !!parsedSave["upgrades.bought"][8];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "grandpa5"))!.unlocked = !!parsedSave["upgrades.unlocked"][9];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "grandpa5"))!.bought = !!parsedSave["upgrades.bought"][9];
    // ranch
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "ranch1"))!.unlocked = !!parsedSave["upgrades.unlocked"][10];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "ranch1"))!.bought = !!parsedSave["upgrades.bought"][10];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "ranch2"))!.unlocked = !!parsedSave["upgrades.unlocked"][11];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "ranch2"))!.bought = !!parsedSave["upgrades.bought"][11];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "ranch3"))!.unlocked = !!parsedSave["upgrades.unlocked"][12];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "ranch3"))!.bought = !!parsedSave["upgrades.bought"][12];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "ranch4"))!.unlocked = !!parsedSave["upgrades.unlocked"][13];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "ranch4"))!.bought = !!parsedSave["upgrades.bought"][13];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "ranch5"))!.unlocked = !!parsedSave["upgrades.unlocked"][14];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "ranch5"))!.bought = !!parsedSave["upgrades.bought"][14];
    // television
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "television1"))!.unlocked = !!parsedSave["upgrades.unlocked"][15];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "television1"))!.bought = !!parsedSave["upgrades.bought"][15];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "television2"))!.unlocked = !!parsedSave["upgrades.unlocked"][16];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "television2"))!.bought = !!parsedSave["upgrades.bought"][16];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "television3"))!.unlocked = !!parsedSave["upgrades.unlocked"][17];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "television3"))!.bought = !!parsedSave["upgrades.bought"][17];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "television4"))!.unlocked = !!parsedSave["upgrades.unlocked"][18];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "television4"))!.bought = !!parsedSave["upgrades.bought"][18];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "television5"))!.unlocked = !!parsedSave["upgrades.unlocked"][19];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "television5"))!.bought = !!parsedSave["upgrades.bought"][19];
    // worker
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "worker1"))!.unlocked = !!parsedSave["upgrades.unlocked"][20];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "worker1"))!.bought = !!parsedSave["upgrades.bought"][20];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "worker2"))!.unlocked = !!parsedSave["upgrades.unlocked"][21];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "worker2"))!.bought = !!parsedSave["upgrades.bought"][21];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "worker3"))!.unlocked = !!parsedSave["upgrades.unlocked"][22];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "worker3"))!.bought = !!parsedSave["upgrades.bought"][22];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "worker4"))!.unlocked = !!parsedSave["upgrades.unlocked"][23];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "worker4"))!.bought = !!parsedSave["upgrades.bought"][23];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "worker5"))!.unlocked = !!parsedSave["upgrades.unlocked"][24];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "worker5"))!.bought = !!parsedSave["upgrades.bought"][24];
    // wallet
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "wallet1"))!.unlocked = !!parsedSave["upgrades.unlocked"][25];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "wallet1"))!.bought = !!parsedSave["upgrades.bought"][25];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "wallet2"))!.unlocked = !!parsedSave["upgrades.unlocked"][26];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "wallet2"))!.bought = !!parsedSave["upgrades.bought"][26];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "wallet3"))!.unlocked = !!parsedSave["upgrades.unlocked"][27];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "wallet3"))!.bought = !!parsedSave["upgrades.bought"][27];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "wallet4"))!.unlocked = !!parsedSave["upgrades.unlocked"][28];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "wallet4"))!.bought = !!parsedSave["upgrades.bought"][28];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "wallet5"))!.unlocked = !!parsedSave["upgrades.unlocked"][29];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "wallet5"))!.bought = !!parsedSave["upgrades.bought"][29];
    // church
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "church1"))!.unlocked = !!parsedSave["upgrades.unlocked"][30];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "church1"))!.bought = !!parsedSave["upgrades.bought"][30];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "church2"))!.unlocked = !!parsedSave["upgrades.unlocked"][31];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "church2"))!.bought = !!parsedSave["upgrades.bought"][31];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "church3"))!.unlocked = !!parsedSave["upgrades.unlocked"][32];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "church3"))!.bought = !!parsedSave["upgrades.bought"][32];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "church4"))!.unlocked = !!parsedSave["upgrades.unlocked"][33];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "church4"))!.bought = !!parsedSave["upgrades.bought"][33];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "church5"))!.unlocked = !!parsedSave["upgrades.unlocked"][34];
    Handlers.UPGRADE.getFromIdentifier(new Identifier("clickercookie", "church5"))!.bought = !!parsedSave["upgrades.bought"][34];

    game.clickercookie.cookiesPerClick = parsedSave["core.cookiesPerClick"];
    game.clickercookie.cookieBeenClickedTimes = parsedSave["core.cookieBeenClickedTimes"];
    game.cheated = !!parsedSave["hasCheated"];
    game.modded = !!parsedSave["isModded"];
    // no won

    game.savinator5000.preserveUnusedNamespacesInSaves = false;
    game.savinator5000.save();
    location.reload(); // probably not required, but this will ensure nothing goes wrong
}