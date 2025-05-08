/*
Bonjour! This is a totally original game about clicking a cookie. Tread carefully...

If you're a modder, read the docs here: https://github.com/clickercookie/clickercookie.github.io/wiki/Modding

If you're not a modder, still read the docs here: https://github.com/clickercookie/clickercookie.github.io/wiki/Modding
*/

import { createChangelogEntry, versionChangelogs } from "./changelogs.js";
import { branchQuickSwitch, Interval, object2HTML, url } from "./helper.js";
import { expandUpgradesHolder, UpgradeSave } from "./upgrades.js";
import { SaveProvider, Savinator } from "./saving.js";
import { Mod } from "./mods.js"
import ClickerCookie from "./clickercookie.js"
import { SimplePopup } from "./popup.js";
import { Handlers, ModHandler } from "./handlers.js";

import { NewMod } from "./exmod.js"; //* note: this import is intentionally left unused so tsc can find this file and compile it
import { BuildingSave } from "./buildings.js";

// ------------------------------------
// Version Constants
// ------------------------------------
const version: string = "0.7";

// temp dev variables
const dev = {} as {
    devMode: boolean,

    setDevMode(value: boolean | "on" | "off"): void
};

dev.devMode = false;

// Global Events
interface MousePosition {
    x: number;
    y: number;
}
const mousePos: MousePosition = {x: undefined, y: undefined};
window.addEventListener("mousemove", (event) => {
    mousePos.x = event.clientX;
    mousePos.y = event.clientY;
    
    if (Game.IN_DEVELOPMENT)
        document.getElementById("mousePosDevText").innerText = `Mouse Pos: (${mousePos.x}, ${mousePos.y})`;
});

function resizeEventListener() {
    // change middle text heights
    const middleTexts = Array.from(document.querySelectorAll(".middle-main"));
    for (const element of middleTexts) {
        (element as HTMLElement).style.height = window.innerHeight - document.getElementById("middleButtons").offsetHeight+"px";
    }
}
resizeEventListener(); // since we do need certain elements like the middle text to have the correct size without having to resize the window, we call this now
window.addEventListener("resize", resizeEventListener);

const helper = {} as {
    consoleLogDev(str: string): void
};

export enum VersionBranch {
    MAIN = 0,
    BETA = 1,
    DEVELOP = 2
}

type MiddleState = "none" | "stats" | "info" | "options";

export interface GameSaveData {
    hasCheated: boolean;
    isModded: boolean;
    autoSavingAllowed: boolean;

    // personalization
    currentlyClickedObjectKey: string;
    currentBackgroundKey: string;

    upgradesSave: Record<string, UpgradeSave>;
    buildingsSave: Record<string, BuildingSave>;
}

export class Game extends SaveProvider {
    // Important game-wide constants
    public static readonly VERSION: string = version;
    public static readonly VERSION_BRANCH: VersionBranch = (location.pathname == "/develop/index.html" || location.pathname == "/develop") ? 2 : (location.pathname == "/beta/index.html" || location.pathname == "/beta") ? 1 : 0;
    public static readonly IN_DEVELOPMENT: boolean = (location.hostname === "localhost" || location.hostname === "127.0.0.1") ? true : false; // automatically toggles if hosted locally
    public static readonly GITHUB_REPO: string = "https://github.com/clickercookie/clickercookie.github.io";
    public static readonly CREDITS: Record<string, string> = {
        "FifthTundraG": "Creation",
        "potatman4": "Playtesting",
        "Wolfsarecool44": "Playtesting, Emotional Support"
    }
    public static readonly DEFAULT_BACKGROUND: string = "clickercookie:blue";
    public static readonly DEFAULT_CURRENTLY_CLICKED_OBJECT: string = "clickercookie:cookie";

    public static getMousePosition(): MousePosition {
        return mousePos;
    }

    private static readonly _INSTANCE = new Game();
    public static getInstance() {
        return this._INSTANCE;
    }

    /**
     * Switches the current {@link window.location.href} to a given {@link VersionBranch}
     * @param branch The branch to switch to
     */
    public static switchToBranch(branch: VersionBranch) {
        switch (branch) {
        case VersionBranch.MAIN:
            window.location.href = "/";
            break;
        case VersionBranch.BETA:
            window.location.href = "/beta";
            break;
        case VersionBranch.DEVELOP:
            window.location.href = "/develop";
            break;
        }
    }

    /** Said to be the physical manifestation of the cookie gods themselves... */
    public clickercookie: ClickerCookie;

