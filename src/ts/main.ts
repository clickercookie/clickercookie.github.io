// ------------------------------------
// Variable & Object Definitions
// ------------------------------------
const version: string = "0.6";
const versionBranch: number = (location.pathname == "/beta/beta" || location.pathname == "/beta/beta.html") ? 1 : 0; // 0 is main, 1 is beta
const inDevelopment: boolean = (location.hostname === "localhost" || location.hostname === "127.0.0.1") ? true : false; // automatically toggles if hosted on the local machine
const desktop: boolean = false;

// ------------------------------------
// Imports
// ------------------------------------
import { createChangelogEntry, versionChangelogs } from "./changelogs.js";
import { clamp, convertCollectionToArray, capitalize, commaify } from "./helper.js";
import { Upgrade, UPGRADES_DATA, updateUpgradesBoughtStatistic } from "./upgrades.js";
import { hideTooltip } from "./tooltip.js";
import { Building } from "./buildings.js";
import { saves } from "./saving.js";

// ------------------------------------
// Variable & Object Definitions
// ------------------------------------
const personalization = {} as {
    currentBackground: string,
    currentClicked: string,
    currentClickedPlural: string,
    
    setBackground(color: string): void,
    setCurrentClicked(value: string): void
};

personalization.currentBackground = "url(img/backgrounds/background-blue.png)";
personalization.currentClicked = "Cookie";
personalization.currentClickedPlural = "Cookies"; // some words have plural "es" at the end so for grammatical safety this is staying

// upgrades
//* this object will be removed later so it's very bad, this applies to every other objects everywhere-esque thing too
const upgrades = {} as {
    unlocked: number[],
    bought: number[],
    prices: number[],
    names: string[],
    quotes: string[],
    descriptions: string[],
    img: string[],
    upgradesBought: number,
    currentlyShown: number,
    rowsOfUpgrades: number,

    checkUpgradeAvailability(): void,
    clicked(id: number, building: number): void,
    create(id: number, statistic?: boolean): void,
    destroy(id: number): void,
    destroyAll(statistic?: boolean): void,
    expandUpgradesHolder(retract?: boolean): void,
    hovered(id: number, building: number, statistic?: boolean): void,
    showUnlocked(): void,
    updateBoughtStatistic(): void
};

// tad bit complex, documentation can be found here: https://github.com/clickercookie/clickercookie.github.io/wiki/Upgrades
// anything with an asterisk needs to be redone.
upgrades.unlocked = [
    0,0,0,0,0,
    0,0,0,0,0,
    0,0,0,0,0,
    0,0,0,0,0,
    0,0,0,0,0,
    0,0,0,0,0,
    0,0,0,0,0,
];
upgrades.bought = [
    0,0,0,0,0,
    0,0,0,0,0,
    0,0,0,0,0,
    0,0,0,0,0,
    0,0,0,0,0,
    0,0,0,0,0,
    0,0,0,0,0,
];
upgrades.prices = [
    100,500,10000,100000,10000000, // keyboard
    1000,5000,50000,5000000,500000000, // grandpa
    11000,55000,550000,55000000,5500000000, // ranch
    120000,600000,6000000,600000000,60000000000, // television
    1300000,6500000,65000000,6500000000,650000000000, // worker
    14000000,70000000,700000000,70000000000,7000000000000, // wallet
    200000000,1000000000,10000000000,1000000000000,100000000000000 // church
];
upgrades.names = [
    "Reinforced Keys","Obsidian Keys","Osmium Keys","10 finger typing","Macros", // keyboard
    "Hardwood Walking Stick","Rocking Chair","Reading Glasses","Dementia Pills","shotgun", // grandpa
    "Pig Slop","Needle bale","Tractors","Big baconator","Ranch dressing", // ranch
    "Streaming service","98-inch screen","Surround sound","OLED Display","8K resolution", // television
    "Medkits","Hard hats","Fast fingers*","Weight training","Robot workers", // worker
    "200 dollar bills","Credit cards","Tax refund","safe","Wizard\'s wallet", // wallet
    "the pope","Cookie study","Cookie ritual","Cookie gods","Cible", // church
];
upgrades.quotes = [
    "press harder","so heavy they're always pressed","that's very heavy","<i><b>efficiency</b></i>","why press when you don't have to?", // keyboard
    "nonna dat softwood junk","newest addition to the porch*","helps with precise chocolate chip placement","what was i doing again?","grandpa's precious*", // grandpa
    "Wait, what have we been feeding them before now?","talk about a hay in a needlestack","eliminating manual labor since 1892","think giant pig mech fueled by potatoes","wrong ranch.", // ranch
    "cookie-flix","unnecessarily large is an understatement.","it's all around me!","s*** it burned in...","so many pixels!", // television
    "Constant supply of Band-Aids in case of emergency","Keep those skulls safe!","upmost efficient cookie manufacturing*","firmly attach chocolate chips via brute force","robotic precision", // worker
    "I'm sure the federal reserve will be okay with this...*","cookies but digitized","for when you overbake to the IRS*","you can keep your cookies even <b>safe</b>r!!","<b>infinite</b> storage space*", // wallet
    "his holiness will provide many cookies","learning about our baking lord's best recipes","summon cookies from the underworld","Worship them, lest their power overwhelm your mortal form.","Get it? <b>c</b>ookie-b<b>ible</b>!<br><br>I'll see myself out.", // church
];
upgrades.descriptions = [`Multiplys Keyboard and clicking ${personalization.currentClicked.toLowerCase()} production by 2`,"Multiplys Grandpa production by 2","Multiplys Ranch production by 2","Multiplys TV production by 2","Multiplys Worker production by 2","Multiplys Wallet production by 2","Multiplys Church production by 2"];
// image notes
// grandpa4 (dementia pills) is extremely bland
// reading glasses look awful
upgrades.img = [
    "reinforced-keys.png","obsidian-keys.png","osmium-keys.png","10-finger-typing.png","macros.png",
    "hardwood-walking-stick.png","rocking-chair.png","reading-glasses.png","dementia-pills.png","shotgun.png",
    "pig-slop.png","needle-bale.png","tractors.png","big-baconator.png","ranch-dressing.png",
    "streaming-service.png","98-inch-screen.png","surround-sound.png","oled-display.png","8k-display.png",
    "medkits.png","hard-hats.png","fast-fingers.png","weight-training.png","robot-workers.png",
    "200-dollar-bill.png","credit-cards.png","tax-refund.png","safe.png","wizards-wallet.png",
    "the-pope.png","cookie-study.png","cookie-ritual.png","cookie-gods.png","cible.png",
];

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

