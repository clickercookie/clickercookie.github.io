// ------------------------------------
// Version Constants
// ------------------------------------
const version: string = "0.7";
const versionBranch: number = (location.pathname == "/beta/beta" || location.pathname == "/beta/beta.html") ? 1 : 0; // 0 is main, 1 is beta
const inDevelopment: boolean = (location.hostname === "localhost" || location.hostname === "127.0.0.1") ? true : false; // automatically toggles if hosted on the local machine

// ------------------------------------
// Imports
// ------------------------------------
import { createChangelogEntry, versionChangelogs } from "./changelogs.js";
import { Interval, object2HTML, url } from "./helper.js";
import { updateUpgradesBoughtStatistic, expandUpgradesHolder } from "./upgrades.js";
import { convert05Save, SaveProvider, Savinator } from "./saving.js";
import { Mod } from "./mods.js"
import ClickerCookie from "./clickercookie.js"
import { SimplePopup } from "./popup.js";
import { Handlers, ModHandler } from "./handlers.js";

import { NewMod } from "./exmod.js"; //* note: this import is intentionally left unused so tsc can find this file and compile it

// ------------------------------------
// Variable & Object Definitions
// ------------------------------------
// dev variables
const dev = {} as {
    devMode: boolean,
    CPSGiven: number,

    setDevMode(value: boolean | "on" | "off"): void,
    setCookies(number: number): void,
    setCPS(number: number): void,
    toggleSaving(): void
};

dev.devMode = false;
dev.CPSGiven = 0;

// middle other occupiers
let statsUp = false;
let infoUp = false;
let optionsUp = false;

// misc
let mobile: boolean; // defined in initialization

interface MousePosition {
    x: number;
    y: number;
}
const mousePos: MousePosition = {x: undefined, y: undefined};
window.addEventListener("mousemove", (event) => {
    mousePos.x = event.clientX;
    mousePos.y = event.clientY;
    
    if (inDevelopment && !mobile)
        document.getElementById("mousePosDevText").innerText = `Mouse Pos: (${mousePos.x}, ${mousePos.y})`;
});

const helper = {} as {
    consoleLogDev(str: string): void
};

enum Versions {
    MAIN = 0,
    BETA = 1
}

type MiddleButton = "stats" | "info" | "options";

interface GameSaveData {
    hasCheated: boolean;
    isModded: boolean;
    autoSavingAllowed: boolean;

    // personalization
    currentlyClickedObjectKey: string;
    currentBackgroundKey: string;
}

export class Game extends SaveProvider {
    // Important game-wide constants
    public static readonly VERSION: string = version;
    public static readonly VERSION_BRANCH: number = versionBranch;
    public static readonly IN_DEVELOPMENT: boolean = inDevelopment;
    public static readonly GITHUB_REPO: string = "https://github.com/clickercookie/clickercookie.github.io";
    public static readonly CREDITS: Record<string, string> = {
        "FifthTundraG": "Creation",
        "potatman4": "Playtesting",
        "Wolfsarecool44": "Playtesting, Emotional Support"
    }
    public static readonly DEFAULT_BACKGROUND: string = "clickercookie:blue";
    public static readonly DEFAULT_CURRENTLY_CLICKED_OBJECT: string = "clickercookie:cookie";

    public static readonly Versions = Versions;
    public static getMousePosition(): MousePosition {
        return mousePos;
    }

    private static readonly _INSTANCE = new Game();
    public static getInstance() {
        return this._INSTANCE;
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

    public mousePos: {
        x: number,
        y: number
    };

    public theGameCanLoopBecauseTheInitializationIsCompleted: boolean;

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

        this.theGameCanLoopBecauseTheInitializationIsCompleted = false;
    }

