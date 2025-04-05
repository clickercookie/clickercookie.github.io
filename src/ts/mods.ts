import { Building, BuildingHandler } from "./buildings.js";
import { Handler } from "./handler.js";
import { game, modHandler } from "./main.js";
import { AdvancedPopup, SimplePopup } from "./popup.js";
import { SaveHandler, SaveProvider } from "./saving.js";
import { UpgradeHandler } from "./upgrades.js";

export class ModHandler extends Handler<Mod> {
    /* Static Methods */
    public static loadURL(url: string) {
        const httpCheck = url.slice(0,4);
        if (httpCheck !== "http") { // we want it to be a url, and this works decently well for detecting it, even if it's not foolproof
            new SimplePopup({x: 350, y: 175, text: "This mod's URL is not valid. Please make sure to include \"http://\" or \"https://\" in the URL, if it was not present already.", title: "Error", isError: true});
            return false;
        }
    
        const file = document.createElement("script");
        file.setAttribute("src", url);
        file.setAttribute("type", "module");
    
        document.head.appendChild(file);

        (document.getElementById("addModURLForm") as HTMLFormElement).reset();
        document.getElementById("importedMessage").style.display = "block";
    
        game.isModded = true;

        console.log("Loaded mod from URL: "+url);
    }

    public static loadFile(file: File) {
        const reader = new FileReader();
    
        reader.onerror = (e) => alert(`something broke, don't expect me to fix it :D \nerror: ${e}`);
    
        reader.readAsText(file);
        
        reader.onloadend = () => {
            const readFile = reader.result as string;
            
            const script = document.createElement("script");
            script.appendChild(document.createTextNode(readFile));
            script.setAttribute("type", "module");
    
            document.head.appendChild(script);
    
            (document.getElementById("addModURLForm") as HTMLFormElement).reset();
            document.getElementById("importedMessage")!.style.display = "block";

            game.isModded = true;

            console.log("Successfully added mod from file: "+file.name);
        };
    }

    public static list() {
        const numberToList = modHandler.length;

        for (const mod of modHandler) {
            if (mod.NAMESPACE === "clickercookie") continue; // let's not confuse the end user too much :)

            const newModItem = document.createElement("div");
            newModItem.className = "popup-text mod-in-list";

                const newModName = document.createElement("p");
                newModName.innerText = mod.NAMESPACE;
                newModName.className = "popup-text";
                newModItem.appendChild(newModName);

            document.getElementById("modsList")!.appendChild(newModItem);
        }

        if (numberToList === 0) document.getElementById("noModsMessage")!.style.display = "block";
        if (numberToList > 0) document.getElementById("removeModsMessage")!.style.display = "block";
    }

    // i dunno where to put these last two
    static addButtonClicked() {
        const popup = new AdvancedPopup(500,350,`<h3 class='simple-popup-title' style='display:block;'>Add Mod</h3>
        <h5 class='popup-text' style='color:red; margin-bottom:3px; margin-top:5px;'>WARNING!</h5>
        <h5 class='popup-text' style='color:red; margin-top:0px; margin-bottom:0px;'>Adding mods without verifying their legitimacy can result in unintended side effects! We are not responsible for any damages that may be caused by mods!</h5>
        <h5 class='popup-text' style='margin-top:5px; margin-bottom:0px;'>For information regarding mods, <a href='https://github.com/clickercookie/clickercookie.github.io/wiki/Modding' class='blue' target="_blank">read the documentation</a>.</h5>
        <form onsubmit='return false;' id='addModURLForm' style='margin-top:22px;'>
            <label for='addModURL' class='popup-text'>From URL: </label>
            <input id='addModURL'>
        </form>
        <form>
            <label for='addModFile' class='popup-text' style='margin-right:0px;'>From File: </label>
            <input type='file' id='addModFile' accept='.js' class='popup-text' style='width:86px;'>
        </form>
        <p class='popup-text no-display' id='importedMessage' style='font-size:13px; margin-top:7px; margin-bottom:0px;'>Imported!</p>
        <button id='popupAddModButton' class='popup-button' style='margin-top:20px;'>OK</button>`);
        document.getElementById("addModURL").addEventListener("change", () => { ModHandler.loadURL((document.getElementById("addModURL") as HTMLInputElement).value) });
        document.getElementById("addModFile").addEventListener("change", () => { ModHandler.loadFile((document.getElementById("addModFile") as HTMLInputElement).files[0]) });
        document.getElementById("popupAddModButton").addEventListener("click", () => { popup.destroy() }); //* just to let it be known it's called "popupAddModButton" because "addModButton" is already used by the data button
    }
    
