//* Ideally I would put things like BackgroundHandler in personalization.ts but because of lexical declarations we can't do that without getting circular imports as far as I can tell. This is fine.

import { Building, BuildingSave } from "./buildings.js";
import { Handler, Identifier, UniqueKeyHandler } from "./handler.js";
import { url } from "./helper.js";
import { Game } from "./main.js";
import { Mod } from "./mods.js";
import { Background, CurrentlyClickedObject } from "./personalization.js";
import { AdvancedPopup, SimplePopup } from "./popup.js";
import { SaveProvider } from "./saving.js";
import { Upgrade, UpgradeSave } from "./upgrades.js";

/* Personalization */
export class BackgroundHandler extends Handler<Background> {
    private currentBackground: Background;

    /**
     * {@link Handler.register} with modifications to add a new {@link HTMLSelectElement} to the `backgroundSelect`.
     * 
     * @param identifier Identifier for the handler. **Stringified version will be {@link HTMLSelectElement.value} for `backgroundSelect`**.
     */
    override register(identifier: Identifier, background: Background) {
        super.register(identifier, background);

        const option = document.createElement("option");
        option.value = identifier.toString();
        option.innerText = background.name;

        (document.getElementById("backgroundSelect") as HTMLSelectElement).add(option);
    }

    getCurrentBackground() {
        return this.currentBackground;
    }

    /**
     * Set the {@link Personalization.currentBackground} to whatever item that the provided UID is associated with.
     * 
     * This method kinda sucks but we need it to work this way because of how {@link HTMLSelectElement}s work
     * @param value The UID of whatever {@link Background} we want from {@link backgroundHandler}. Usually `backgroundSelect`'s `value`
     */
    setBackground(stringifiedIdentifier: string) {
        const foundObject = Handlers.BACKGROUND.getFromIdentifier(Identifier.fromString(stringifiedIdentifier));
        if (foundObject) {
            this.currentBackground = foundObject;
        } else {
            console.warn(`There is no registered "${stringifiedIdentifier}" background. Defaulting back to "${Game.DEFAULT_BACKGROUND}".`);
            alert(`There is no registered "${stringifiedIdentifier}" background. Defaulting back to "${Game.DEFAULT_BACKGROUND}".`);
            this.setBackground(Game.DEFAULT_BACKGROUND);
            return;
        }

        document.getElementById("leftSide").style.background = url(this.getCurrentBackground().src);
        document.getElementById("middleButtons").style.background = url(this.getCurrentBackground().src);
        document.getElementById("middle").style.background = url(this.getCurrentBackground().src);
        document.getElementById("rightSide").style.background = url(this.getCurrentBackground().src);

        (document.getElementById("backgroundSelect") as HTMLSelectElement).value = stringifiedIdentifier; //* if the thing is set by something other than the HTMLSelectElement change event then we need to make sure the correct obj is listed as the value

        Mod.callKooh("personalization");
        console.log(`Background color set to: ${stringifiedIdentifier}`);
    }
}
export class CurrentlyClickedHandler extends Handler<CurrentlyClickedObject> {
    private currentlyClicked: CurrentlyClickedObject;

    /**
     * {@link Handler.register()} with modifications to add a new {@link HTMLSelectElement} to the `currentlyClickedSelect`.
     * 
     * @param uid UID for the handler. **Will be {@link HTMLSelectElement.value} for `currentlyClickedSelect`**.
     */
    override register(identifier: Identifier, object: CurrentlyClickedObject) {
        super.register(identifier, object);

        const option = document.createElement("option");
        option.value = identifier.toString();
        option.innerText = object.name;

        (document.getElementById("currentlyClickedSelect") as HTMLSelectElement).add(option);
    }

    getCurrentlyClicked() {
        return this.currentlyClicked;
    }