    // self-explainatory-ish things
    private _hasCheated: boolean;
    public get hasCheated() { return this._hasCheated }
    public set hasCheated(bool: boolean) {
        this._hasCheated = bool;
        document.getElementById("ifCheatedStat").style.display = (this._hasCheated) ? "block" : "none";
    }
    private _isModded: boolean;
    public get isModded() { return this._isModded }
    public set isModded(bool: boolean) {
        this._isModded = bool;
        document.getElementById("ifModdedStat").style.display = (this._isModded) ? "block" : "none";
    }
    private _autoSavingAllowed: boolean;
    public get autoSavingAllowed(): boolean { return this._autoSavingAllowed }
    public set autoSavingAllowed(value: boolean) {
        this._autoSavingAllowed = value;
        (document.getElementById("autoSavingToggleSelect") as HTMLSelectElement).value = (this.autoSavingAllowed) ? "on" : "off";
    }

    public savinator5000: Savinator;

    public currentMiddleState: MiddleState;

    public mousePos: {
        x: number,
        y: number
    };

    public initialized: boolean;

    //* The following intervals will be started once init() completes!
    public readonly AUTOSAVE_INTERVAL = new Interval(() => {
        if (!this.autoSavingAllowed) return false;

        this.savinator5000.save();
    }, 60 * 1000).stop();
    public readonly GAME_LOOP_INTERVAL = new Interval(() => {
        this.gameLoop();
    }, 1).stop();
    public readonly CPS_INTERVAL = new Interval(() => {
        this.cookiesPerSecondUpdate();
    }, 1000).stop();

    constructor() {
        super();

        this.mousePos = {
            x: 0,
            y: 0
        };

        this.hasCheated = false;
        this.isModded = false;
        this.autoSavingAllowed = true;

        this.clickercookie = new ClickerCookie();

        this.savinator5000 = new Savinator(Handlers.SAVE);

        this.initialized = false;
    }

