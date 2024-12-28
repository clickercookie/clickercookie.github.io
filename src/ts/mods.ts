import { Building } from "./buildings.js";
import { popup } from "./helper.js";
import { game } from "./main.js";
import { SaveHandler, SaveProvider } from "./saving.js";
import { UpgradeHandler } from "./upgrades.js";

export class ModHandler {
    private saveHandler: SaveHandler;

    readonly mods: Partial<Record<string, Mod>>;

    constructor(saveHandler: SaveHandler) {
        this.saveHandler = saveHandler;

        this.mods = {};
    }

    register(mod: Mod) {
        this.saveHandler.registerProvider(mod.NAMESPACE, mod);
        this.mods[mod.NAMESPACE] = mod;
    }
}

// This is mostly temporary to get this out of main.ts, modding has yet to have it's turn at a 0.7 refactor.
interface ModsObject {
    numberLoaded: number,
    allMods: string[],

    loadURL(url: string): void,
    loadFile(): void,
    list(): void,
    addModData(id: string, data: any): void,
    addClicked(): void,
    listClicked(): void,
    reloadModsLoadedText(): void
}

type Kooh = "click" | "cps" | "loop" | "init" | "cps";

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
        "loop": []
    }

    static registerKooh(id: Kooh, func: () => void) {
        this.koohs[id].push(func);
    }

    static callKooh(id: Kooh) {
        for (let i in this.koohs[id]) {
            this.koohs[id][i]();
        }
    }

    // -------------------
    // Actual mod stuff
    // -------------------
    /** Mod namespace used for saving */
    public NAMESPACE: string;

    /** When registered, this {@link UpgradeHandler} gets special treatment from {@link Game}, automatically handling things like destruction and unlocks. You probably want to use this. 
     * 
     * One thing it does NOT handle is dumping savedata so do that yourself :D
     */
    public upgradeHandler: UpgradeHandler;

    /** Every building in this array will have it's CPSGiven applied to {@link Game.cookiesPerSecond} 
     * 
     * Note: This will eventually be a BuildingHandler, but until that's implimented this is the solution I've come up with. See #40
    */
    public buildings: Building[];

    constructor(namespace: string) { //? should namespace be a param?
        super();

        this.NAMESPACE = namespace;

        this.upgradeHandler = new UpgradeHandler();
        this.buildings = [];
    }
}