    /**
     * Set the {@link currentlyClicked} to whatever item that the provided UID is associated with.
     * 
     * This method kinda sucks but we need it to work this way because of how {@link HTMLSelectElement}s work
     * @param stringifiedIdentifier The stringified identifier of whatever {@link Background} we want from {@link currentlyClickedHandler}. Usually `currentlyClickedSelect`'s `value`
     */
    setCurrentlyClicked(stringifiedIdentifier: string): void {
        const foundObject = Handlers.CURRENTLY_CLICKED.getFromIdentifier(Identifier.fromString(stringifiedIdentifier));
        if (foundObject) {
            this.currentlyClicked = foundObject;
        } else {
            console.warn(`There is no registered "${stringifiedIdentifier}" currently clicked object. Defaulting back to "${Game.DEFAULT_CURRENTLY_CLICKED_OBJECT}".`);
            alert(`There is no registered "${stringifiedIdentifier}" currently clicked object. Defaulting back to "${Game.DEFAULT_CURRENTLY_CLICKED_OBJECT}".`);
            this.setCurrentlyClicked(Game.DEFAULT_CURRENTLY_CLICKED_OBJECT);
            return;
        }

        const cookie = document.getElementById("cookie") as HTMLImageElement;
        cookie.src = this.currentlyClicked.src; // todo: add check for 404 and fallback
        
        cookie.style.borderRadius = "128px";
        cookie.style.imageRendering = "auto"; // cake is 64x64 so it needs to not be blurry, this resets that
        if (this.currentlyClicked.pixelated === true)
            cookie.style.imageRendering = "pixelated"; // cake is 64x64 so it needs to not be blurry, this resets that
        if (this.currentlyClicked.circular === false)
            cookie.style.borderRadius = "0px";

        (document.getElementById("currentlyClickedSelect") as HTMLSelectElement).value = stringifiedIdentifier; //* if the cc is set by something other than the HTMLSelectElement change event then we need to make sure the correct obj is listed as the value

        Mod.callKooh("personalization");
        console.log(`Currently clicked set to: ${stringifiedIdentifier}`);
    }
}

/* Buildings*/
export class BuildingHandler extends Handler<Building> {
    public get buildingsOwned(): number {
        let bought = 0;
        for (const value of this) {
            bought += value.bought;
        }
        return bought;
    }

    /**
     * Dumps savedata for all registered buildings
     * @param namespace Optional: if present only dump savedata from this namespace
     * @returns savedata as obj in following format: `stringifiedIdentifier: BuildingSave`
     */
    dumpSave(namespace: string=undefined) {
        const saveObj: Record<string, BuildingSave> = {};
        for (const value of (namespace === undefined) ? this : this.getValuesFromNamespace(namespace)) {
            saveObj[this.getKeyFromValue(value)] = value.getSaveData();
        }
        return saveObj;
    }

    /**
     * Apply save data state to all registered buildings
     * @param saveObj The save object to load the data of
     * @param namespace Optional: if present will only load data for buildings of a given namespace.
     */
    loadSave(saveObj: Record<string, BuildingSave>, namespace: string=undefined) {
        for (const stringifiedIdentifier in saveObj) {
            const id = Identifier.fromString(stringifiedIdentifier);

            if (namespace !== undefined && id.namespace !== namespace) continue;

            const building = this.getFromIdentifier(id);

            if (building === undefined) continue; // if buildings are not registered we obviously can't load them. todo: should this warn?

            building.loadSaveData(saveObj[stringifiedIdentifier]);
        }
    }
}

/* Upgrades */
export class UpgradeHandler extends Handler<Upgrade> {
    public get upgradesBought() {
        let bought = 0;
        for (const value of this) {
            if (value.bought === true) {
                bought++;
            }
        }
        return bought;
    }

    updateStatisticUpgrades() {
        for (const upgrade of this) {
            upgrade.setStatisticVisibility(false);
    
            if (upgrade.bought === false) continue;
    
            upgrade.setStatisticVisibility(true);
        }
    }

    destroyAllUpgrades() {
        for (const value of this) {
            value.setVisibility(false);
        }
    }

    /** 
     * This is used to create an upgrade if it is unlocked and not bought. This is distinct from {@link UpgradeHandler.checkUpgradeAvailability()}, in that the purpose of that function is to set it to unlocked if it meets its criteria .
     * 
     * This is really only used in the context of loading, wherein unlocked and unbought upgrades will not yet exist.
     * */
    showUnlockedUpgrades() { //? can we just combine this with checkUpgradeAvailability?
        for (const value of this) {
            if (value.unlocked === true && value.bought !== true)
                value.setVisibility(true);
        }
    }

    /**
     * Goes through every upgrade registered to the {@link UpgradeHandler} and check if it's ready to be created. If it is, then set it to unlocked then run the {@link Upgrade.create()} method on it.
     * 
     * This is distinct from {@link UpgradeHandler.showUnlockedUpgrades()}, in that the purpose of that function is to create an upgrade if it is unlocked and unbought.
     */
    checkUpgradeAvailability() {
        for (const value of this) {
            if (value.condition(Game.getInstance()) && value.unlocked === false) {
                value.setVisibility(true);
                value.unlocked = true;
            }
        }
    }

