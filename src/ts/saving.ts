import { SaveHandler } from "./handlers.js";
import { branchQuickSwitch } from "./helper.js";
import { Game, VersionBranch } from "./main.js";
import { SimplePopup } from "./popup.js";

export class Savinator {
    private saveHandler: SaveHandler

    // these are useful for debugging when i need to change the name of the local storage key temporarily
    saveName: string;
    betaSaveName: string;
    developSaveName: string;

    public get currentSaveName() {
        return branchQuickSwitch(this.saveName, this.betaSaveName, this.developSaveName);
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
            return new Save(JSON.parse(localStorage.getItem(this.currentSaveName))); // add error checking, this assumes newSave is a save, it might not be!
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
        for (const namespace in providers) { //? should this go over providers or the localStorageSave.getNamespaces()? is there any benefit to one or the other?
            if (localStorageSave.getNamespaces().includes(namespace) && namespace !== "game") { // if the provider namespace is present in the local storage save
                providers.get(namespace).loadSaveData(localStorageSave.getData(namespace));
                console.log(`Loaded save data for ${namespace} namespace.`);
            }
        }
        if (providers.get("game") !== undefined) { // game should always be there, but just in case it isn't we check
            providers.get("game").loadSaveData(localStorageSave.getData("game"));
            console.log(`Loaded save data for game namespace.`);
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
        const file = (document.getElementById("importDataInput") as HTMLInputElement).files[0]; //? should we get the File from the element, or should it be passed as a param to Savinator.import()?
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
        }
        reader.onerror = (e) => alert(`something broke, don't expect me to fix it :D \nerror: ${e}`);

        reader.readAsText(file);
    }

    reset() {
        localStorage.removeItem(this.saveName);
        localStorage.removeItem(this.developSaveName);
        location.reload();
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
    loadSaveData(saveData: unknown): void {

    }
}

interface SaveDataHeader {
    version: string;
    versionBranch: VersionBranch;
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

export function convert06Save(save: string) {
    
}