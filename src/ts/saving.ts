import { Game, modHandler } from "./main.js";
import { SimplePopup } from "./popup.js";
import { Upgrade, updateUpgradesBoughtStatistic } from "./upgrades.js";

export const saves = {} as {
    importedData: any,
    allToSave: any[]
    defaultSavedValues: Record<string, any>,
    resetSave(game: Game): void,
    convert05Save(game: Game, isBeta?: boolean, isBetaSaveOld?: boolean): void
};
saves.allToSave = ["core.cookies", "core.totalCookies", "core.cookiesPerSecond", // List of every variable that should be saved, in no particular order.
    "keyboard.CPSGiven","grandpa.CPSGiven","ranch.CPSGiven","television.CPSGiven","worker.CPSGiven","wallet.CPSGiven","church.CPSGiven",
    "keyboard.bought","grandpa.bought","ranch.bought","television.bought","worker.bought","wallet.bought","church.bought",
    "keyboard.CPSGain","grandpa.CPSGain","ranch.CPSGain","television.CPSGain","worker.CPSGain","wallet.CPSGain","church.CPSGain",
    "keyboard.upgradeCost","grandpa.upgradeCost","ranch.upgradeCost","television.upgradeCost","worker.upgradeCost","wallet.upgradeCost","church.upgradeCost",
    "upgrades.upgradesBought",
    "core.cookiesPerClick","core.cookieBeenClickedTimes","core.buildingsOwned","hasCheated","won","isModded","versionBranch"
];
saves.defaultSavedValues = { // Should be self-explanatory. Doesn't have to be ordered like allToSave, but I would appreciate if it was.
    "core.cookies":0, "core.totalCookies":0, "core.cookiesPerSecond":0,
    "keyboard.CPSGiven":0,"grandpa.CPSGiven":0,"ranch.CPSGiven":0,"television.CPSGiven":0,"worker.CPSGiven":0,"wallet.CPSGiven":0,"church.CPSGiven":0,
    "keyboard.bought":0,"grandpa.bought":0,"ranch.bought":0,"television.bought":0,"worker.bought":0,"wallet.bought":0,"church.bought":0,
    "keyboard.CPSGain":0.1,"grandpa.CPSGain":1,"ranch.CPSGain":8,"television.CPSGain":47,"worker.CPSGain":260,"wallet.CPSGain":1440,"church.CPSGain":7800,
    "keyboard.upgradeCost":15,"grandpa.upgradeCost":100,"ranch.upgradeCost":1100,"television.upgradeCost":12000,"worker.upgradeCost":130000,"wallet.upgradeCost":1400000,"church.upgradeCost":20000000,
    "Upgrade.upgradesBought":0,
    "core.cookiesPerClick":1,"core.cookieBeenClickedTimes":0,"core.buildingsOwned":0,"hasCheated":false,"won":0,"isModded":false,"versionBranch":null
};

// ------------------------------------
// Saving
// ------------------------------------
export class Savinator {
    private saveHandler: SaveHandler

    // these are useful for debugging when i need to change the name of the local storage key temporarily
    saveName: string;
    betaSaveName: string;

    /** If this value is false, when you save when a mod is registered with the saveHandler, then reload the page to a state where it isn't, a save will overwrite that mod's data. */
    preserveUnusedNamespacesInSaves: boolean;
    constructor(saveHandler: SaveHandler) {
        this.saveHandler = saveHandler;

        this.preserveUnusedNamespacesInSaves = true;

        this.saveName = "newSave";
        this.betaSaveName = "newBetaSave";
    }

    // these two methods could probably be static
    setLocalStorageSave(value: string) {
        if (Game.VERSION_BRANCH === Game.Versions.MAIN)
            localStorage.setItem(this.saveName, value);
        else
            localStorage.setItem(this.betaSaveName, value);
    }