    /**
     * Dumps savedata for all registered upgrades
     * @param namespace Optional: if present only dump savedata from this namespace
     * @returns savedata as obj in following format: `stringifiedIdentifier: UpgradeSave`
     */
    dumpSave(namespace: string=undefined) {
        const saveObj: Record<string, UpgradeSave> = {};
        for (const value of (namespace === undefined) ? this : this.getValuesFromNamespace(namespace)) {
            saveObj[this.getKeyFromValue(value)] = value.getSaveData();
        }
        return saveObj;
    }

    /**
     * Apply save data state to all registered upgrades
     * @param saveObj The save object to load the data of
     * @param namespace Optional: if present will only load data for upgrades of a given namespace.
     */
    loadSave(saveObj: Record<string, UpgradeSave>, namespace: string=undefined) {
        for (const stringifiedIdentifier in saveObj) {
            const id = Identifier.fromString(stringifiedIdentifier);

            if (namespace !== undefined && id.namespace !== namespace) continue;

            if (this.getFromIdentifier(id) === undefined) continue; // if upgrades are not registered we obviously can't load them. todo: should this warn?

            this.getFromIdentifier(id).loadSaveData(saveObj[stringifiedIdentifier])
        }
    }
}

/* Mod */
export class ModHandler extends UniqueKeyHandler<Mod<any>> {
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
    
        Game.getInstance().isModded = true;

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

            Game.getInstance().isModded = true;

            console.log("Successfully added mod from file: "+file.name);
        };
    }

    public static list() {
        const numberToList = Handlers.MOD.length;

        for (const mod of Handlers.MOD) {
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

    private saveHandler: SaveHandler;

    /**
     * Serves as a wrapper for a {@link SaveHandler} to provide mod-specific functionality.
     * @param saveHandler The {@link SaveHandler} to wrap.
     */
    constructor(saveHandler: SaveHandler) {
        super();

        this.saveHandler = saveHandler;
    }

    /**
     * Register a mod with this instance's {@link saveHandler}.
     * @param uid SHOULD BE YOUR MOD NAMESPACE!
     * @param mod Mod.
     */
    override register(key: string, mod: Mod<any>) {
        //! below will always warn, should that be changed?
        if (this.getFromIdentifier(key) !== undefined) { //* do this before registering so we can get a more user-friendly popup than the console.error that we usually get for this type of error
            new SimplePopup({x: 400, y: 200, title: "Error", text: `The mod namespace "${key}" is already present!`});
            return;
        }

        if (Game.getInstance().initialized) Game.getInstance().savinator5000.save(); // save and load to save any changes made since last save and load so that buildings and upgrades will be loaded for the mod we just added
        
        super.register(key, mod);
        this.saveHandler.register(mod.NAMESPACE, mod);
        document.getElementById("modsNumberLoaded")!.innerText = (Handlers.MOD.length - 1).toString(); //* subtract one so we don't show clickercookie (makes more sense to the user)
        mod.init(); // register their stuff

        if (Game.getInstance().initialized) Game.getInstance().savinator5000.load();
    }
}

export class SaveHandler extends UniqueKeyHandler<SaveProvider<any>> {
    dumpSaveData(): Record<string, unknown> {
        const saveData: Record<string, unknown> = {};
        for (const namespace of this.registered.keys()) {
            saveData[namespace] = this.registered.get(namespace).getSaveData();
        }
        return saveData;
    }

    getProviders() { //! can we avoid this?
        return this.registered;
    }
}

export class Handlers {
    /**
     * our lord & savior, the save handler
     */
    public static readonly SAVE: SaveHandler = new SaveHandler();
    /**
     * our abstracted lord & savior, the mod handler
     * 
     * temp: Many things with the modding system are pretty much "it's a good idea to do this, but if you don't *want* to you don't have to.". This is different, you **MUST** register with the modProvider.
     */
    public static readonly MOD: ModHandler = new ModHandler(this.SAVE);
    public static readonly BUILDING: BuildingHandler = new BuildingHandler();
    public static readonly UPGRADE: UpgradeHandler = new UpgradeHandler();
    public static readonly BACKGROUND: BackgroundHandler = new BackgroundHandler();
    public static readonly CURRENTLY_CLICKED: CurrentlyClickedHandler = new CurrentlyClickedHandler();
}