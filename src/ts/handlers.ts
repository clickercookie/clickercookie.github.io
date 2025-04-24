//* Ideally I would put things like BackgroundHandler in personalization.ts but because of lexical declarations we can't do that without getting circular imports as far as I can tell. This is fine.

import { Building } from "./buildings.js";
import { Handler, Identifier, UniqueKeyHandler } from "./handler.js";
import { url } from "./helper.js";
import { game, Game } from "./main.js";
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
     * @param uid UID for the handler. **Will be {@link HTMLSelectElement.value} for `backgroundSelect`**.
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
export class BuildingHandler extends Handler<Building> {}

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

    /**
     * TODO: NEEDS STATISTIC SUPPORT
     * @param statistic Are we destroying all the upgrades in the Statistics page?
     */
    destroyAllUpgrades(statistic: boolean=false) {
        for (const value of this) {
            value.destroy();
        }
    }

    /** 
     * This is used to create an upgrade if it is unlocked and not bought. This is distinct from {@link UpgradeHandler.checkUpgradeAvailability()}, in that the purpose of that function is to set it to unlocked if it meets its criteria .
     * 
     * This is really only used in the context of loading, wherein unlocked and unbought upgrades will not yet exist.
     * */
    showUnlockedUpgrades() { //? is this still used? isn't this just checkUpgradeAvaliability?
        for (const value of this) {
            if (value.unlocked === true && value.bought !== true)
                // new Upgrade(game, game.UPGRADES_DATA[i]);
                value.create();
        }
    }

    /**
     * Goes through every upgrade registered to the {@link UpgradeHandler} and check if it's ready to be created. If it is, then set it to unlocked then run the {@link Upgrade.create()} method on it.
     * 
     * This is distinct from {@link UpgradeHandler.showUnlockedUpgrades()}, in that the purpose of that function is to create an upgrade if it is unlocked and unbought.
     */
    checkUpgradeAvailability() {
        for (const value of this) {
            if (value.building.bought >= value.buildingsRequired && value.unlocked === false) {
                value.create();
                value.unlocked = true;
            }
        }
    }

    /**
     * Dumps savedata for a given namespace
     * @param namespace The namespace to dump the savadata of
     * @returns savedata
     */
    dumpUpgradesSave(namespace: string) {
        const saveObj: Record<string, UpgradeSave> = {};
        for (const value of this.getValuesFromNamespace(namespace)) {
            saveObj[value.uid] = {
                unlocked: value.unlocked,
                bought: value.bought
            }
        }
        return saveObj;
    }

    loadUpgradesSave(namespace: string, saveObj: Record<string, UpgradeSave>) { // todo: test if works
        for (let i in saveObj) {
            this.getFromIdentifier(new Identifier(namespace, i)).bought = saveObj[i].bought;
            this.getFromIdentifier(new Identifier(namespace, i)).unlocked = saveObj[i].unlocked;
        }
    }
}

/* Mod */
export class ModHandler extends UniqueKeyHandler<Mod> {
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
    override register(key: string, mod: Mod) {
        //! below will always warn, should that be changed?
        if (this.getFromIdentifier(key) !== undefined) { //* do this before registering so we can get a more user-friendly popup than the console.error that we usually get for this type of error
            new SimplePopup({x: 400, y: 200, title: "Error", text: `The mod namespace "${key}" is already present!`});
            return;
        }
        
        super.register(key, mod);
        this.saveHandler.register(mod.NAMESPACE, mod);
        document.getElementById("modsNumberLoaded")!.innerText = (Handlers.MOD.length - 1).toString(); //* subtract one so we don't show clickercookie (makes more sense to the user)
    }
}

//* for technical reasons i don't think this can actually be a UniqueKeyHandler :(
export class SaveHandler {
    private providers: Record<string, SaveProvider>;
    constructor() {
        this.providers = {};
    }

    dumpSaveData(): Record<string, unknown> {
        const saveData: Record<string, unknown> = {};
        for (const namespace in this.providers) {
            saveData[namespace] = this.providers[namespace].getSaveData();
        }
        return saveData;
    }

    register(namespace: string, provider: SaveProvider) {
        this.providers[namespace] = provider;
    }

    getProviders() { //! can we avoid this?
        return this.providers;
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