    getLocalStorageSave(): Save | null { // todo: this function looks ugly
        if (Game.VERSION_BRANCH === Game.Versions.MAIN) {
            if (localStorage.getItem(this.saveName) === null) {
                return null;
            } else {
                return new Save(JSON.parse(localStorage.getItem(this.saveName))); // add error checking, this assumes newSave is a save, it might not be!
            }
        } else {
            if (localStorage.getItem(this.betaSaveName) === null) {
                return null;
            } else {
                return new Save(JSON.parse(localStorage.getItem(this.betaSaveName)));
            }
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
            if (this.preserveUnusedNamespacesInSaves && this.getLocalStorageSave() !== null) { // todo: too many localStorageSave.getNamespaces()
                const localStorageSave = this.getLocalStorageSave();
                for (let i in localStorageSave.getNamespaces()) {
                    if (!(localStorageSave.getNamespaces()[i] in saveDump)) {
                        newSave.addData(localStorageSave.getNamespaces()[i], localStorageSave.getData(localStorageSave.getNamespaces()[i]));
                        console.log(`Preserved data for ${localStorageSave.getNamespaces()[i]} namespace (unused).`);
                    }
                }
            }
            for (let i in saveDump) {
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
        indicator.classList.add("visible");

        setTimeout(function() {
            indicator.classList.remove("visible");
        }, 1500);
    }

    /**
     * Run the {@link SaveProvider.loadSaveData()} method of all the providers in this instance's handler with their data in localStorage as the param.
     * 
     * {@link Game.loadSaveData} is always run last.
     */
    load() {
        const localStorageSave = this.getLocalStorageSave();
        const providers = this.saveHandler.getProviders();
        for (let namespace in providers) { //? should this go over providers or the localStorageSave.getNamespaces()? is there any benefit to one or the other?
            if (localStorageSave.getNamespaces().includes(namespace) && namespace !== "game") { // if the provider namespace is present in the local storage save
                providers[namespace].loadSaveData(localStorageSave.getData(namespace));
                console.log(`Loaded save data for ${namespace} namespace.`);
            }
        }
        if (providers["game"] !== undefined) { // game should always be there, but just in case it isn't we check
            providers["game"].loadSaveData(localStorageSave.getData("game"));
            console.log(`Loaded save data for game namespace.`);
        }
    }

    export() {
        this.save(); //? should we do this? can we do it a different way that would be better?
        const dataJSON = (Game.VERSION_BRANCH === Game.Versions.MAIN) ? localStorage.getItem("newSave") : localStorage.getItem("newBetaSave");

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
        const file = (document.getElementById("importDataInput") as HTMLInputElement).files[0]; //? should we get the File from the element, or should it be passed as a param to Savinator.import()?
        const reader = new FileReader();

        reader.onload = () => {
            const importedData = new Save(JSON.parse(reader.result as string)); //? "as string" way to not? detect mime type from blob make sure js?
            // helper.consoleLogDev("imported data: ");
            // helper.consoleLogDev(importedData.toString());

            const versionBranchToDisplay = (Game.VERSION_BRANCH === Game.Versions.MAIN) ? "beta" : "main"; //! i don't like this variable
            if (importedData.getHeader().versionBranch !== Game.VERSION_BRANCH) {
                new SimplePopup({x: 300, y: 150, text: `This is a save file from another version branch (${versionBranchToDisplay}), which is incompatible with this version. Please use a different file.`, title: "Alert", isError: true});
            }

            this.save(importedData);
            this.load();
        }
        reader.onerror = (e) => alert(`something broke, don't expect me to fix it :D \nerror: ${e}`);

        reader.readAsText(file);
    }
}

export class SaveProvider {
    /**
     * If registered with a {@link SaveHandler}, it will use whatever this function returns as the savedata.
     * @returns Anything you want. You will be responsible for parsing whatever the save data is, personally I like saving it as an object, but anything works. You can even do it Orteil-style with pipes and junk (if you know, you know).
     */
    getSaveData(): unknown {
        return undefined;
    }
    /**
     * Whatever you do to load your savadata, do it here. Whenever {@link Savinator.load} is run, any {@link SaveProvider} registered in Savinator's {@link Savinator.saveHandler} will have this function run.
     */
    loadSaveData(saveData: unknown) {

    }
}
export class SaveHandler {
    private providers: Record<string, SaveProvider>;
    constructor() {
        this.providers = {};
    }

    dumpSaveData(): Record<string, unknown> {
        const saveData: Record<string, unknown> = {};
        for (let i in this.providers) {
            saveData[i] = this.providers[i].getSaveData();
        }
        return saveData;
    }

    loggy() {
        for (let i in this.providers) {
            console.log(this.providers[i].getSaveData())
        }
    }

    registerProvider(namespace: string, provider: SaveProvider) {
        this.providers[namespace] = provider;
    }

    // todo: i don't like this, i don't know if i really want anyone to be able to interact with anything from game like this.
    getProviders() {
        return this.providers;
    }
}


interface SaveDataHeader {
    version: string;
    versionBranch: number;
    format: number
}

interface SaveData {
    header: SaveDataHeader;
    data: Record<any, any>
}

export class Save {
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
            }
        } else {
            this.data = data; //! todo: we might want some error checking here
        }
    }

    addData(namespace: string, value: any) {
        this.data.data[namespace] = value;
    }

    getData(namespace: string): unknown {
        if (this.data.data[namespace] === undefined || this.data.data[namespace] === null) 
            throw new Error(`Tried to obtain data from a Save with a namespace (${namespace}) that does not exist on the save.`);

        return this.data.data[namespace];
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

saves.resetSave = function(game: Game) {// todo: this still needs the 0.7 treatment
    if (Game.VERSION_BRANCH === Game.Versions.MAIN) {
        localStorage.setItem("save",JSON.stringify(saves.defaultSavedValues));
    } else {
        localStorage.setItem("betaSave",JSON.stringify(saves.defaultSavedValues));
    }
    // saves.loadSave(game);
    
    game.clickercookie.grandpa.unlocked = false;
    game.clickercookie.ranch.unlocked = false;
    game.clickercookie.television.unlocked = false;
    game.clickercookie.worker.unlocked = false;
    game.clickercookie.wallet.unlocked = false;
    game.clickercookie.church.unlocked = false;

    for (let i in modHandler.mods) {
        modHandler.mods[i].upgradeHandler.destroyAllUpgrades();
    }
    document.getElementById("upgradesBoughtCounter").innerText = Upgrade.upgradesBought.toString();
    updateUpgradesBoughtStatistic();

    // document.getElementById("win").style.display = "none";

    game.clickercookie.grandpa.setVisibility(false);
    game.clickercookie.ranch.setVisibility(false);
    game.clickercookie.television.setVisibility(false);
    game.clickercookie.worker.setVisibility(false);
    game.clickercookie.wallet.setVisibility(false);
    game.clickercookie.church.setVisibility(false);
}