// mods stuff
const mods = {} as {
    numberLoaded: number,
    allMods: string[],

    loadURL(url: string): void,
    loadFile(): void,
    list(): void,
    addModData(id: string, data: any): void,
    addClicked(): void,
    listClicked(): void,
    reloadModsLoadedText(): void
};

mods.numberLoaded = 0;
mods.allMods = [];

// middle other occupiers
let statsUp = false;
let infoUp = false;
let optionsUp = false;

// misc
let cookieProductionStopped = false;
let won = 0;
let mobile: boolean; // defined in initialization
let savingAllowed = true;

const helper = {} as {
    consoleLogDev(str: string): void,
    popup: {
        createSimple(x: number, y: number, text: string, noButton?: boolean, doWhat?: string, title?: string, backButton?: boolean, isError?: boolean): void
        destroySimple(): void,
        simpleClicked(doWhat: string): void,
        createAdvanced(x: number, y: number, html: string): void,
        destroyAdvanced(): void
    }
};

helper.popup = {} as {
    createSimple(x: number, y: number, text: string, noButton?: boolean, doWhat?: string, title?: string, backButton?: boolean, isError?: boolean): void
    destroySimple(): void,
    simpleClicked(doWhat: string): void,
    createAdvanced(x: number, y: number, html: string): void,
    destroyAdvanced(): void
};

// ------------------------------------
// Initialization and Checks for Errors
// ------------------------------------
// todo: learn about namespaces and see if that would be better for Game
export class Game {
    // version-related constants
    public VERSION: string;
    public VERSION_BRANCH: number;
    public IN_DEVELOPMENT: boolean;

    // self-explainatory-ish things
    public hasCheated: boolean;
    public isModded: boolean;

    // core stuff
    public cookies: number;
    public totalCookies: number;
    public cookiesPerSecond: number;
    public cookiesPerClick: number;
    public cookieBeenClickedTimes: number;
    public buildingsOwned: number;

    // buildings
    public keyboard: Building;
    public grandpa: Building;
    public ranch: Building;
    public television: Building;
    public worker: Building;
    public wallet: Building;
    public church: Building;

    // upgrades
    public upgrades: Upgrade[];

    /** view versions of variables (their main versions have long decimal points) */
    public variableView: {
        cookiesView: string,
        totalCookiesView: string,
        cookiesPerSecondView: string
    };

    public mousePos: {
        x: number,
        y: number
    };