    static listButtonClicked() {
        const popup = new AdvancedPopup(300,350,`<h3 class='simple-popup-title' style='display:block;'>All Mods</h3>
        <p class='popup-text no-display' id='noModsMessage' style='font-size:13px; margin-top:7px; margin-bottom:0px;'>You have no mods installed!</p>
        <div id='modsList' class='mods-list'></div>
        <small class='popup-text no-display' id='removeModsMessage' style='margin-top:3px;'>To remove mods, refresh your page. (make sure to save!)</small>
        <button id='popupListModsButton' class='popup-button' style='margin-top:20px;'>OK</button>`);
        document.getElementById("popupListModsButton").addEventListener("click", () => { popup.destroy() });    
        ModHandler.list();
    }
    /* Not Static Methods */
    private saveHandler: SaveHandler;

    constructor(saveHandler: SaveHandler) {
        super();

        this.saveHandler = saveHandler;
    }

    /**
     * 
     * @param uid SHOULD BE YOUR MOD NAMESPACE!
     * @param mod 
     */
    override register(uid: string, mod: Mod) {
        //! below will always warn, should that be changed?
        if (this.getFromUID(uid) !== undefined) { //* do this before registering so we can get a more user-friendly popup than the console.error that we usually get for this type of error
            new SimplePopup({x: 400, y: 200, title: "Error", text: `The mod UID "${uid}" is already present!`});
            return;
        }
        
        super.register(uid, mod);
        this.saveHandler.registerProvider(mod.NAMESPACE, mod);
        document.getElementById("modsNumberLoaded")!.innerText = (modHandler.length - 1).toString(); //* subtract one so we don't show clickercookie (makes more sense to the user)
    }
}

type Kooh = "click" | "cps" | "loop" | "init" | "cps" | "personalization";

/**
 * Provides high-level abstractions for mod developers to work with
 */
export class Mod extends SaveProvider {
    // ------------------
    // Koohs
    // ------------------
    static koohs: Record<Kooh, Array<() => void>> = {
        "click": [],
        "cps": [],
        "init": [],
        "loop": [],
        "personalization": []
    }

    static registerKooh(id: Kooh, func: () => void) {
        this.koohs[id].push(func);
    }

    static callKooh(id: Kooh) {
        for (const kooh of this.koohs[id]) {
            kooh();
        }
    }

    // -------------------
    // Actual mod stuff
    // -------------------
    // todo: add metadata for things like mod name and desc to show in the list mods section

    /** Mod namespace used for saving */
    public readonly NAMESPACE: string;

    /** 
     * When registered, this {@link UpgradeHandler} gets special treatment from {@link Game}, automatically handling things like destruction and unlocks. You probably want to use this. 
     * 
     * One thing it does NOT handle is dumping savedata so do that yourself :D
     */
    public upgradeHandler: UpgradeHandler;

    /**
     * Any {@link Building} registered in this handler will get special treatment from {@link Game}, automatically handling things like TODO.
     */
    public buildingHandler: BuildingHandler;

    constructor(namespace: string) { //? should namespace be a param?
        super();

        this.NAMESPACE = namespace;

        this.upgradeHandler = new UpgradeHandler();
        this.buildingHandler = new BuildingHandler();
    }
}