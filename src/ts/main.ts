// ------------------------------------
// Variable & Object Definitions
// ------------------------------------
const version: string = "0.6";
const versionBranch: number = (location.pathname == "/beta/beta" || location.pathname == "/beta/beta.html") ? 1 : 0; // 0 is main, 1 is beta
const inDevelopment: boolean = (location.hostname === "localhost" || location.hostname === "127.0.0.1") ? true : false; // automatically toggles if hosted on the local machine

// ------------------------------------
// Imports
// ------------------------------------
import { createChangelogEntry, versionChangelogs } from "./changelogs.js";
import { convertCollectionToArray, commaify } from "./helper.js";
import { Upgrade, updateUpgradesBoughtStatistic, expandUpgradesHolder, UpgradeData, UpgradeHandler, UpgradeSave } from "./upgrades.js";
import { Building } from "./buildings.js";
import { SaveHandler, SaveProvider, saves, Savinator } from "./saving.js";
import { ModProvider } from "./exmod.js";
import { Personalization } from "./personalization.js";

/**
 * our lord & savior, the save handler
 */
export const saveHandler = new SaveHandler(); //* this thing's position in the script (where it's defined) may change later on. originally it was with game's declaration but we need it in the Game class so it complained about inability to access a lexical declaration so i moved it up here 

// ------------------------------------
// Variable & Object Definitions
// ------------------------------------
// the description of almost every upgrade is the same, but just in case we want to add more upgrades in the future
// a "desc" field has been added to the upgrades array. Most upgrade will just reference a this array, though
const defaultUpgradeDescriptions = {
    keyboard: `Multiplys Keyboard and clicking NULL production by 2`, // we cannot embed Personalization.getCurrentlyClicked() in here anymore since it Personalization.currentlyClicked is not defined until Game.init() 
    grandpa: "Multiplys Grandpa production by 2",
    ranch: "Multiplys Ranch production by 2",
    television: "Multiplys TV production by 2",
    worker: "Multiplys Worker production by 2",
    wallet: "Multiplys Wallet production by 2",
    church: "Multiplys Church production by 2"
};

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
let mobile: boolean; // defined in initialization