    // classes
    static Versions = class {
        // Private Fields
        static #_MAIN = 0;
        static #_BETA = 1;
    
        // Accessors for "get" functions only (no "set" functions)
        static get MAIN() { return this.#_MAIN; }
        static get BETA() { return this.#_BETA; }
    }

    constructor() {
        this.VERSION = version;
        this.VERSION_BRANCH = versionBranch;
        this.IN_DEVELOPMENT = inDevelopment;

        // buildings and stuff
        this.keyboard = new Building(this, "keyboard","type in cookies",15,0.1,"keyboard.png");
        this.keyboard.unlocked = true;
        this.grandpa = new Building(this, "grandpa","as long as gramps gets a cut",100,1,"grandpa.png");
        this.grandpa.setVisibility(false);
        this.ranch = new Building(this, "ranch","not the dressing kind",1100,8,"ranch.png",true);
        this.ranch.setVisibility(false);
        this.television = new Building(this, "television","hold infomercials on your cookies",12000,47,"tv.png");
        this.television.setVisibility(false);
        this.worker = new Building(this, "worker","cookies via manual labor",130000,260,"worker.png");
        this.worker.setVisibility(false);
        this.wallet = new Building(this, "wallet","more storage space for your vast amount of cookie income",1400000,1440,"wallet.png");
        this.wallet.setVisibility(false);
        this.church = new Building(this, "church","pray to the almighty cookie gods",20000000,7800,"church.png",true);
        this.church.setVisibility(false);

        // initalize variables
        this.cookies = 0;
        this.totalCookies = 0;
        this.cookiesPerSecond = 0;
        this.cookiesPerClick = 1;
        this.cookieBeenClickedTimes = 0;
        this.buildingsOwned = 0;

        this.hasCheated = false;
        this.isModded = false;

        this.variableView = {
            cookiesView: "",
            totalCookiesView: "",
            cookiesPerSecondView: ""
        };
    }

    init() {
        if (isNaN(this.cookies)) {
            saves.resetSave(this);
            console.warn("Cookies were NaN and save was reset.");
        }
    
        if (localStorage.cookies >= 0)
            helper.popup.createSimple(400,200,"You are using an extremely outdated saving method. You will have issues with saving now that the new one is implimented. Clicking below will reset your save to the new format. Your old save cannot be restored.",false,"localStorage.clear()","Warning",false,false);
    
        this.reloadBuildingPrices();
        if (localStorage.getItem("save") == null && versionBranch === 0) {
            localStorage.setItem("save",JSON.stringify(saves.defaultSavedValues));
            console.warn("save was null and was automatically reset, if this is your first time playing this is an intended behavior.");
        }
        if (localStorage.getItem("betaSave") == null && versionBranch === 1) {
            localStorage.setItem("betaSave",JSON.stringify(saves.defaultSavedValues));
            console.warn("betaSave was null and was automatically reset, if this is your first time playing this is an intended behavior.");
        }
    
        saves.loadSave(this);
    
        // if saves are old
        if (localStorage.getItem("save") && localStorage.getItem("save")[0] === "[" && versionBranch === 0) {
            localStorage.setItem("old05Save", localStorage.getItem("save"));
            helper.popup.createAdvanced(400,220,`<h3 class='simple-popup-title' style='display:block;'>oh no</h3>
            <p class='popup-text'>so we changed the saving system again, good news, press the button below and it will be transfered to the new format.</p>
            <div style='display:flex;flex-direction:row;height:40px;'>
            <button onclick='saves.convert05Save(false)' id='simplePopupButton' class='popup-button' style='margin-top:20px;width:auto;margin-right:3px'>Reformat me!</button>
            </div>`);
            return "Save the save!";
        }
        if (localStorage.getItem("betaSave") && localStorage.getItem("betaSave")[0] === "[" && versionBranch === 1) {
            localStorage.setItem("old05BetaSave", localStorage.getItem("betaSave"));
            helper.popup.createAdvanced(400,220,`<h3 class='simple-popup-title' style='display:block;'>oh no</h3>
            <p class='popup-text'>so we changed the saving system again, good news, press the button below and it will be transfered to the new format.</p>
            <div style='display:flex;flex-direction:row;height:40px;'>
            <button onclick='saves.convert05Save(true)' id='simplePopupButton' class='popup-button' style='margin-top:20px;width:auto;margin-right:3px'>Reformat me!</button>
            </div>`);
            return "Save the save!";
        }
        
        if (this.hasCheated)
            document.getElementById("ifCheatedStat").innerText = "You have cheated on this playthrough!";
    
        updateUpgradesBoughtStatistic();

        // set the total upgrades bought counter in the Statistics screen
        document.getElementById("totalUpgradesCounter").innerText = UPGRADES_DATA.length.toString();
    
        // change version branch specific stuff
        // change title
        document.title = (versionBranch) ? "Clicker Cookie Beta" : "Clicker Cookie";
        // change version displayed
        document.getElementById("versionNumber").innerText = (versionBranch) ? `Version: ${version} Beta` : `Version: ${version}`;
        document.getElementById("versionSwitchInfoText").innerText = (versionBranch) ? "Clicking this will switch to the main branch" : "Clicking this will switch to the beta branch";
        if (versionBranch) // show the developer mode switch
            document.getElementById("devForm").style.display = "block";
        
        if (inDevelopment)
            document.title = "Clicker Cookie Dev";
    
        // Changelog Entries, AKA NOT the messiest place ever.
        // this loop goes from big to small because the function needs to be ran from the latest version to the oldest
        for (let entry = versionChangelogs.length - 1; entry >= 0; entry--) {
            createChangelogEntry(versionChangelogs[entry]);
        }
        
        // this would go after data is loaded, but it requires the mobile variable to be assigned a value
        if (this.isModded) {
            document.getElementById("ifModdedStat").innerHTML = "You have activated mods on this playthrough!";
        }
    
        // check for development special stuff
        if (inDevelopment) {
            // quick buttons
            const devDiv = document.createElement("div");
            devDiv.setAttribute("style","padding-left: 3px;");
            
            const devWarning = document.createElement("h4");
            devWarning.appendChild(document.createTextNode("localhost detected, options below"));
            devWarning.setAttribute("style","color:black;");
            devDiv.appendChild(devWarning);
    
            const devResetButton = document.createElement("button");
            devResetButton.appendChild(document.createTextNode("Reset Sava Data"));
            devResetButton.setAttribute("onclick","saves.resetSave()");
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
            devLoadButton.setAttribute("onclick","saves.loadSave()");
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
            toggleSaving.setAttribute("onclick","dev.toggleSaving()");
            toggleSaving.setAttribute("style","margin-bottom:0px;");
            devDiv.appendChild(toggleSaving);
            const currentSavingStatus = document.createElement("p");
            currentSavingStatus.appendChild(document.createTextNode("saving: true"));
            currentSavingStatus.setAttribute("id","currentSavingStatus");
            currentSavingStatus.setAttribute("style","margin-bottom:0px;");
            devDiv.appendChild(currentSavingStatus);
    
            document.getElementById("leftSide").insertBefore(devDiv, document.getElementById("leftSidePush"));
    
            dev.setDevMode(true);
            document.getElementById("offSelectionDev").innerHTML = "Overwritten";
        }
    
        // Holiday Events
        const date = new Date();
        // anniversary
        if (date.getMonth() === 2 && date.getDate() === 3) { // if date is 3/3
            personalization.setCurrentClicked("cake");
            helper.popup.createSimple(350,175,"It's Clicker Cookie's birthday! \nThe cookie has been replaced with a birthday cake, but you can change it back in Options.",false,"default","woo hoo!");
        }
    }

    gameLoop() {
        // todo: can we get this out of game loop?
        this.reloadViewVariables();
    
        // CPS
        this.reloadCPSCounter();
        this.reloadCookieCounter();
    
        upgrades.checkUpgradeAvailability();
    
        // building unlocks
        if (this.totalCookies >= 100) {
            this.grandpa.unlocked = true;
            this.grandpa.setVisibility(true);
        }
        if (this.totalCookies >= 700) {
            this.ranch.unlocked = true;
            this.ranch.setVisibility(true);
        }
        if (this.totalCookies >= 8000) {
            this.television.unlocked = true;
            this.television.setVisibility(true);
        }
        if (this.totalCookies >= 80000) {
            this.worker.unlocked = true;
            this.worker.setVisibility(true);
        }
        if (this.totalCookies >= 700000) {
            this.wallet.unlocked = true;
            this.wallet.setVisibility(true);
        }
        if (this.totalCookies >= 15000000) {
            this.church.unlocked = true;
            this.church.setVisibility(true);
        }
    
        // check for stopped cookie production
        if (cookieProductionStopped)
            this.cookies = 0;
    
        // log to console in case of error
        if (this.cookies < 0) {
            helper.popup.createSimple(300,150,`<i>huh, what just happened?</i> <br> An error occured: ${personalization.currentClickedPlural} are in negative!<br>Please report this to the GitHub accessable in the bottom left corner`,false,"reset cookies","",false,true);
        }
        // stats that need to be updated beforehand
        this.buildingsOwned = this.keyboard.bought + this.grandpa.bought + this.ranch.bought + this.television.bought + this.worker.bought + this.wallet.bought + this.church.bought;
        
        // set statistic page statistics
        if (statsUp) {
            document.getElementById("cookiesStat").innerHTML = `${personalization.currentClickedPlural}: ${this.variableView.cookiesView}`;
            document.getElementById("allTimeCookies").innerHTML = `All Time ${personalization.currentClickedPlural}: ${this.variableView.totalCookiesView}`;
            document.getElementById("cookiesPerSecondStat").innerHTML = `${personalization.currentClickedPlural} Per Second: ${this.variableView.cookiesPerSecondView}`;
            document.getElementById("buildingsOwnedStat").innerHTML = `Buildings Owned: ${commaify(this.buildingsOwned)}`;
            document.getElementById("cookieBeenClickedTimesStat").innerHTML = `Total ${personalization.currentClicked} Clicks: ${this.cookieBeenClickedTimes}`; // move to cookieClicked() later
        }
    
        // set number of bought to bought (not required unless number of bought is set in console)
        document.getElementById("keyboardsBought").innerHTML = this.keyboard.bought.toString();
        document.getElementById("grandpasBought").innerHTML = this.grandpa.bought.toString();
        document.getElementById("ranchesBought").innerHTML = this.ranch.bought.toString();
        document.getElementById("televisionsBought").innerHTML = this.television.bought.toString();
        document.getElementById("workersBought").innerHTML = this.worker.bought.toString();
        document.getElementById("walletsBought").innerHTML = this.wallet.bought.toString();
        document.getElementById("churchesBought").innerHTML = this.church.bought.toString();
    
        this.cookiesPerSecond = this.keyboard.CPSGiven+this.grandpa.CPSGiven+this.ranch.CPSGiven+this.television.CPSGiven+this.worker.CPSGiven+this.wallet.CPSGiven+this.church.CPSGiven+dev.CPSGiven;
    }
    
    cookiesPerSecondUpdate() {
        this.cookies = this.cookies + this.cookiesPerSecond;
        this.totalCookies = this.totalCookies + this.cookiesPerSecond;
        this.reloadCookieCounter();
    }

    reloadCookieCounter() {
        document.getElementById("cookieCounter").innerHTML = `${personalization.currentClickedPlural}: ${this.variableView.cookiesView}`;
    }
    /**
     * doesn't account for modded buildings, at the moment figuring that out is the mod developer's job
     * 
     * todo 0.7: my gut says we can do this without running this in the game loop
     */
    reloadBuildingPrices() { // 
        this.keyboard.reloadPrice();
        this.grandpa.reloadPrice();
        this.ranch.reloadPrice();
        this.television.reloadPrice();
        this.worker.reloadPrice();
        this.wallet.reloadPrice();
        this.church.reloadPrice();
    }
    reloadCPSCounter() {
        document.getElementById("cookiesPerSecondCounter").innerHTML = `${personalization.currentClickedPlural} Per Second: ${game.variableView.cookiesPerSecondView}`;
    }
    reloadViewVariables() { 
        this.variableView.cookiesView = commaify(Math.round(game.cookies * 10) / 10),
        this.variableView.totalCookiesView = commaify(Math.round(game.totalCookies * 10) / 10),
        this.variableView.cookiesPerSecondView = commaify(Math.round(game.cookiesPerSecond * 10) / 10)
    }

    cookieClicked() {
        this.cookies += this.cookiesPerClick;
        this.cookieBeenClickedTimes++;
        this.totalCookies += this.cookiesPerClick;
        this.reloadCookieCounter();
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
        document.getElementById("whiteBackground").style.display = "block";
    }
}
dev.setCookies = function(number: number) {
    if (!dev.devMode) return "You need developer mode ON to run this command.";

    game.cookies = number;
    game.totalCookies =+ number;
    game.hasCheated = true;
    game.reloadViewVariables();
    game.reloadCookieCounter();
    document.getElementById("ifCheatedStat").innerHTML = "You have cheated on this playthrough!";
}
dev.setCPS = function(number: number) {
    if (!dev.devMode) return "You need developer mode ON to run this command.";

    dev.CPSGiven = number;
    game.hasCheated = true;
    game.reloadViewVariables();
    game.reloadCPSCounter();
    document.getElementById("ifCheatedStat").innerHTML = "<b>You have cheated on this playthrough!</b>";
}
dev.toggleSaving = function() { // TODO 0.7: this should be a toggle without dev mode
    if (!this.devMode) return "You need developer mode ON to run this command.";

    savingAllowed = !savingAllowed;

    if (!inDevelopment) return;
    document.getElementById("currentSavingStatus").innerHTML = `saving: ${savingAllowed}`;
}

// ------------------------------------
// Upgrades
// ------------------------------------
upgrades.create = function(id: number, statistic: boolean=false) { // statistic is for creating it in the statistics page
    let building = Math.floor(id / 5);

    const icon = this.img[id]; //? does this need to exist?
    /** is already getFile()-ed so don't use getFile() with this variable */
    const UPGRADE_ICON_PATH = (icon === undefined || icon === null) ? "img/unknown-32-32.png" : `img/upgrades/${icon}`;
    if (icon === undefined || icon === null) { // todo 0.7: add check if a 404 is returned for the upgrade icon, might require async/await shenanigans but whatevs
        console.warn(`An image file for upgrade with ID: ${id} was not defined. Falling back to "unknown" image.`);
    }

    const upgrade = document.createElement("div");
    upgrade.setAttribute("class","upgrade");
    if (statistic) {
        upgrade.setAttribute("id",`upgrade${id}Stats`);
        upgrade.setAttribute("class","upgrade-stats pointer");
        upgrade.setAttribute("onmouseover",`upgrades.hovered(${id},${building},true)`); // for some reason, the element needs onmousemove AND onmouseover so it doesn't flicker, see #24
        upgrade.setAttribute("onmousemove",`upgrades.hovered(${id},${building},true)`); // ^
        upgrade.setAttribute("onmouseout","hideTooltip()");
        upgrade.style.backgroundImage = `url(${UPGRADE_ICON_PATH})`;
    } else {
        upgrade.setAttribute("id",`upgrade${id}`);
        upgrade.setAttribute("onclick",`upgrades.clicked(${id},${building})`);
        upgrade.setAttribute("onmouseover",`upgrades.hovered(${id},${building})`);  // for some reason, the element needs onmousemove AND onmouseover so it doesn't flicker, see #24
        upgrade.setAttribute("onmousemove",`upgrades.hovered(${id},${building})`);
        upgrade.setAttribute("onmouseout","hideTooltip()");
        upgrade.style.backgroundImage = `url(${UPGRADE_ICON_PATH})`;
    }
    
    if (!statistic)
        document.getElementById("upgradesHolder").appendChild(upgrade);
    else
        document.getElementById("upgradesBoughtStatsHolder").appendChild(upgrade);
    
    if (!statistic)
        upgrades.currentlyShown++;
}

upgrades.hovered = function(id: number, building: number, statistic: boolean=false) {
    const tooltip = document.getElementById("tooltip");

    document.getElementById("tooltipProduces").style.display = "none";
    document.getElementById("tooltipProducing").style.display = "none";
    document.getElementById("tooltipDesc").style.display = "block";

    document.getElementById("tooltipName").innerHTML = upgrades.names[id];
    document.getElementById("tooltipPrice").innerHTML = `Price: ${commaify(upgrades.prices[id])}`;
    document.getElementById("tooltipDesc").innerHTML = upgrades.descriptions[building];
    document.getElementById("tooltipQuote").innerHTML = `<i>\"${upgrades.quotes[id]}\"</i>`;

    tooltip.style.display = "block";
    if (statistic === true) { // todo: make the tooltip clamp here
        tooltip.style.left = `${game.mousePos.x}px`;
        tooltip.style.top = `${game.mousePos.y - tooltip.offsetHeight}px`;  // it's minus offsetHeight because we don't want the cursor touching the tooltip
        tooltip.style.borderRightWidth = "3px";
    } else {
        tooltip.style.right = "346px";
        // clamping allows between 0 and the height of the window minus the height of the box. also add one from the height of the box because it doesn't work correctly normally, idk why
        tooltip.style.top = clamp(game.mousePos.y - tooltip.offsetHeight/2,0,window.innerHeight-(tooltip.offsetHeight + 1))+"px";
        tooltip.style.left = "auto"; // when tooltip is a statistic it sets the left property because it won't work correctly with right, this resets that
        tooltip.style.borderRightWidth = "0px";
    }
}

upgrades.checkUpgradeAvailability = function() {
    let runThroughTimes = 0; // buildings.building.bought needs for boughtUnlockRequirements indicies
    const boughtUnlockRequirements = [ // number of buildings bought required to unlock an upgrade in chronological order
        1,5,10,25,50
    ];
    // Keyboards
    for (let i = 0; i <= 5; i++) {
        if (game.keyboard.bought >= boughtUnlockRequirements[runThroughTimes] && upgrades.unlocked[i] == 0) {
            upgrades.unlocked[i] = 1;
            upgrades.create(i);
        }
        runThroughTimes++;
    }
    // Grandpas
    runThroughTimes = 0;
    for (let i = 5; i <= 9; i++) {
        if (game.grandpa.bought >= boughtUnlockRequirements[runThroughTimes] && upgrades.unlocked[i] == 0) {
            upgrades.unlocked[i] = 1;
            upgrades.create(i);
        }
        runThroughTimes++;
    }
    // Ranches
    runThroughTimes = 0;
    for (let i = 10; i <= 14; i++) {
        if (game.ranch.bought >= boughtUnlockRequirements[runThroughTimes] && upgrades.unlocked[i] == 0) {
            upgrades.unlocked[i] = 1;
            upgrades.create(i);
        }
        runThroughTimes++;
    }
    // TVs
    runThroughTimes = 0;
    for (let i = 15; i <= 19; i++) {
        if (game.television.bought >= boughtUnlockRequirements[runThroughTimes] && upgrades.unlocked[i] == 0) {
            upgrades.unlocked[i] = 1;
            upgrades.create(i);
        }
        runThroughTimes++;
    }
    // Workers
    runThroughTimes = 0;
    for (let i = 20; i <= 24; i++) {
        if (game.worker.bought >= boughtUnlockRequirements[runThroughTimes] && upgrades.unlocked[i] == 0) {
            upgrades.unlocked[i] = 1;
            upgrades.create(i);
        }
        runThroughTimes++;
    }
    // Wallets
    runThroughTimes = 0;
    for (let i = 25; i <= 29; i++) {
        if (game.wallet.bought >= boughtUnlockRequirements[runThroughTimes] && upgrades.unlocked[i] == 0) {
            upgrades.unlocked[i] = 1;
            upgrades.create(i);
        }
        runThroughTimes++;
    }
    // Churches
    runThroughTimes = 0;
    for (let i = 30; i <= 34; i++) {
        if (game.church.bought >= boughtUnlockRequirements[runThroughTimes] && upgrades.unlocked[i] == 0) {
            upgrades.unlocked[i] = 1;
            upgrades.create(i);
        }
        runThroughTimes++;
    }
}

// ------------------------------------
// Helper Functions
// ------------------------------------
helper.consoleLogDev = function(str: string) {
    if (dev.devMode) console.log(str);
}

// Popups
helper.popup.createSimple = function(x: number, y: number, text: string, noButton: boolean=false, doWhat: string="default", title: string="", backButton: boolean=false, isError: boolean=false) {
    const popup = document.getElementById("simplePopup") as HTMLDialogElement;

    popup.style.display = "flex";
    popup.showModal();
    popup.style.width = `${x}px`;
    popup.style.height = `${y}px`;

    document.getElementById("simplePopupContent").innerHTML = text;
    document.getElementById("simplePopupButtonDiv").style.width = `${x}px`;
    
    if (title === "") {
        document.getElementById("simplePopupTitle").style.display = "none";
    } else {
        document.getElementById("simplePopupTitle").style.display = "block";
        document.getElementById("simplePopupTitle").innerHTML = title;
    }

    if (noButton) {
        document.getElementById("simplePopupButton").style.display = "none";
    } else {
        document.getElementById("simplePopupButton").style.display = "inline-block";
    }

    if (backButton) {
        document.getElementById("simplePopupBackButton").style.display = "inline-block";
    } else {
        document.getElementById("simplePopupBackButton").style.display = "none";
    }

    if (isError) {
        popup.style.borderColor = "red";
    } else {
        popup.style.borderColor = "black";
    }

    if (doWhat !== "default") {
        document.getElementById("simplePopupButton").setAttribute("onclick",`helper.popup.simpleClicked(\"${doWhat}\")`);
    } else {
        document.getElementById("simplePopupButton").setAttribute("onclick","helper.popup.simpleClicked()");
    }
}
helper.popup.destroySimple = function() {
    const popup = document.getElementById("simplePopup") as HTMLDialogElement;
    popup.style.display = "none";
    popup.close();

    document.getElementById("simplePopupContent").innerHTML = "null";
    document.getElementById("simplePopupButton").style.display = "none";
}
helper.popup.simpleClicked = function(doWhat: string="default") {
    switch (doWhat) {
    case "default":
        helper.popup.destroySimple();
        break;
    case "resetSave()":
        saves.resetSave(game);
        helper.popup.destroySimple();
        break;
    case "localStorage.clear()":
        localStorage.clear();
        helper.popup.destroySimple();
        location.reload();
        break;
    case "reset cookies":
        game.cookies = 0;
        break;
    default:
        alert(`Simple Popup doWhat is invalid, value is: ${doWhat} \nPlease report this to the GitHub accessable in the bottom left corner`);
        this.destroySimple();
    }
}
helper.popup.createAdvanced = function(x: number, y: number, html: string) { // TODO anytime: reimpliment filter toggling, just in case (defo not high priority)
    const advancedPopup = document.getElementById("advancedPopup") as HTMLDialogElement;

    advancedPopup.style.display = "flex";
    advancedPopup.showModal();
    advancedPopup.style.width = `${x}px`;
    advancedPopup.style.height = `${y}px`;

    advancedPopup.innerHTML = html;
}
helper.popup.destroyAdvanced = function() {
    (document.getElementById("advancedPopup") as HTMLDialogElement).close();
    document.getElementById("advancedPopup").style.display = "none";
}

// set areas to different things
personalization.setBackground = function(color: string) {
    personalization.currentBackground = `url(img/backgrounds/background-${color}.png)`;

    document.getElementById("leftSide").style.background = personalization.currentBackground;
    document.getElementById("middleButtons").style.background = personalization.currentBackground;
    document.getElementById("rightSide").style.background = personalization.currentBackground;

    helper.consoleLogDev(`Background color set to: ${color}`);
}
personalization.setCurrentClicked = function(value: string) {
    const cookie = document.getElementById("cookie") as HTMLImageElement;
    try {
        cookie.src = `img/${value}.png`;
    } catch {
        console.warn(`Couldn't find image file for cookie. Tried to assign image file: ${value}.png`);
    }
    personalization.currentClicked = capitalize(value);
    // since some words have a plural "es" at the end of their name and I don't want to make a function to detect that, this
    // function will still have a switch in it for each value, but at a later time this should be changed.
    cookie.style.borderRadius = "128px";
    cookie.style.imageRendering = "auto"; // cake is 64x64 so it needs to not be blurry, this resets that
    switch (value) {
    case "cookie":
        personalization.currentClickedPlural = "Cookies";
        break;
    case "potato":
        personalization.currentClickedPlural = "Potatoes";
        break;
    case "strawberry":
        personalization.currentClickedPlural = "Strawberries";
        break;
    case "cake":
        personalization.currentClickedPlural = "Cakes";
        cookie.style.borderRadius = "0px";
        cookie.style.imageRendering = "pixelated";
        (document.getElementById("currentClickedSelect") as HTMLSelectElement).value = "cake"; // ? why is this here (anniversary event?)
        break;
    default:
        personalization.currentClickedPlural = `${value}s`;
    }
    upgrades.descriptions[0] = `Multiplys Keyboard and clicking ${this.currentClicked} production by 2`;
}

// ------------------------------------
// Random Functions
// ------------------------------------
function toggleMiddle(param: string) { // TODO 0.7: eliminate unnessesary switch statements and general code, ternary statements might work nice but i'm spitballing here
    const statsMT = document.getElementById("statsMiddleText");
    const infoMT = document.getElementById("infoMiddleText");
    const optionsMT = document.getElementById("optionsMiddleText");
    const middle = document.getElementById("middle");
    statsMT.style.display = "none";
    infoMT.style.display = "none";
    optionsMT.style.display = "none";
    if (param == "stats") {
        switch (statsUp) { // this should be changed
        case false:
            optionsUp = false;
            infoUp = false;
            statsUp = true;
            statsMT.style.display = "block";
            break;
        case true:
            statsUp = false;
            optionsMT.style.display = "none";
            middle.style.background = personalization.currentBackground;
            break;
        }
    }
    if (param == "info") {
        switch (infoUp) {
        case false:
            statsUp = false;
            optionsUp = false;
            infoUp = true;
            infoMT.style.display = "block";
            break;
        case true:
            infoUp = false;
            infoMT.style.display = "none";
            middle.style.background = personalization.currentBackground;
            break;
        }
    }
    if (param == "options") {
        switch (optionsUp) {
        case false:
            statsUp = false;
            infoUp = false;
            optionsUp = true;
            optionsMT.style.display = "block";
            break;
        case true:
            optionsUp = false;
            optionsMT.style.display = "none";
            middle.style.background = personalization.currentBackground;
            break;
        }
    }
}
function closeMiddle() {
    optionsUp = false;
    infoUp = false;
    statsUp = false;

    document.getElementById("optionsMiddleText").style.display = "none";
    document.getElementById("statsMiddleText").style.display = "none";
    document.getElementById("infoMiddleText").style.display = "none";
    document.getElementById("middle").style.background = personalization.currentBackground;
}
function versionNumberMousedOver(undo=false) {
    if (!undo)
        document.getElementById("versionSwitchInfo").style.display = "block";
    else
        document.getElementById("versionSwitchInfo").style.display = "none";
}
function versionSwitch() {
    window.location.href = (versionBranch) ? "/" : "/beta/beta.html";
}

// ------------------------------------
// Modding
// ------------------------------------
mods.loadURL = function(url: string) { // todo: could url be a URL type?
    const httpCheck = url.slice(0,4);
    if (httpCheck !== "http") { // we want it to be a url, and this works decently well for detecting it, even if it's not foolproof
        helper.popup.createSimple(350,175,"This mod's URL is not valid. Please make sure to include \"http://\" or \"https://\" in the URL, if it was not present already.",false,"default","Error",false,true);
        return false;
    } 

    const file = document.createElement("script");
    file.setAttribute("src",url);
    file.setAttribute("type","text/javascript");
    const modId = mods.numberLoaded + 1;
    file.setAttribute("id",`mod${modId}`);

    document.head.appendChild(file);

    (document.getElementById("addModURLForm") as HTMLFormElement).reset();
    document.getElementById("importedMessage").style.display = "block";

    mods.numberLoaded++;
    game.isModded = true;
    document.getElementById("ifModdedStat").innerHTML = "You have activated mods on this playthrough!";
    mods.reloadModsLoadedText();
}
mods.loadFile = function() { // add check if mod is valid
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
        document.getElementById("importedMessage").style.display = "block";

        mods.numberLoaded++;
        game.isModded = true;
        document.getElementById("ifModdedStat").innerHTML = "You have activated mods on this playthrough!";
        mods.reloadModsLoadedText();
    };
}

mods.list = function() {
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

        document.getElementById("modsList").appendChild(newModItem);
    }