    init() {
        //* note: always ensure that the init() method for all mods is loading before Game is. this is the case by default.
        
        if (localStorage.cookies >= 0)
            new SimplePopup({x: 400, y: 200, text: "You are using an extremely outdated saving method. You will have issues with saving now that the new one is implimented. Clicking below will reset your save to the new format. Your old save cannot be restored.", func: () => { localStorage.clear() }, title: "Warning"});

        // todo before 0.7: does betaSave work here? it looks like it does but i need to thoroughly test it
        if (this.savinator5000.getLocalStorageSave() === null) {
            this.savinator5000.save();
            console.warn(`${this.savinator5000.currentSaveName} was null and was automatically reset, if this is your first time playing this is an intended behavior.`);
        }
    
        this.savinator5000.load();
    
        // if saves are old (directly interacts with localStorage because using Savinator.getLocalStorageSave() will make it angry since localStorage doesn't have a Save it has an array)
        if (localStorage.getItem(this.savinator5000.currentSaveName) && localStorage.getItem(this.savinator5000.currentSaveName)[0] === "[" && Game.VERSION_BRANCH === VersionBranch.MAIN) {
            localStorage.setItem(`old05${this.savinator5000.currentSaveName}`, localStorage.getItem(this.savinator5000.currentSaveName));
            new SimplePopup({x: 400, y: 220, text: "You are using a save from the 0.5 release cycle. 0.5 save transfer is no longer supported. Pressing the button below will reset your save.", title: "sorry", func: () => { this.savinator5000.reset(); }});
            return "Save the save!";
        }

        // todo asap: 0.6 save transfer

        Handlers.UPGRADE.updateStatisticUpgrades();

        /* change version branch specific stuff */
        // change title
        document.title = branchQuickSwitch("Clicker Cookie", "Clicker Cookie Beta", "Clicker Cookie Develop");
        // change version displayed
        document.getElementById("versionNumber").innerText = branchQuickSwitch(Game.VERSION, `${Game.VERSION} Beta`, `${Game.VERSION} Develop`);
        document.getElementById("versionSwitchInfoText").innerText = (Game.VERSION_BRANCH === VersionBranch.MAIN) ? "Clicking this will switch to the beta branch" : "Clicking this will switch to the main branch";
        if (Game.VERSION_BRANCH === VersionBranch.BETA || Game.VERSION_BRANCH === VersionBranch.DEVELOP) // show the developer mode switch
            document.getElementById("devForm").style.display = "block";
        
        if (Game.IN_DEVELOPMENT)
            document.title = `cc_${Game.VERSION}_${Game.VERSION_BRANCH}_dev`;

        // set the bottom left github repo icon to link to the github repo
        (document.getElementById("githubHyperlink") as HTMLAnchorElement).href = Game.GITHUB_REPO;
    
        // Changelog Entries, AKA NOT the messiest place ever.
        // this loop goes from big to small because the function needs to be ran from the latest version to the oldest
        for (let entry = versionChangelogs.length - 1; entry >= 0; entry--) {
            createChangelogEntry(versionChangelogs[entry]);
        }
    
        // check for development special stuff
        if (Game.IN_DEVELOPMENT) {
            // quick buttons
            const devDiv = document.createElement("div");
            devDiv.setAttribute("style","padding-left: 3px;");
            
            const devWarning = document.createElement("h4");
            devWarning.innerText = "localhost detected, options below";
            devWarning.setAttribute("style","color:black;");
            devDiv.appendChild(devWarning);
    
            const mousePos = document.createElement("p");
            mousePos.innerText = "Mouse Pos: (?, ?)";
            mousePos.setAttribute("id","mousePosDevText");
            mousePos.setAttribute("style","margin-bottom:0px;");
            devDiv.appendChild(mousePos);
    
            document.getElementById("leftSide").insertBefore(devDiv, document.getElementById("leftSidePush"));
    
            dev.setDevMode(true);
            document.getElementById("offSelectionDev").innerText = "Overwritten";
        }

        // ------- Event Listeners (very long) -------
        // Middle buttons
        document.getElementById("statsButton").addEventListener("click", () => {this.toggleMiddle("stats")});
        document.getElementById("optionsButton").addEventListener("click", () => {this.toggleMiddle("options")});
        document.getElementById("infoButton").addEventListener("click", () => {this.toggleMiddle("info")});
        // middle content
        for (const element of Array.from(document.getElementsByClassName("middle-x"))) { //? i don't like how we have to do this, can we find another way? maybe somehow only one X button? actually we should probably refactor how the entire middle section works... todo: make an issue for that
            element.addEventListener("click", () => {this.toggleMiddle("none")});
        }
        document.getElementById("creditsButton").addEventListener("click", () => {new SimplePopup({x: 320, y: 175, text: object2HTML(Game.CREDITS), title: "Credits"})});
        document.getElementById("backgroundSelect").addEventListener("change", () => {Handlers.BACKGROUND.setBackground((document.getElementById("backgroundSelect") as HTMLFormElement).value)});
        document.getElementById("currentlyClickedSelect").addEventListener("change", () => {Handlers.CURRENTLY_CLICKED.setCurrentlyClicked((document.getElementById("currentlyClickedSelect") as HTMLFormElement).value)});
        document.getElementById("saveButton").addEventListener("click", () => {this.savinator5000.save()});
        document.getElementById("loadButton").addEventListener("click", () => {this.savinator5000.load()});
        document.getElementById("resetSaveButton").addEventListener("click", () => {new SimplePopup({x: 300, y: 150, text: "Are you sure you want to do this?", func: () => { this.savinator5000.reset() }, title: "Warning", backButton: true, isError: true})});
        document.getElementById("exportDataButton").addEventListener("click", () => {this.savinator5000.export()});
        document.getElementById("importDataButton").addEventListener("click", () => {document.getElementById("importDataInput").click()});
        document.getElementById("importDataInput").addEventListener("change", () => {this.savinator5000.import()});
        document.getElementById("autoSavingToggleSelect").addEventListener("change", () => {this.autoSavingAllowed = ((document.getElementById("autoSavingToggleSelect") as HTMLFormElement).value === "on") ? true : false});;
        document.getElementById("addModButton").addEventListener("click", () => {ModHandler.addButtonClicked()});
        document.getElementById("listModsButton").addEventListener("click", () => {ModHandler.listButtonClicked()});
        document.getElementById("devModeSelect").addEventListener("change", () => {dev.setDevMode((document.getElementById("devModeSelect") as HTMLFormElement).value)})
        // upgrades holder
        document.getElementById("upgradesHolder").addEventListener("mouseover", () => {expandUpgradesHolder()});
        document.getElementById("upgradesHolder").addEventListener("mouseout", () => {expandUpgradesHolder(true)});
        // misc
        document.getElementById("cookie").addEventListener("click", () => {this.cookieClicked()});
        if (Game.VERSION_BRANCH === VersionBranch.MAIN) {
            document.getElementById("versionNumber").addEventListener("click", () => { Game.switchToBranch(VersionBranch.BETA) });
        } else { // develop or beta
            document.getElementById("versionNumber").addEventListener("click", () => { Game.switchToBranch(VersionBranch.MAIN) });
        }
        
        document.getElementById("versionNumber").addEventListener("mouseover", () => {versionNumberMousedOver()});
        document.getElementById("versionNumber").addEventListener("mouseout", () => {versionNumberMousedOver(true)});

        // start intervals (should be right at the end)
        this.AUTOSAVE_INTERVAL.start();
        this.CPS_INTERVAL.start();
        this.GAME_LOOP_INTERVAL.start();

        this.initialized= true;
        console.log("Successfully completed initialization.");
    }