const helper = {} as {
    consoleLogDev(str: string): void,
    popup: {
        createSimple(x: number, y: number, text: string, noButton?: boolean, doWhat?: string, title?: string, backButton?: boolean, isError?: boolean): void
        destroySimple(): void,
        simpleClicked(doWhat?: string): void,
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
interface ClickerCookieSaveData {
    version: string;

    // core
    cookies: number;
    totalCookies: number;
    cookiesPerClick: number;
    cookieBeenClickedTimes: number;
    hasCheated: boolean;
    isModded: boolean;

    /* buildings */
    // keyboard
    keyboardsBought: number;
    keyboardCPSGain: number;
    keyboardUpgradeCost: number;
    keyboardCPSGiven: number;
    // grandpa
    grandpasBought: number;
    grandpaCPSGain: number;
    grandpaUpgradeCost: number;
    grandpaCPSGiven: number;
    // ranch
    ranchesBought: number;
    ranchCPSGain: number;
    ranchUpgradeCost: number;
    ranchCPSGiven: number;
    // television
    televisionsBought: number;
    televisionCPSGain: number;
    televisionUpgradeCost: number;
    televisionCPSGiven: number; 
    // worker
    workersBought: number;
    workerCPSGain: number;
    workerUpgradeCost: number;
    workerCPSGiven: number;
    // wallet
    walletsBought: number;
    walletCPSGain: number;
    walletUpgradeCost: number;
    walletCPSGiven: number; 
    // church
    churchesBought: number;
    churchCPSGain: number;
    churchUpgradeCost: number;
    churchCPSGiven: number;

    /* upgrades */
    upgradesBought: number;
    upgradesSave: Record<string, UpgradeSave>

    // personalization
    currentClickedObjectName: string;
    backgroundName: string;
    
    // misc
    autoSavingAllowed: boolean;
}

// todo: learn about namespaces and see if that would be better for Game
export class Game extends SaveProvider {
    // version-related constants
    public static VERSION: string = version;
    public static VERSION_BRANCH: number = versionBranch;
    public static IN_DEVELOPMENT: boolean = inDevelopment;

    // self-explainatory-ish things
    public hasCheated: boolean;
    public isModded: boolean;
    private _autoSavingAllowed: boolean;
    get autoSavingAllowed(): boolean {
        return this._autoSavingAllowed;
    }
    set autoSavingAllowed(value: boolean) {
        this._autoSavingAllowed = value;
        (document.getElementById("autoSavingToggleSelect") as HTMLSelectElement).value = (this.autoSavingAllowed) ? "on" : "off";
    }

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
    public upgradeHandler: UpgradeHandler; //? i want this to be private
    public UPGRADES_DATA: UpgradeData[];

    public savinator5000: Savinator;

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

    public theGameCanLoopBecauseTheInitializationIsCompleted: boolean = false;

    constructor() {
        super();

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

        // upgrades
        this.UPGRADES_DATA = [
            // keyboard
            {
                uid: "cckeyboard1",
                name: "Reinforced Keys",
                quote: "press harder",
                price: 100,
                img: "reinforced-keys.png",
                desc: defaultUpgradeDescriptions.keyboard,
                building: this.keyboard,
                buildingsRequired: 1,
                multiplyCookiesPerClick: true
            },
            {
                uid: "cckeyboard2",
                name: "Obsidian Keys",
                quote: "so heavy they're always pressed",
                price: 500,
                img: "obsidian-keys.png",
                desc: defaultUpgradeDescriptions.keyboard,
                building: this.keyboard,
                buildingsRequired: 5,
                multiplyCookiesPerClick: true
            },
            {
                uid: "cckeyboard3",
                name: "Osmium Keys",
                quote: "that's very heavy",
                price: 10_000,
                img: "osmium-keys.png",
                desc: defaultUpgradeDescriptions.keyboard,
                building: this.keyboard,
                buildingsRequired: 10,
                multiplyCookiesPerClick: true
            },
            {
                uid: "cckeyboard4",
                name: "10 finger typing",
                quote: "<i><b>efficiency</b></i>", //? your 6th grade ict teacher would be so proud
                price: 100_000,
                img: "10-finger-typing.png",
                desc: defaultUpgradeDescriptions.keyboard,
                building: this.keyboard,
                buildingsRequired: 25,
                multiplyCookiesPerClick: true
            },
            {
                uid: "cckeyboard5",
                name: "Macros",
                quote: "why press when you don't have to?",
                price: 1_000_000,
                img: "macros.png",
                desc: defaultUpgradeDescriptions.keyboard,
                building: this.keyboard,
                buildingsRequired: 50,
                multiplyCookiesPerClick: true
            },
            // grandpa
            {
                uid: "ccgrandpa1",
                name: "Hardwood Walking Stick",
                quote: "nonna dat softwood junk",
                price: 1_000,
                img: "hardwood-walking-stick.png",
                desc: defaultUpgradeDescriptions.grandpa,
                building: this.grandpa,
                buildingsRequired: 1
            },
            {
                uid: "ccgrandpa2",
                name: "Rocking Chair",
                quote: "newest addition to the porch*", //? because his butt problems weren't bad enough
                price: 5_000,
                img: "rocking-chair.png",
                desc: defaultUpgradeDescriptions.grandpa,
                building: this.grandpa,
                buildingsRequired: 5
            },
            {
                uid: "ccgrandpa3",
                name: "Reading Glasses",
                quote: "helps with precise chocolate chip placement",
                price: 50_000,
                img: "reading-glasses.png",
                desc: defaultUpgradeDescriptions.grandpa,
                building: this.grandpa,
                buildingsRequired: 10
            },
            {
                uid: "ccgrandpa4",
                name: "Dementia Pills",
                quote: "what was i doing again?",
                price: 5_000_000,
                img: "dementia-pills.png",
                desc: defaultUpgradeDescriptions.grandpa,
                building: this.grandpa,
                buildingsRequired: 25
            },
            {
                uid: "ccgrandpa5",
                name: "shotgun",
                quote: "grandpa's precious*",
                price: 500_000_000,
                img: "shotgun.png",
                desc: defaultUpgradeDescriptions.grandpa,
                building: this.grandpa,
                buildingsRequired: 50
            },
            // ranch
            {
                uid: "ccranch1",
                name: "Pig Slop",
                quote: "Wait, what have we been feeding them before now?*",
                price: 11_000,
                img: "pig-slop.png",
                desc: defaultUpgradeDescriptions.ranch,
                building: this.ranch,
                buildingsRequired: 1
            },
            {
                uid: "ccranch2",
                name: "Needle bale",
                quote: "talk about a hay in a needlestack",
                price: 55_000,
                img: "needle-bale.png",
                desc: defaultUpgradeDescriptions.ranch,
                building: this.ranch,
                buildingsRequired: 5
            },
            {
                uid: "ccranch3",
                name: "Tractors",
                quote: "eliminating manual labor since 1892",
                price: 550_000,
                img: "tractors.png",
                desc: defaultUpgradeDescriptions.ranch,
                building: this.ranch,
                buildingsRequired: 10
            },
            {
                uid: "ccranch4",
                name: "Big baconator",
                quote: "think giant pig mech fueled by potatoes",
                price: 55_000_000,
                img: "big-baconator.png",
                desc: defaultUpgradeDescriptions.ranch,
                building: this.ranch,
                buildingsRequired: 25
            },
            {
                uid: "ccranch5",
                name: "Ranch dressing",
                quote: "Wrong ranch.",
                price: 5_500_000_000,
                img: "ranch-dressing.png",
                desc: defaultUpgradeDescriptions.ranch,
                building: this.ranch,
                buildingsRequired: 50
            },
            // television
            {
                uid: "cctelevision1",
                name: "Streaming service",
                quote: "cookie-flix",
                price: 120_000,
                img: "streaming-service.png",
                desc: defaultUpgradeDescriptions.television,
                building: this.television,
                buildingsRequired: 1
            },
            {
                uid: "cctelevision2",
                name: "98-inch screen",
                quote: "unnecessarily large is an understatement.",
                price: 600_000,
                img: "98-inch-screen.png",
                desc: defaultUpgradeDescriptions.television,
                building: this.television,
                buildingsRequired: 5
            },
            {
                uid: "cctelevision3",
                name: "Surround sound",
                quote: "it's all around me!",
                price: 6_000_000,
                img: "surround-sound.png",
                desc: defaultUpgradeDescriptions.television,
                building: this.television,
                buildingsRequired: 10
            },
            {
                uid: "cctelevision4",
                name: "OLED Display",
                quote: "s*** it burned in...",
                price: 60_0000_000,
                img: "oled-display.png",
                desc: defaultUpgradeDescriptions.television,
                building: this.television,
                buildingsRequired: 25
            },
            {
                uid: "cctelevision5",
                name: "8K resolution",
                quote: "so many pixels!",
                price: 60_000_000_000,
                img: "8k-resolution.png",
                desc: defaultUpgradeDescriptions.television,
                building: this.television,
                buildingsRequired: 50
            },
            // worker
            {
                uid: "ccworker1",
                name: "Medkits",
                quote: "Constant supply of Band-Aids in case of emergency",
                price: 1_300_000,
                img: "medkits.png",
                desc: defaultUpgradeDescriptions.worker,
                building: this.worker,
                buildingsRequired: 1
            },
            {
                uid: "ccworker2",
                name: "Hard hats",
                quote: "Keep those skulls safe!*",
                price: 6_500_000,
                img: "hard-hats.png",
                desc: defaultUpgradeDescriptions.worker,
                building: this.worker,
                buildingsRequired: 5
            },
            {
                uid: "ccworker3",
                name: "Fast fingers*",
                quote: "upmost efficient cookie manufacturing*",
                price: 65_000_000,
                img: "fast-fingers.png",
                desc: defaultUpgradeDescriptions.worker,
                building: this.worker,
                buildingsRequired: 10
            },
            {
                uid: "ccworker4",
                name: "Weight training",
                quote: "firmly attach chocolate chips via brute force",
                price: 6_500_000_000,
                img: "weight-training.png",
                desc: defaultUpgradeDescriptions.worker,
                building: this.worker,
                buildingsRequired: 25
            },
            {
                uid: "ccworker5",
                name: "Robot workers",
                quote: "robotic precision",
                price: 650_000_000_000,
                img: "robot-workers.png",
                desc: defaultUpgradeDescriptions.worker,
                building: this.worker,
                buildingsRequired: 50
            },
            // wallet
            {
                uid: "ccwallet1",
                name: "200 dollar bills",
                quote: "I'm sure the federal reserve will be okay with this...*",
                price: 14_000_000,
                img: "200-dollar-bills.png",
                desc: defaultUpgradeDescriptions.wallet,
                building: this.wallet,
                buildingsRequired: 1
            },
            {
                uid: "ccwallet2",
                name: "Credit cards",
                quote: "cookies but digitized",
                price: 70_000_000,
                img: "credit-cards.png",
                desc: defaultUpgradeDescriptions.wallet,
                building: this.wallet,
                buildingsRequired: 5
            },
            {
                uid: "ccwallet3",
                name: "Tax refund",
                quote: "for when you overbake to the IRS*",
                price: 700_000_000,
                img: "tax-refund.png",
                desc: defaultUpgradeDescriptions.wallet,
                building: this.wallet,
                buildingsRequired: 10
            },
            {
                uid: "ccwallet4",
                name: "safe",
                quote: "you can keep your cookies even <b>safe</b>r!!",
                price: 70_000_000_000,
                img: "safe.png",
                desc: defaultUpgradeDescriptions.wallet,
                building: this.wallet,
                buildingsRequired: 25
            },
            {
                uid: "ccwallet5",
                name: "Wizard\'s wallet",
                quote: "<b>infinite</b> storage space*",
                price: 7_000_000_000_000,
                img: "wizards-wallet.png",
                desc: defaultUpgradeDescriptions.wallet,
                building: this.wallet,
                buildingsRequired: 50
            },
            // church
            {
                uid: "ccchurch1",
                name: "the pope",
                quote: "his holiness will provide many cookies",
                price: 200_000_000,
                img: "the-pope.png",
                desc: defaultUpgradeDescriptions.church,
                building: this.church,
                buildingsRequired: 1
            },
            {
                uid: "ccchurch2",
                name: "Cookie study",
                quote: "learning about our baking lord's best recipes",
                price: 1_000_000_000,
                img: "cookie-study.png",
                desc: defaultUpgradeDescriptions.church,
                building: this.church,
                buildingsRequired: 5
            },
            {
                uid: "ccchurch3",
                name: "Cookie ritual",
                quote: "summon cookies from the underworld",
                price: 10_000_000_000,
                img: "cookie-ritual.png",
                desc: defaultUpgradeDescriptions.church,
                building: this.church,
                buildingsRequired: 10
            },
            {
                uid: "ccchurch4",
                name: "Cookie gods",
                quote: "Worship them, lest their power overwhelm your mortal form.",
                price: 1_000_000_000_000,
                img: "cookie-gods.png",
                desc: defaultUpgradeDescriptions.church,
                building: this.church,
                buildingsRequired: 25
            },
            {
                uid: "ccchurch5",
                name: "Cible",
                quote: "Get it? <b>c</b>ookie-b<b>ible</b>!<br><br>I'll see myself out.",
                price: 100_000_000_000_000,
                img: "cible.png",
                desc: defaultUpgradeDescriptions.church,
                building: this.church,
                buildingsRequired: 50
            }
        ];
        this.upgradeHandler = new UpgradeHandler();

        for (let i in this.UPGRADES_DATA) {
            this.upgradeHandler.register(new Upgrade(this, this.UPGRADES_DATA[i]));
        }

        // initalize variables
        this.cookies = 0;
        this.totalCookies = 0;
        this.cookiesPerSecond = 0;
        this.cookiesPerClick = 1;
        this.cookieBeenClickedTimes = 0;
        this.buildingsOwned = 0;

        this.hasCheated = false;
        this.isModded = false;
        this.autoSavingAllowed = true;

        this.variableView = {
            cookiesView: "",
            totalCookiesView: "",
            cookiesPerSecondView: ""
        };

        this.savinator5000 = new Savinator(saveHandler);
    }

    init() {
        // Register personalization things (must be before save load because loading requires these to be registered to set them)
        Personalization.registerObject({name: "Cookie", namePlural: "Cookies", src: "img/cookie.png"});
        Personalization.registerObject({name: "Potato", namePlural: "Potatoes", src: "img/potato.png"});
        Personalization.registerObject({name: "Strawberry", namePlural: "Strawberries", src: "img/strawberry.png"});
        Personalization.registerObject({name: "Cake", namePlural: "Cakes", src: "img/cake.png", circular: false, pixelated: true});
        Personalization.registerBackground({name: "blue", displayName: "Blue", src: "img/backgrounds/background-blue.png"});
        Personalization.registerBackground({name: "green", displayName: "Green", src: "img/backgrounds/background-green.png"});
        Personalization.registerBackground({name: "gray", displayName: "Gray", src: "img/backgrounds/background-gray.png"});
        Personalization.registerBackground({name: "purple", displayName: "Purple", src: "img/backgrounds/background-purple.png"});
        Personalization.registerBackground({name: "darkblue", displayName: "Dark Blue", src: "img/backgrounds/background-darkblue.png"});
        Personalization.registerBackground({name: "orange", displayName: "Orange", src: "img/backgrounds/background-orange.png"});
        Personalization.registerBackground({name: "pink", displayName: "Pink", src: "img/backgrounds/background-pink.png"});
        Personalization.registerBackground({name: "lime", displayName: "Lime", src: "img/backgrounds/background-lime.png"});
        Personalization.registerBackground({name: "yellow", displayName: "Yellow", src: "img/backgrounds/background-yellow.png"});
        Personalization.registerBackground({name: "red", displayName: "Red", src: "img/backgrounds/background-red.png"});
        Personalization.registerBackground({name: "white", displayName: "White", src: "img/backgrounds/background-white.png"});

        Personalization.setCurrentlyClicked("cookie");
        Personalization.setBackground("blue");

        if (isNaN(this.cookies)) { //? do we really still need this?
            saves.resetSave(this);
            console.warn("Cookies were NaN and save was reset.");
        }
        
        if (localStorage.cookies >= 0)
            helper.popup.createSimple(400,200,"You are using an extremely outdated saving method. You will have issues with saving now that the new one is implimented. Clicking below will reset your save to the new format. Your old save cannot be restored.",false,"localStorage.clear()","Warning",false,false);
    
        this.reloadBuildingPrices();

        // todo before 0.7: does betaSave work here? it looks like it does but i need to thoroughly test it
        if (this.savinator5000.getLocalStorageSave() === null) {
            this.savinator5000.save();
            console.warn(`save was null and was automatically reset, if this is your first time playing this is an intended behavior.`); // todo: the "save" line should hopefully be the localStorage key
        }
    
        this.savinator5000.load();
    
        // if saves are old (directly interacts with localStorage because using Savinator.getLocalStorageSave() will make it angry since localStorage doesn't have a Save it has an array)
        if (localStorage.getItem("save") && localStorage.getItem("save")[0] === "[" && Game.VERSION_BRANCH === Game.Versions.MAIN) {
            localStorage.setItem("old05Save", localStorage.getItem("save"));
            helper.popup.createAdvanced(400,220,`<h3 class='simple-popup-title' style='display:block;'>oh no</h3>
            <p class='popup-text'>so we changed the saving system again, good news, press the button below and it will be transfered to the new format.</p>
            <div style='display:flex;flex-direction:row;height:40px;'>
            <button onclick='saves.convert05Save(false)' id='simplePopupButton' class='popup-button' style='margin-top:20px;width:auto;margin-right:3px'>Reformat me!</button>
            </div>`);
            return "Save the save!";
        }
        if (localStorage.getItem("betaSave") && localStorage.getItem("betaSave")[0] === "[" && Game.VERSION_BRANCH === Game.Versions.BETA) {
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
    
        // Changelog Entries, AKA NOT the messiest place ever.
        // this loop goes from big to small because the function needs to be ran from the latest version to the oldest
        for (let entry = versionChangelogs.length - 1; entry >= 0; entry--) {
            createChangelogEntry(versionChangelogs[entry]);
        }
        
        // this would go after data is loaded, but it requires the mobile variable to be assigned a value
        if (this.isModded) {
            document.getElementById("ifModdedStat").innerText = "You have activated mods on this playthrough!";
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
            devResetButton.addEventListener("click", () => {saves.resetSave(this)});
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
        for (let i in convertCollectionToArray(document.getElementsByClassName("middle-x"))) { //? i don't like how we have to do this, can we find another way? maybe somehow only one X button? actually we should probably refactor how the entire middle section works... todo: make an issue for that
            document.getElementsByClassName("middle-x")[i].addEventListener("click", () => {closeMiddle()});
        }
        document.getElementById("creditsButton").addEventListener("click", () => {helper.popup.createSimple(320,175,'FifthTundraG: Creation<br>potatman4: Playtesting<br>Wolfsarecool44: Playtesting, Emotional Support',false,'default','Credits',false,false)});
        document.getElementById("backgroundSelect").addEventListener("change", () => {Personalization.setBackground((document.getElementById("backgroundSelect") as HTMLFormElement).value)});
        document.getElementById("currentlyClickedSelect").addEventListener("change", () => {Personalization.setCurrentlyClicked((document.getElementById("currentlyClickedSelect") as HTMLFormElement).value)});
        document.getElementById("saveButton").addEventListener("click", () => {this.savinator5000.save()});
        document.getElementById("loadButton").addEventListener("click", () => {this.savinator5000.load()});
        document.getElementById("resetSaveButton").addEventListener("click", () => {helper.popup.createSimple(300,150,'Are you sure you want to do this?',false,'resetSave()','Warning',true,true)});
        document.getElementById("exportDataButton").addEventListener("click", () => {this.savinator5000.export()});
        document.getElementById("importDataInput").addEventListener("change", () => {this.savinator5000.import()});
        document.getElementById("autoSavingToggleSelect").addEventListener("change", () => {this.autoSavingAllowed = ((document.getElementById("autoSavingToggleSelect") as HTMLFormElement).value === "on") ? true : false});;
        document.getElementById("addModButton").addEventListener("click", () => {mods.addClicked()});
        document.getElementById("listModsButton").addEventListener("click", () => {mods.listClicked()});
        document.getElementById("devModeSelect").addEventListener("change", () => {dev.setDevMode((document.getElementById("devModeSelect") as HTMLFormElement).value)})
        // upgrades holder
        document.getElementById("upgradesHolder").addEventListener("mouseover", () => {expandUpgradesHolder()});
        document.getElementById("upgradesHolder").addEventListener("mouseout", () => {expandUpgradesHolder(true)});
        // simple popup
        document.getElementById("simplePopupButton").addEventListener("click", () => {helper.popup.simpleClicked()});
        document.getElementById("simplePopupBackButton").addEventListener("click", () => {helper.popup.destroySimple()});
        // misc
        document.getElementById("cookie").addEventListener("click", () => {this.cookieClicked()});
        document.getElementById("versionNumber").addEventListener("click", () => {versionSwitch()});
        document.getElementById("versionNumber").addEventListener("mouseover", () => {versionNumberMousedOver()});
        document.getElementById("versionNumber").addEventListener("mouseout", () => {versionNumberMousedOver(true)});
        // window events
        window.addEventListener("mousemove", (event) => {
            game.mousePos = {
                x: event.clientX,
                y: event.clientY
            }
            if (inDevelopment && !mobile)
                document.getElementById("mousePosDevText").innerText = `Mouse Pos: (${game.mousePos.x}, ${game.mousePos.y})`;
        });
    
        // Holiday Events
        const date = new Date();
        // anniversary
        if (date.getMonth() === 2 && date.getDate() === 3) { // if date is 3/3
            Personalization.setCurrentlyClicked("cake");
            helper.popup.createSimple(350,175,"It's Clicker Cookie's birthday! \nThe cookie has been replaced with a birthday cake, but you can change it back in Options.",false,"default","woo hoo!");
        }

        this.theGameCanLoopBecauseTheInitializationIsCompleted = true;
    }

    gameLoop() {
        // todo: can we get this out of game loop?
        this.reloadViewVariables();
    
        // CPS
        this.reloadCPSCounter();
        this.reloadCookieCounter();
    
        this.upgradeHandler.checkUpgradeAvailability();
    
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
            helper.popup.createSimple(300,150,`<i>huh, what just happened?</i> <br> An error occured: ${Personalization.getCurrentlyClickedPlural()} are in negative!<br>Please report this to the GitHub accessable in the bottom left corner`,false,"reset cookies","",false,true);
        }
        // stats that need to be updated beforehand
        this.buildingsOwned = this.keyboard.bought + this.grandpa.bought + this.ranch.bought + this.television.bought + this.worker.bought + this.wallet.bought + this.church.bought;
        
        // set statistic page statistics
        if (statsUp) {
            document.getElementById("cookiesStat").innerHTML = `${Personalization.getCurrentlyClickedPlural()}: ${this.variableView.cookiesView}`;
            document.getElementById("allTimeCookies").innerHTML = `All Time ${Personalization.getCurrentlyClickedPlural()}: ${this.variableView.totalCookiesView}`;
            document.getElementById("cookiesPerSecondStat").innerHTML = `${Personalization.getCurrentlyClickedPlural()} Per Second: ${this.variableView.cookiesPerSecondView}`;
            document.getElementById("buildingsOwnedStat").innerHTML = `Buildings Owned: ${commaify(this.buildingsOwned)}`;
            document.getElementById("cookieBeenClickedTimesStat").innerHTML = `Total ${Personalization.getCurrentlyClicked()} Clicks: ${this.cookieBeenClickedTimes}`; // move to cookieClicked() later
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
        document.getElementById("cookieCounter").innerHTML = `${Personalization.getCurrentlyClickedPlural()}: ${this.variableView.cookiesView}`;
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
        document.getElementById("cookiesPerSecondCounter").innerHTML = `${Personalization.getCurrentlyClickedPlural()} Per Second: ${game.variableView.cookiesPerSecondView}`;
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

    // ------------ All of Game's SaveProvider stuff ------------
    getSaveData(): ClickerCookieSaveData {
        return {
            version: Game.VERSION,
            cookies: this.cookies,
            totalCookies: this.totalCookies,
            cookiesPerClick: this.cookiesPerClick,
            cookieBeenClickedTimes: this.cookieBeenClickedTimes,
            hasCheated: this.hasCheated,
            isModded: this.isModded,
            /* buildings */
            // keyboard
            keyboardsBought: this.keyboard.bought,
            keyboardCPSGain: this.keyboard.CPSGain,
            keyboardUpgradeCost: this.keyboard.upgradeCost,
            keyboardCPSGiven: this.keyboard.CPSGiven,
            // grandpa
            grandpasBought: this.grandpa.bought,
            grandpaCPSGain: this.grandpa.CPSGain,
            grandpaUpgradeCost: this.grandpa.upgradeCost,
            grandpaCPSGiven: this.grandpa.CPSGiven,
            // ranch
            ranchesBought: this.ranch.bought,
            ranchCPSGain: this.ranch.CPSGain,
            ranchUpgradeCost: this.ranch.upgradeCost,
            ranchCPSGiven: this.ranch.CPSGiven,
            // television
            televisionsBought: this.television.bought,
            televisionCPSGain: this.television.CPSGain,
            televisionUpgradeCost: this.television.upgradeCost,
            televisionCPSGiven: this.television.CPSGiven,
            // worker
            workersBought: this.worker.bought,
            workerCPSGain: this.worker.CPSGain,
            workerUpgradeCost: this.worker.upgradeCost,
            workerCPSGiven: this.worker.CPSGiven,
            // wallet
            walletsBought: this.wallet.bought,
            walletCPSGain: this.wallet.CPSGain,
            walletUpgradeCost: this.wallet.upgradeCost,
            walletCPSGiven: this.wallet.CPSGiven,
            // church
            churchesBought: this.church.bought,
            churchCPSGain: this.church.CPSGain,
            churchUpgradeCost: this.church.upgradeCost,
            churchCPSGiven: this.church.CPSGiven,

            /* upgrades */
            upgradesBought: Upgrade.upgradesBought,
            upgradesSave: this.upgradeHandler.dumpUpgradesSave(),

            // personalization
            currentClickedObjectName: Personalization.getCurrentlyClicked().toLowerCase(),
            backgroundName: Personalization.currentBackground.name.toLowerCase(), // todo: make better

            // misc
            autoSavingAllowed: this.autoSavingAllowed,
        }
    }
    loadSaveData(saveData: ClickerCookieSaveData) {        
        for (let i in saveData) {
            if (i === undefined) {
                console.warn("During loading a value in saveData was found undefined. Errors will likely follow...");
            }
        }
        
        this.grandpa.setVisibility(false);
        this.ranch.setVisibility(false);
        this.television.setVisibility(false);
        this.worker.setVisibility(false);
        this.wallet.setVisibility(false);
        this.church.setVisibility(false);

        this.cookies = saveData.cookies;
        this.totalCookies = saveData.totalCookies;
        this.cookiesPerClick = saveData.cookiesPerClick;
        this.cookieBeenClickedTimes = saveData.cookieBeenClickedTimes;
        this.hasCheated = saveData.hasCheated;
        this.isModded = saveData.isModded;

        /* buildings */
        // keyboard
        this.keyboard.bought = saveData.keyboardsBought;
        this.keyboard.CPSGain = saveData.keyboardCPSGain;
        this.keyboard.upgradeCost = saveData.keyboardUpgradeCost;
        this.keyboard.CPSGiven = saveData.keyboardCPSGiven;
        // grandpa
        this.grandpa.bought = saveData.grandpasBought;
        this.grandpa.CPSGain = saveData.grandpaCPSGain;
        this.grandpa.upgradeCost = saveData.grandpaUpgradeCost;
        this.grandpa.CPSGiven = saveData.grandpaCPSGiven;
        // ranch
        this.ranch.bought = saveData.ranchesBought;
        this.ranch.CPSGain = saveData.ranchCPSGain;
        this.ranch.upgradeCost = saveData.ranchUpgradeCost;
        this.ranch.CPSGiven = saveData.ranchCPSGiven;
        // television
        this.television.bought = saveData.televisionsBought;
        this.television.CPSGain = saveData.televisionCPSGain;
        this.television.upgradeCost = saveData.televisionUpgradeCost;
        this.television.CPSGiven = saveData.televisionCPSGiven;
        // worker
        this.worker.bought = saveData.workersBought;
        this.worker.CPSGain = saveData.workerCPSGain;
        this.worker.upgradeCost = saveData.workerUpgradeCost;
        this.worker.CPSGiven = saveData.workerCPSGiven;
        // wallet
        this.wallet.bought = saveData.walletsBought;
        this.wallet.CPSGain = saveData.walletCPSGain;
        this.wallet.upgradeCost = saveData.walletUpgradeCost;
        this.wallet.CPSGiven = saveData.walletCPSGiven;
        // church
        this.church.bought = saveData.churchesBought;
        this.church.CPSGain = saveData.churchCPSGain;
        this.church.upgradeCost = saveData.churchUpgradeCost;
        this.church.CPSGiven = saveData.churchCPSGiven;
        // ...

        this.upgradeHandler.loadUpgradesSave(saveData.upgradesSave);

        // personalization
        Personalization.setCurrentlyClicked(saveData.currentClickedObjectName);
        Personalization.setBackground(saveData.backgroundName);

        this.autoSavingAllowed = saveData.autoSavingAllowed;

        this.reloadBuildingPrices();

        this.upgradeHandler.destroyAllUpgrades();
        this.upgradeHandler.showUnlockedUpgrades();
        document.getElementById("upgradesBoughtCounter").innerText = Upgrade.upgradesBought.toString();
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

// ------------------------------------
// Helper Functions
// ------------------------------------
helper.consoleLogDev = function(str: string) {
    if (dev.devMode) console.log(str);
}

// Popups
/**
 * **Note: changes to Simple Popups will be coming soon. See #TODO**
 * https://github.com/clickercookie/clickercookie.github.io/wiki/Using-Popups#simple-popups
 */
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
        document.getElementById("simplePopupButton").addEventListener("click", () => {helper.popup.simpleClicked(doWhat)})
    } else {
        document.getElementById("simplePopupButton").addEventListener("click", () => {helper.popup.simpleClicked()})
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
            middle.style.background = Personalization.getCurrentBackgroundFile(true);
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
            middle.style.background = Personalization.getCurrentBackgroundFile(true);
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
            middle.style.background = Personalization.getCurrentBackgroundFile(true);
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
    document.getElementById("middle").style.background = Personalization.getCurrentBackgroundFile(true);
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

export const game = new Game();
const modProvider = new ModProvider();

saveHandler.registerProvider("clickercookie", game);
// saveHandler.registerProvider(modProvider.NAMESPACE, modProvider)

// timer things
setInterval(() => {
    game.cookiesPerSecondUpdate()
}, 1000);
setInterval(() => {
    if (game.theGameCanLoopBecauseTheInitializationIsCompleted)
        game.gameLoop()
}, 1);
setInterval(() => { // auto-saving
    if (!game.autoSavingAllowed) return false;

    game.savinator5000.save();
}, 60 * 1000); // 60s

// Events
// todo: add to game
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

console.log(game);