    init() {
        Mod.callKooh("init"); //* this is done before anything else in Game because ClickerCookie.init adds personalization stuff and that stuff must be registered for a successful load.
        
        if (localStorage.cookies >= 0)
            new SimplePopup({x: 400, y: 200, text: "You are using an extremely outdated saving method. You will have issues with saving now that the new one is implimented. Clicking below will reset your save to the new format. Your old save cannot be restored.", func: () => { localStorage.clear() }, title: "Warning"});

        // todo before 0.7: does betaSave work here? it looks like it does but i need to thoroughly test it
        if (this.savinator5000.getLocalStorageSave() === null) {
            this.savinator5000.save();
            console.warn(`${this.savinator5000.saveName} was null and was automatically reset, if this is your first time playing this is an intended behavior.`);
        }
    
        this.savinator5000.load();
    
        // if saves are old (directly interacts with localStorage because using Savinator.getLocalStorageSave() will make it angry since localStorage doesn't have a Save it has an array)
        if (localStorage.getItem("save") && localStorage.getItem("save")[0] === "[" && Game.VERSION_BRANCH === Game.Versions.MAIN) {
            localStorage.setItem("old05Save", localStorage.getItem("save"));
            new SimplePopup({x: 400, y: 220, text: "so we changed the saving system again, good news, press the button below and it will be transfered to the new format.", title: "oh no", func: () => { convert05Save(this, false) }});
            return "Save the save!";
        }
        if (localStorage.getItem("betaSave") && localStorage.getItem("betaSave")[0] === "[" && Game.VERSION_BRANCH === Game.Versions.BETA) {
            localStorage.setItem("old05BetaSave", localStorage.getItem("betaSave"));
            new SimplePopup({x: 400, y: 220, text: "so we changed the saving system again, good news, press the button below and it will be transfered to the new format.", title: "oh no", func: () => { convert05Save(this, true) }});
            return "Save the save!";
        }
    
        updateUpgradesBoughtStatistic();

        // set the total upgrades bought counter in the Statistics screen
        // document.getElementById("totalUpgradesCounter").innerText = this.upgrades.length.toString(); //! this is no longer working!!!!!!!!!!!!
    
        // change version branch specific stuff
        // change title
        document.title = (Game.VERSION_BRANCH === Game.Versions.MAIN) ? "Clicker Cookie" : "Clicker Cookie Beta";
        // change version displayed
        document.getElementById("versionNumber").innerText = (Game.VERSION_BRANCH) ? `Version: ${Game.VERSION} Beta` : `Version: ${Game.VERSION}`;
        document.getElementById("versionSwitchInfoText").innerText = (Game.VERSION_BRANCH === Game.Versions.MAIN) ? "Clicking this will switch to the beta branch" : "Clicking this will switch to the main branch";
        if (Game.VERSION_BRANCH === Game.Versions.BETA) // show the developer mode switch
            document.getElementById("devForm").style.display = "block";
        
        if (Game.IN_DEVELOPMENT)
            document.title = "Clicker Cookie Dev";

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
            devWarning.appendChild(document.createTextNode("localhost detected, options below"));
            devWarning.setAttribute("style","color:black;");
            devDiv.appendChild(devWarning);
    
            const devResetButton = document.createElement("button");
            devResetButton.appendChild(document.createTextNode("Reset Sava Data"));
            devResetButton.addEventListener("click", () => {this.savinator5000.reset()});
            devDiv.appendChild(devResetButton);
    
            const br1 = document.createElement("br");
            devDiv.appendChild(br1);
    
            const mousePos = document.createElement("p");
            mousePos.appendChild(document.createTextNode("Mouse Pos: (?, ?)"));
            mousePos.setAttribute("id","mousePosDevText");
            mousePos.setAttribute("style","margin-bottom:0px;");
            devDiv.appendChild(mousePos);
    
            const br2 = document.createElement("br");
            devDiv.appendChild(br2);
    
            const devLoadButton = document.createElement("button");
            devLoadButton.appendChild(document.createTextNode("Force Load Save"));
            devLoadButton.addEventListener("click", () => {this.savinator5000.load()});
            devDiv.appendChild(devLoadButton);
    
            const br3 = document.createElement("br");
            devDiv.appendChild(br3);
    
            const mobileOn = document.createElement("button");
            mobileOn.appendChild(document.createTextNode("Goto Mobile Mode"));
            const mobileOnHyperlink = document.createElement("a");
            mobileOnHyperlink.setAttribute("href","../mobile/mobile.html");
            mobileOnHyperlink.appendChild(mobileOn);
            devDiv.appendChild(mobileOnHyperlink);
    
            const br4 = document.createElement("br");
            devDiv.appendChild(br4);
    
            const toggleSaving = document.createElement("button");
            toggleSaving.appendChild(document.createTextNode("Toggle Auto-Saving"));
            toggleSaving.addEventListener("click", () => {dev.toggleSaving()});
            toggleSaving.setAttribute("style","margin-bottom:0px;");
            devDiv.appendChild(toggleSaving);
            const currentSavingStatus = document.createElement("p");
            currentSavingStatus.appendChild(document.createTextNode("saving: true"));
            currentSavingStatus.setAttribute("id","currentSavingStatus");
            currentSavingStatus.setAttribute("style","margin-bottom:0px;");
            devDiv.appendChild(currentSavingStatus);
    
            document.getElementById("leftSide").insertBefore(devDiv, document.getElementById("leftSidePush"));
    
            dev.setDevMode(true);
            document.getElementById("offSelectionDev").innerText = "Overwritten";
        }