    gameLoop() {
        if (!this.initialized) return;

        Handlers.UPGRADE.checkUpgradeAvailability();

        let cps = 0;
        for (const building of Handlers.BUILDING) {
            cps += building.CPSGiven;
        }
        this.clickercookie.cookiesPerSecond = cps;
        
        document.getElementById("totalUpgradesCounter").innerText = Handlers.UPGRADE.length.toString();

        Mod.callKooh("loop");
    }
    
    cookiesPerSecondUpdate() {
        Mod.callKooh("cps");
    }

    cookieClicked() {
        Mod.callKooh("click");
    }

    toggleMiddle(middleButton: MiddleState) {
        const middleTexts: Partial<Record<MiddleState, HTMLElement>> = {
            "info": document.getElementById("infoMiddleText"),
            "options": document.getElementById("optionsMiddleText"),
            "stats": document.getElementById("statsMiddleText")
        }
        
        // set display none on all text
        for (const text of Object.values(middleTexts)) {
            text.style.display = "none";
        }

        if (this.currentMiddleState === middleButton || middleButton === "none") {
            this.currentMiddleState = "none";
            // we already set display to none on all our things
        } else { // middle state is something else
            middleTexts[middleButton].style.display = "block";
            this.currentMiddleState = middleButton;
        }
    }

    getSaveData(): GameSaveData {
        /** savedata is null on first boot */
        const originalUpgradeSave = (this.savinator5000.getLocalStorageSave()) ? (this.savinator5000.getLocalStorageSave().getData("game") as GameSaveData).upgradesSave : {};
        const originalBuildingSave = (this.savinator5000.getLocalStorageSave()) ? (this.savinator5000.getLocalStorageSave().getData("game") as GameSaveData).buildingsSave : {};

        return {
            hasCheated: this.hasCheated,
            isModded: this.isModded,
            autoSavingAllowed: this.autoSavingAllowed,
            
            // personalization
            currentlyClickedObjectKey: Handlers.CURRENTLY_CLICKED.getKeyFromValue(Handlers.CURRENTLY_CLICKED.getCurrentlyClicked()),
            currentBackgroundKey: Handlers.BACKGROUND.getKeyFromValue(Handlers.BACKGROUND.getCurrentBackground()), // todo: make better
        
            upgradesSave: { // merge to preserve unregistered upgrades
                ...originalUpgradeSave,
                ...Handlers.UPGRADE.dumpSave()
            },
            buildingsSave: {
                ...originalBuildingSave,
                ...Handlers.BUILDING.dumpSave()
            }
        }
    }

    loadSaveData(saveData: GameSaveData): void {
        this.hasCheated = saveData.hasCheated;
        this.isModded = saveData.isModded;
        this.autoSavingAllowed = saveData.autoSavingAllowed;

        Handlers.CURRENTLY_CLICKED.setCurrentlyClicked(saveData.currentlyClickedObjectKey);
        Handlers.BACKGROUND.setBackground(saveData.currentBackgroundKey);

        // the following doesn't have anything to do with GameSaveData but will be done here because this spot makes the most sense
        Handlers.UPGRADE.loadSave(saveData.upgradesSave);
        Handlers.BUILDING.loadSave(saveData.buildingsSave);

        Handlers.UPGRADE.destroyAllUpgrades();
        Handlers.UPGRADE.showUnlockedUpgrades();

        document.getElementById("upgradesBoughtCounter").innerText = Handlers.UPGRADE.upgradesBought.toString();
        Handlers.UPGRADE.updateStatisticUpgrades();
    }
}

// dev commands
/**
 * Sets the developer mode status
 * @param value Can either be 1 or "on" to set to True | 0 or "off" to set to False. The "on" and "off" options are there because of the "devForm" submission
 */
dev.setDevMode = function(value: boolean | "on" | "off") {
    if (value === "on")
        dev.devMode = true;
    else if (value === "off")
        dev.devMode = false;
    else
        dev.devMode = value;

    if (dev.devMode === true) {
        console.log("Developer Mode activated.");
        (document.getElementById("devModeSelect") as HTMLSelectElement).disabled = true;
    }
}

// ------------------------------------
// Random Functions
// ------------------------------------
function versionNumberMousedOver(undo=false) {
    if (!undo)
        document.getElementById("versionSwitchInfo").style.display = "block";
    else
        document.getElementById("versionSwitchInfo").style.display = "none";
}

console.log(`you seem smart, how 'bout you contribute to the project? ${Game.GITHUB_REPO}`);

Handlers.SAVE.register("game", Game.getInstance());
Handlers.MOD.register(Game.getInstance().clickercookie.NAMESPACE, Game.getInstance().clickercookie);

// todo: load saved mods here

Game.getInstance().init();

console.log("game:", Game.getInstance());
console.log("mod handler:", Handlers.MOD);