    if (numberToList === 0) document.getElementById("noModsMessage").style.display = "block";
    if (numberToList > 0) document.getElementById("removeModsMessage").style.display = "block";
}

mods.addModData = function(id: string, data: {initialization(): void}) { // yes i basically stole and renamed this entire function from cookie clicker's Game.registerMod orteil did it better okay i might seem smart but i'm really not.
    // READ THE DOCS!
    if (mods.allMods.includes(id)) {
        helper.popup.createAdvanced(400,200,"<h3 class='simple-popup-title' style='display:block;'>Error</h3> \
        <p class='popup-text'>This mod's ID is already present!</p> \
        <button onclick='helper.popup.destroyAdvanced()' id='simplePopupButton' class='popup-button' style='margin-top:20px;'>OK</button>");
        mods.numberLoaded--;
        mods.reloadModsLoadedText();
        return false;
    }
    mods.allMods.push(id);
    document.getElementById("ifModdedStat").innerHTML = "You have activated mods on this playthrough!";
    game.isModded = true;
    data.initialization();
    console.log(`Loaded mod ${id}`);
}

mods.addClicked = function() {
    helper.popup.createAdvanced(500,350,`<h3 class='simple-popup-title' style='display:block;'>Add Mod</h3>
    <h5 class='popup-text' style='color:red; margin-bottom:3px; margin-top:5px;'>WARNING!</h5>
    <h5 class='popup-text' style='color:red; margin-top:0px; margin-bottom:0px;'>Adding mods without verifying their legitimacy can result in unintended side effects! We are not responsible for any damages that may be caused by mods!</h5>
    <h5 class='popup-text' style='margin-top:5px; margin-bottom:0px;'>For information regarding mods, <a onclick='saves.save()' href='https://github.com/clickercookie/clickercookie.github.io/wiki/Modding' class='blue' target="_blank">read the documentation</a>.</h5>
    <form onsubmit='return false;' id='addModURLForm' style='margin-top:22px;'>
        <label for='addModURL' class='popup-text'>From URL: </label>
        <input id='addModURL' onchange='mods.loadURL(this.value)'>
    </form>
    <form>
        <label for='addModFile' class='popup-text' style='margin-right:0px;'>From File: </label>
        <input type='file' id='addModFile' accept='.js' onchange='mods.loadFile(this.value)' class='popup-text' style='width:86px;'>
    </form>
    <p class='popup-text no-display' id='importedMessage' style='font-size:13px; margin-top:7px; margin-bottom:0px;'>Imported!</p>
    <button onclick='helper.popup.destroyAdvanced()' id='simplePopupButton' class='popup-button' style='margin-top:20px;'>OK</button>`);
}
mods.listClicked = function() {
    helper.popup.createAdvanced(300,350,`<h3 class='simple-popup-title' style='display:block;'>All Mods</h3>
    <p class='popup-text no-display' id='noModsMessage' style='font-size:13px; margin-top:7px; margin-bottom:0px;'>You have no mods installed!</p>
    <div id='modsList' class='mods-list'></div>
    <small class='popup-text no-display' id='removeModsMessage' style='margin-top:3px;'>To remove mods, refresh your page. (make sure to save!)</small>
    <button onclick='helper.popup.destroyAdvanced()' id='simplePopupButton' class='popup-button' style='margin-top:20px;'>OK</button>`);

    mods.list();
}