export const mods: ModsObject = {
    numberLoaded: 0,
    /** string[] */
    allMods: [],

    loadURL: function(url: string) { // todo: could url be a URL type?
        const httpCheck = url.slice(0,4);
        if (httpCheck !== "http") { // we want it to be a url, and this works decently well for detecting it, even if it's not foolproof
            popup.createSimple(350,175,"This mod's URL is not valid. Please make sure to include \"http://\" or \"https://\" in the URL, if it was not present already.",false,"default","Error",false,true);
            return false;
        } 
    
        const file = document.createElement("script");
        file.setAttribute("src", url);
        file.setAttribute("type", "text/javascript");
        const modId = mods.numberLoaded + 1;
        file.setAttribute("id", `mod${modId}`);
    
        document.head.appendChild(file);
    
        (document.getElementById("addModURLForm") as HTMLFormElement).reset();
        document.getElementById("importedMessage").style.display = "block";
    
        mods.numberLoaded++;
        game.isModded = true;
        document.getElementById("ifModdedStat")!.innerHTML = "You have activated mods on this playthrough!";
        mods.reloadModsLoadedText();
    },

    loadFile: function() { // add check if mod is valid (mods.addData should return a bool, true for successful)
        const file = (document.getElementById("addModFile") as HTMLInputElement).files[0];
        const reader = new FileReader();
    
        reader.onerror = (e) => alert(`something broke, don't expect me to fix it :D \nerror: ${e}`);
    
        reader.readAsText(file);
        
        reader.onloadend = () => {
            const readFile = reader.result as string;
            
            const script = document.createElement("script");
            script.appendChild(document.createTextNode(readFile));
            script.setAttribute("type","text/javascript");
            const modId = mods.numberLoaded + 1;
            script.setAttribute("id","mod" + modId);
    
            document.head.appendChild(script);
    
            (document.getElementById("addModURLForm") as HTMLFormElement).reset();
            document.getElementById("importedMessage")!.style.display = "block";
    
            mods.numberLoaded++;
            game.isModded = true;
            document.getElementById("ifModdedStat")!.innerHTML = "You have activated mods on this playthrough!";
            mods.reloadModsLoadedText();
        };
    },

    list: function() {
        const numberToList = mods.allMods.length;
    
        for (let i = 0; i < numberToList; i++) {
            const newModItem = document.createElement("div");
            newModItem.setAttribute("class","popup-text mod-in-list");
            newModItem.setAttribute("id",`modList${i}`);
    
            const newModID = document.createElement("small");
            newModID.appendChild(document.createTextNode(`#${i}`));
            newModID.setAttribute("class","mod-id popup-text");
            newModItem.appendChild(newModID);
    
            const newModName = document.createElement("p");
            newModName.appendChild(document.createTextNode(JSON.stringify(mods.allMods[i])));
            newModName.setAttribute("class","popup-text");
            newModItem.appendChild(newModName);
    
            document.getElementById("modsList")!.appendChild(newModItem);
        }
    
        if (numberToList === 0) document.getElementById("noModsMessage")!.style.display = "block";
        if (numberToList > 0) document.getElementById("removeModsMessage")!.style.display = "block";
    },

    addModData: function(id: string, data: {initialization(): void}) { // yes i basically stole and renamed this entire function from cookie clicker's Game.registerMod orteil did it better okay i might seem smart but i'm really not.
        // READ THE DOCS!
        if (mods.allMods.includes(id)) {
            popup.createAdvanced(400,200,"<h3 class='simple-popup-title' style='display:block;'>Error</h3> \
            <p class='popup-text'>This mod's ID is already present!</p> \
            <button onclick='helper.popup.destroyAdvanced()' id='simplePopupButton' class='popup-button' style='margin-top:20px;'>OK</button>");
            mods.numberLoaded--;
            mods.reloadModsLoadedText();
            return false;
        }
        mods.allMods.push(id);
        document.getElementById("ifModdedStat")!.innerHTML = "You have activated mods on this playthrough!";
        game.isModded = true;
        data.initialization();
        console.log(`Loaded mod ${id}`);
    },

    addClicked: function() {
        popup.createAdvanced(500,350,`<h3 class='simple-popup-title' style='display:block;'>Add Mod</h3>
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
        document.getElementById("addModURL").addEventListener("change", () => { this.loadURL((document.getElementById("addModURL") as HTMLInputElement).value) });
        document.getElementById("popupAddModButton").addEventListener("click", () => { popup.destroyAdvanced() }); //* just to let it be known it's called "popupAddModButton" because "addModButton" is already used by the data button
        console.log(document.getElementById("addModButton"))
    },

    listClicked: function() {
        popup.createAdvanced(300,350,`<h3 class='simple-popup-title' style='display:block;'>All Mods</h3>
        <p class='popup-text no-display' id='noModsMessage' style='font-size:13px; margin-top:7px; margin-bottom:0px;'>You have no mods installed!</p>
        <div id='modsList' class='mods-list'></div>
        <small class='popup-text no-display' id='removeModsMessage' style='margin-top:3px;'>To remove mods, refresh your page. (make sure to save!)</small>
        <button id='popupListModsButton' class='popup-button' style='margin-top:20px;'>OK</button>`);
        document.getElementById("popupListModsButton").addEventListener("click", () => { popup.destroyAdvanced() });    

        mods.list();
    },

    reloadModsLoadedText: function() {
        document.getElementById("modsNumberLoaded")!.innerText = `You have ${mods.numberLoaded} mods loaded!`;
    }
}