        // ------- Event Listeners (very long) -------
        // Middle buttons
        document.getElementById("statsButton").addEventListener("click", () => {toggleMiddle("stats")});
        document.getElementById("optionsButton").addEventListener("click", () => {toggleMiddle("options")});
        document.getElementById("infoButton").addEventListener("click", () => {toggleMiddle("info")});
        // middle content
        for (const element of Array.from(document.getElementsByClassName("middle-x"))) { //? i don't like how we have to do this, can we find another way? maybe somehow only one X button? actually we should probably refactor how the entire middle section works... todo: make an issue for that
            element.addEventListener("click", () => {closeMiddle()});
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
        document.getElementById("versionNumber").addEventListener("click", () => {versionSwitch()});
        document.getElementById("versionNumber").addEventListener("mouseover", () => {versionNumberMousedOver()});
        document.getElementById("versionNumber").addEventListener("mouseout", () => {versionNumberMousedOver(true)});

        // start intervals (should be right at the end)
        this.AUTOSAVE_INTERVAL.start();
        this.CPS_INTERVAL.start();
        this.GAME_LOOP_INTERVAL.start();

        this.theGameCanLoopBecauseTheInitializationIsCompleted = true;
        console.log("Successfully completed initialization.");
    }

    gameLoop() {
        if (!this.theGameCanLoopBecauseTheInitializationIsCompleted) return;

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

    getSaveData(): GameSaveData {
        return {
            hasCheated: this.hasCheated,
            isModded: this.isModded,
            autoSavingAllowed: this.autoSavingAllowed,
            
            // personalization
            currentlyClickedObjectKey: Handlers.CURRENTLY_CLICKED.getKeyFromValue(Handlers.CURRENTLY_CLICKED.getCurrentlyClicked()),
            currentBackgroundKey: Handlers.BACKGROUND.getKeyFromValue(Handlers.BACKGROUND.getCurrentBackground()), // todo: make better
        }
    }

    loadSaveData(saveData: GameSaveData): void {
        this.hasCheated = saveData.hasCheated;
        this.isModded = saveData.isModded;
        this.autoSavingAllowed = saveData.autoSavingAllowed;

        Handlers.CURRENTLY_CLICKED.setCurrentlyClicked(saveData.currentlyClickedObjectKey);
        Handlers.BACKGROUND.setBackground(saveData.currentBackgroundKey);

        // the following doesn't have anything to do with GameSaveData but will be done here because this spot makes the most sense
        Handlers.UPGRADE.destroyAllUpgrades();
        Handlers.UPGRADE.showUnlockedUpgrades();

        document.getElementById("upgradesBoughtCounter").innerText = Handlers.UPGRADE.upgradesBought.toString();
        updateUpgradesBoughtStatistic();
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
dev.setCookies = function(number: number) {
    if (!dev.devMode) return "You need developer mode ON to run this command.";

    Game.getInstance().clickercookie.cookies = number;
    Game.getInstance().clickercookie.totalCookies =+ number;
    Game.getInstance().hasCheated = true;
}
dev.setCPS = function(number: number) {
    if (!dev.devMode) return "You need developer mode ON to run this command.";

    dev.CPSGiven = number;
    Game.getInstance().hasCheated = true;
}

// ------------------------------------
// Helper Functions
// ------------------------------------
helper.consoleLogDev = function(str: string) {
    if (dev.devMode) console.log(str);
}

// ------------------------------------
// Random Functions
// ------------------------------------
function toggleMiddle(param: MiddleButton) { // TODO 0.7: make a cleaner system for this and put it in Game
    const statsMT = document.getElementById("statsMiddleText");
    const infoMT = document.getElementById("infoMiddleText");
    const optionsMT = document.getElementById("optionsMiddleText");
    const middle = document.getElementById("middle");
    statsMT.style.display = "none";
    infoMT.style.display = "none";
    optionsMT.style.display = "none";
    switch (param) {
    case "stats":
        if (statsUp) {
            statsUp = false;
            optionsMT.style.display = "none";
            middle.style.background = url(Handlers.BACKGROUND.getCurrentBackground().src);
        } else {
            optionsUp = false;
            infoUp = false;
            statsUp = true;
            statsMT.style.display = "block";
        }
        break;
    case "info":
        if (infoUp) {
            infoUp = false;
            infoMT.style.display = "none";
            middle.style.background = url(Handlers.BACKGROUND.getCurrentBackground().src);
        } else {
            statsUp = false;
            optionsUp = false;
            infoUp = true;
            infoMT.style.display = "block";
        }
        break;
    case "options":
        if (optionsUp) {
            optionsUp = false;
            optionsMT.style.display = "none";
            middle.style.background = url(Handlers.BACKGROUND.getCurrentBackground().src);
        } else {
            statsUp = false;
            infoUp = false;
            optionsUp = true;
            optionsMT.style.display = "block";
        }
        break;
    }
}
function closeMiddle() {
    optionsUp = false;
    infoUp = false;
    statsUp = false;

    document.getElementById("optionsMiddleText").style.display = "none";
    document.getElementById("statsMiddleText").style.display = "none";
    document.getElementById("infoMiddleText").style.display = "none";
    document.getElementById("middle").style.background = url(Handlers.BACKGROUND.getCurrentBackground().src);
}
function versionNumberMousedOver(undo=false) {
    if (!undo)
        document.getElementById("versionSwitchInfo").style.display = "block";
    else
        document.getElementById("versionSwitchInfo").style.display = "none";
}
function versionSwitch() {
    window.location.href = (Game.VERSION_BRANCH === Game.Versions.MAIN) ? "/beta/beta.html" : "/";
}

//
// Tooltip stuffs
//
const tooltip = {} as {
    html: HTMLDivElement,
    create(x: number, y: number, content: any): string
};
tooltip.html = document.getElementById("tooltip") as HTMLDivElement;

tooltip.create = function(x: number, y: number, content: any) {
    return "this isn't used yet, but 0.7.1 has plans to upgrade the tooltip system, and this will hopefully have functionality";
}

console.log(`you seem smart, how 'bout you contribute to the project? ${Game.GITHUB_REPO}`);

Handlers.SAVE.register("game", Game.getInstance());
Handlers.MOD.register(Game.getInstance().clickercookie.NAMESPACE, Game.getInstance().clickercookie);

// Events
// todo: add to game
function resizeEventListener() {
    // change middle text heights
    const middleTexts = Array.from(document.querySelectorAll(".middle-main"));
    for (const element of middleTexts) {
        (element as HTMLElement).style.height = window.innerHeight - document.getElementById("middleButtons").offsetHeight+"px";
    }
}
resizeEventListener(); // since we do need certain elements like the middle text to have the correct size without having to resize the window, we call this now
window.addEventListener("resize", resizeEventListener);

Game.getInstance().init();

console.log("game:", Game.getInstance());
console.log("mod handler:", Handlers.MOD);