mods.reloadModsLoadedText = function() {
    document.getElementById("modsNumberLoaded").innerHTML = `You have ${mods.numberLoaded} mods loaded!`;
}

function print() {
    helper.popup.createSimple(250,150,"it's console.log",false,"default","dum dum",false,true);
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
    return "this isn't used yet, but 0.6.1 has plans to upgrade the tooltip system, and this will hopefully have functionality";
}

console.log("you seem smart, how 'bout you contribute to the project? https://github.com/clickercookie/clickercookie.github.io");

const game = new Game();

// timer things
setInterval(() => {
    game.cookiesPerSecondUpdate()
}, 1000);
setInterval(() => {
    game.gameLoop()
}, 1);
setInterval(() => { // auto-saving
    if (!savingAllowed) return false;

    saves.save(game);
}, 60 * 1000); // 60s

// Events
window.addEventListener("mousemove", (event) => {
    game.mousePos = {
        x: event.clientX,
        y: event.clientY
    }
    if (inDevelopment && !mobile)
        document.getElementById("mousePosDevText").innerText = `Mouse Pos: (${game.mousePos.x}, ${game.mousePos.y})`;
});
function resizeEventHandler() { // ? is the term "event handler" right?
    // change middle text heights
    const middleTexts = Array.from(document.querySelectorAll(".middle-main"));
    for (let element in middleTexts) {
        (middleTexts[element] as HTMLElement).style.height = window.innerHeight - document.getElementById("middleButtons").offsetHeight+"px";
    }
}
resizeEventHandler(); // since we do need certain elements like the middle text to have the correct size without having to resize the window, we call this now
window.addEventListener("resize",resizeEventHandler);

game.init();

console.log(game)