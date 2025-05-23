import { Building, BuildingData } from "./buildings.js";
import { commaify, makeSlightlyImperfectFloatNice } from "./helper.js";
import { Mod } from "./mods.js";
import { Upgrade, UpgradeData, UpgradeSave } from "./upgrades.js";
import { SimplePopup } from "./popup.js";
import { Identifier } from "./handler.js";
import { Handlers } from "./handlers.js";

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

/** why does this exist? */ 
let cookieProductionStopped = false;

interface ClickerCookieSaveData {
    version: number;

    // core
    cookies: number;
    totalCookies: number;
    cookiesPerClick: number;
    cookieBeenClickedTimes: number;
}

export default class ClickerCookie extends Mod<ClickerCookieSaveData> {
    /* core stuff */
    // cookies
    private _cookies: number = 0;
    public get cookies(): number {
        return this._cookies;
    }
    public set cookies(num: number) {
        this._cookies = num;
        document.getElementById("cookieCount").innerText = makeSlightlyImperfectFloatNice(this._cookies);
        this.updateStatistics();
    }
    // total cookies
    public totalCookies: number = 0;
    // cookies per second
    private _cookiesPerSecond: number = 0;
    public get cookiesPerSecond(): number { return this._cookiesPerSecond }
    public set cookiesPerSecond(num: number) {
        this._cookiesPerSecond = num;
        document.getElementById("cookiesPerSecondCount").innerText = makeSlightlyImperfectFloatNice(this._cookiesPerSecond);
        this.updateStatistics();
    }
    // cookies per click
    private _cookiesPerClick: number = 1;
    public get cookiesPerClick() { return this._cookiesPerClick }
    public set cookiesPerClick(num: number) {
        this._cookiesPerClick = num;
        this.updateStatistics();
    }
    // cookie been clicked times
    private _cookieBeenClickedTimes: number = 0;
    public get cookieBeenClickedTimes() { return this._cookieBeenClickedTimes }
    public set cookieBeenClickedTimes(num: number) {
        this._cookieBeenClickedTimes = num;
        this.updateStatistics();
    }

    // buildings
    public keyboard: Building;
    public grandpa: Building;
    public ranch: Building;
    public television: Building;
    public worker: Building;
    public wallet: Building;
    public church: Building;

    // upgrades
    public readonly UPGRADES_DATA: Record<string, UpgradeData>;
    public readonly BUILDINGS_DATA: Record<string, BuildingData>;

    constructor() {
        super("clickercookie", {name: "Clicker Cookie", description: "A totally original game about clicking a cookie.", img: "img/favicon.ico"});

        //* core stuff CANNOT be assigned via setters in the constructor because they look for personalization stuff that is not loaded from a save yet

        // buildings and stuff
        this.BUILDINGS_DATA = {
            keyboard: {
                name: "Keyboard",
                namePlural: "Keyboards",
                quote: "type in cookies",
                upgradeCost: 15,
                CPSGain: 0.1,
                img: "img/keyboard.png"
            },
            grandpa: {
                name: "Grandpa",
                namePlural: "Grandpas",
                quote: "as long as gramps gets a cut",
                upgradeCost: 100,
                CPSGain: 1,
                img: "img/grandpa.png"
            },
            ranch: {
                name: "Ranch",
                namePlural: "Ranches",
                quote: "not the dressing kind",
                upgradeCost: 1_100,
                CPSGain: 8,
                img: "img/ranch.png"
            },
            television: {
                name: "Television",
                namePlural: "Televisions",
                quote: "hold infomercials on your cookies",
                upgradeCost: 12_000,
                CPSGain: 47,
                img: "img/tv.png"
            },
            worker: {
                name: "Worker",
                namePlural: "Workers",
                quote: "cookies via manual labor",
                upgradeCost: 130_000,
                CPSGain: 260,
                img: "img/worker.png"
            },
            wallet: {
                name: "Wallet",
                namePlural: "Wallets",
                quote: "more storage space for your vast amount of cookie income",
                upgradeCost: 1_400_000,
                CPSGain: 1_440,
                img: "img/wallet.png"
            },
            church: {
                name: "Church",
                namePlural: "Churches",
                quote: "pray to the almighty cookie gods",
                upgradeCost: 20_000_000,
                CPSGain: 7_800,
                img: "img/church.png"
            }
        };

        this.keyboard = new Building(this, this.BUILDINGS_DATA.keyboard);
        this.keyboard.unlocked = true;
        this.grandpa = new Building(this, this.BUILDINGS_DATA.grandpa);
        this.grandpa.setVisibility(false);
        this.ranch = new Building(this, this.BUILDINGS_DATA.ranch);
        this.ranch.setVisibility(false);
        this.television = new Building(this, this.BUILDINGS_DATA.television);
        this.television.setVisibility(false);
        this.worker = new Building(this, this.BUILDINGS_DATA.worker);
        this.worker.setVisibility(false);
        this.wallet = new Building(this, this.BUILDINGS_DATA.wallet);
        this.wallet.setVisibility(false);
        this.church = new Building(this, this.BUILDINGS_DATA.church);
        this.church.setVisibility(false);

        // upgrades
        this.UPGRADES_DATA = {
            // keyboard
            "keyboard1": {
                name: "Reinforced Keys",
                quote: "press harder",
                price: 100,
                img: "img/upgrades/reinforced-keys.png",
                desc: defaultUpgradeDescriptions.keyboard,
                building: this.keyboard,
                buildingsRequired: 1,
                multiplyCookiesPerClick: true
            },
            "keyboard2": {
                name: "Obsidian Keys",
                quote: "so heavy they're always pressed",
                price: 500,
                img: "img/upgrades/obsidian-keys.png",
                desc: defaultUpgradeDescriptions.keyboard,
                building: this.keyboard,
                buildingsRequired: 5,
                multiplyCookiesPerClick: true
            },
            "keyboard3": {
                name: "Osmium Keys",
                quote: "that's very heavy",
                price: 10_000,
                img: "img/upgrades/osmium-keys.png",
                desc: defaultUpgradeDescriptions.keyboard,
                building: this.keyboard,
                buildingsRequired: 10,
                multiplyCookiesPerClick: true
            },
            "keyboard4": {
                name: "10 finger typing",
                quote: "<i><b>efficiency</b></i>", //? your middle school ict teacher would be so proud
                price: 100_000,
                img: "img/upgrades/10-finger-typing.png",
                desc: defaultUpgradeDescriptions.keyboard,
                building: this.keyboard,
                buildingsRequired: 25,
                multiplyCookiesPerClick: true
            },
            "keyboard5": {
                name: "Macros",
                quote: "why press when you don't have to?",
                price: 1_000_000,
                img: "img/upgrades/macros.png",
                desc: defaultUpgradeDescriptions.keyboard,
                building: this.keyboard,
                buildingsRequired: 50,
                multiplyCookiesPerClick: true
            },
            // grandpa
            "grandpa1": {
                name: "Hardwood Walking Stick",
                quote: "nonna dat softwood junk",
                price: 1_000,
                img: "img/upgrades/hardwood-walking-stick.png",
                desc: defaultUpgradeDescriptions.grandpa,
                building: this.grandpa,
                buildingsRequired: 1
            },
            "grandpa2": {
                name: "Rocking Chair",
                quote: "newest addition to the porch*", //? because his butt problems weren't bad enough
                price: 5_000,
                img: "img/upgrades/rocking-chair.png",
                desc: defaultUpgradeDescriptions.grandpa,
                building: this.grandpa,
                buildingsRequired: 5
            },
            "grandpa3": {
                name: "Reading Glasses",
                quote: "helps with precise chocolate chip placement",
                price: 50_000,
                img: "img/upgrades/reading-glasses.png",
                desc: defaultUpgradeDescriptions.grandpa,
                building: this.grandpa,
                buildingsRequired: 10
            },
            "grandpa4": {
                name: "Dementia Pills",
                quote: "what was i doing again?",
                price: 5_000_000,
                img: "img/upgrades/dementia-pills.png",
                desc: defaultUpgradeDescriptions.grandpa,
                building: this.grandpa,
                buildingsRequired: 25
            },
            "grandpa5": {
                name: "shotgun",
                quote: "grandpa's precious*",
                price: 500_000_000,
                img: "img/upgrades/shotgun.png",
                desc: defaultUpgradeDescriptions.grandpa,
                building: this.grandpa,
                buildingsRequired: 50
            },
            // ranch
            "ranch1": {
                name: "Pig Slop",
                quote: "Wait, what have we been feeding them before now?*",
                price: 11_000,
                img: "img/upgrades/pig-slop.png",
                desc: defaultUpgradeDescriptions.ranch,
                building: this.ranch,
                buildingsRequired: 1
            },
            "ranch2": {
                name: "Needle bale",
                quote: "talk about a hay in a needlestack",
                price: 55_000,
                img: "img/upgrades/needle-bale.png",
                desc: defaultUpgradeDescriptions.ranch,
                building: this.ranch,
                buildingsRequired: 5
            },
            "ranch3": {
                name: "Tractors",
                quote: "eliminating manual labor since 1892",
                price: 550_000,
                img: "img/upgrades/tractors.png",
                desc: defaultUpgradeDescriptions.ranch,
                building: this.ranch,
                buildingsRequired: 10
            },
            "ranch4": {
                name: "Big baconator",
                quote: "think giant pig mech fueled by potatoes",
                price: 55_000_000,
                img: "img/upgrades/big-baconator.png",
                desc: defaultUpgradeDescriptions.ranch,
                building: this.ranch,
                buildingsRequired: 25
            },
            "ranch5": {
                name: "Ranch dressing",
                quote: "Wrong ranch.",
                price: 5_500_000_000,
                img: "img/upgrades/ranch-dressing.png",
                desc: defaultUpgradeDescriptions.ranch,
                building: this.ranch,
                buildingsRequired: 50
            },
            // television
            "television1": {
                name: "Streaming service",
                quote: "cookie-flix",
                price: 120_000,
                img: "img/upgrades/streaming-service.png",
                desc: defaultUpgradeDescriptions.television,
                building: this.television,
                buildingsRequired: 1
            },
            "television2": {
                name: "98-inch screen",
                quote: "unnecessarily large is an understatement.",
                price: 600_000,
                img: "img/upgrades/98-inch-screen.png",
                desc: defaultUpgradeDescriptions.television,
                building: this.television,
                buildingsRequired: 5
            },
            "television3": {
                name: "Surround sound",
                quote: "it's all around me!",
                price: 6_000_000,
                img: "img/upgrades/surround-sound.png",
                desc: defaultUpgradeDescriptions.television,
                building: this.television,
                buildingsRequired: 10
            },
            "television4": {
                name: "OLED Display",
                quote: "s*** it burned in...",
                price: 60_0000_000,
                img: "img/upgrades/oled-display.png",
                desc: defaultUpgradeDescriptions.television,
                building: this.television,
                buildingsRequired: 25
            },
            "television5": {
                name: "8K resolution",
                quote: "so many pixels!",
                price: 60_000_000_000,
                img: "img/upgrades/8k-resolution.png",
                desc: defaultUpgradeDescriptions.television,
                building: this.television,
                buildingsRequired: 50
            },
            // worker
            "worker1": {
                name: "Medkits",
                quote: "Constant supply of Band-Aids in case of emergency",
                price: 1_300_000,
                img: "img/upgrades/medkits.png",
                desc: defaultUpgradeDescriptions.worker,
                building: this.worker,
                buildingsRequired: 1
            },
            "worker2": {
                name: "Hard hats",
                quote: "Keep those skulls safe!*",
                price: 6_500_000,
                img: "img/upgrades/hard-hats.png",
                desc: defaultUpgradeDescriptions.worker,
                building: this.worker,
                buildingsRequired: 5
            },
            "worker3": {
                name: "Fast fingers*",
                quote: "upmost efficient cookie manufacturing*",
                price: 65_000_000,
                img: "img/upgrades/fast-fingers.png",
                desc: defaultUpgradeDescriptions.worker,
                building: this.worker,
                buildingsRequired: 10
            },
            "worker4": {
                name: "Weight training",
                quote: "firmly attach chocolate chips via brute force",
                price: 6_500_000_000,
                img: "img/upgrades/weight-training.png",
                desc: defaultUpgradeDescriptions.worker,
                building: this.worker,
                buildingsRequired: 25
            },
            "worker5": {
                name: "Robot workers",
                quote: "robotic precision",
                price: 650_000_000_000,
                img: "img/upgrades/robot-workers.png",
                desc: defaultUpgradeDescriptions.worker,
                building: this.worker,
                buildingsRequired: 50
            },
            // wallet
            "wallet1": {
                name: "200 dollar bills",
                quote: "I'm sure the federal reserve will be okay with this...*",
                price: 14_000_000,
                img: "img/upgrades/200-dollar-bills.png",
                desc: defaultUpgradeDescriptions.wallet,
                building: this.wallet,
                buildingsRequired: 1
            },
            "wallet2": {
                name: "Credit cards",
                quote: "cookies but digitized",
                price: 70_000_000,
                img: "img/upgrades/credit-cards.png",
                desc: defaultUpgradeDescriptions.wallet,
                building: this.wallet,
                buildingsRequired: 5
            },
            "wallet3": {
                name: "Tax refund",
                quote: "for when you overbake to the IRS*",
                price: 700_000_000,
                img: "img/upgrades/tax-refund.png",
                desc: defaultUpgradeDescriptions.wallet,
                building: this.wallet,
                buildingsRequired: 10
            },
            "wallet4": {
                name: "safe",
                quote: "you can keep your cookies even <b>safe</b>r!!",
                price: 70_000_000_000,
                img: "img/upgrades/safe.png",
                desc: defaultUpgradeDescriptions.wallet,
                building: this.wallet,
                buildingsRequired: 25
            },
            "wallet5": {
                name: "Wizard\'s wallet",
                quote: "<b>infinite</b> storage space*",
                price: 7_000_000_000_000,
                img: "img/upgrades/wizards-wallet.png",
                desc: defaultUpgradeDescriptions.wallet,
                building: this.wallet,
                buildingsRequired: 50
            },
            // church
            "church1": {
                name: "the pope",
                quote: "his holiness will provide many cookies",
                price: 200_000_000,
                img: "img/upgrades/the-pope.png",
                desc: defaultUpgradeDescriptions.church,
                building: this.church,
                buildingsRequired: 1
            },
            "church2": {
                name: "Cookie study",
                quote: "learning about our baking lord's best recipes",
                price: 1_000_000_000,
                img: "img/upgrades/cookie-study.png",
                desc: defaultUpgradeDescriptions.church,
                building: this.church,
                buildingsRequired: 5
            },
            "church3": {
                name: "Cookie ritual",
                quote: "summon cookies from the underworld",
                price: 10_000_000_000,
                img: "img/upgrades/cookie-ritual.png",
                desc: defaultUpgradeDescriptions.church,
                building: this.church,
                buildingsRequired: 10
            },
            "church4": {
                name: "Cookie gods",
                quote: "Worship them, lest their power overwhelm your mortal form.",
                price: 1_000_000_000_000,
                img: "img/upgrades/cookie-gods.png",
                desc: defaultUpgradeDescriptions.church,
                building: this.church,
                buildingsRequired: 25
            },
            "church5": {
                name: "Cible",
                quote: "Get it? <b>c</b>ookie-b<b>ible</b>!<br><br>I'll see myself out.",
                price: 100_000_000_000_000,
                img: "img/upgrades/cible.png",
                desc: defaultUpgradeDescriptions.church,
                building: this.church,
                buildingsRequired: 50
            }
        };

        Mod.registerKooh("click", () => { this.cookieClicked() });
        Mod.registerKooh("loop", () => { this.gameLoop() });
        Mod.registerKooh("cps", () => { this.cpsUpdate() });
        Mod.registerKooh("personalization", () => {
            Handlers.UPGRADE.getFromIdentifier(new Identifier(this.NAMESPACE, "keyboard1")).desc = `Multiplys Keyboard and clicking ${Handlers.CURRENTLY_CLICKED.getCurrentlyClicked().name.toLowerCase()} production by 2`;
            Handlers.UPGRADE.getFromIdentifier(new Identifier(this.NAMESPACE, "keyboard2")).desc = `Multiplys Keyboard and clicking ${Handlers.CURRENTLY_CLICKED.getCurrentlyClicked().name.toLowerCase()} production by 2`;
            Handlers.UPGRADE.getFromIdentifier(new Identifier(this.NAMESPACE, "keyboard3")).desc = `Multiplys Keyboard and clicking ${Handlers.CURRENTLY_CLICKED.getCurrentlyClicked().name.toLowerCase()} production by 2`;
            Handlers.UPGRADE.getFromIdentifier(new Identifier(this.NAMESPACE, "keyboard4")).desc = `Multiplys Keyboard and clicking ${Handlers.CURRENTLY_CLICKED.getCurrentlyClicked().name.toLowerCase()} production by 2`;
            Handlers.UPGRADE.getFromIdentifier(new Identifier(this.NAMESPACE, "keyboard5")).desc = `Multiplys Keyboard and clicking ${Handlers.CURRENTLY_CLICKED.getCurrentlyClicked().name.toLowerCase()} production by 2`;
            
            Handlers.BUILDING.getFromIdentifier(new Identifier(this.NAMESPACE, "keyboard")).quote = `type in ${Handlers.CURRENTLY_CLICKED.getCurrentlyClicked().namePlural.toLowerCase()}`;
            Handlers.BUILDING.getFromIdentifier(new Identifier(this.NAMESPACE, "television")).quote = `hold infomercials on your ${Handlers.CURRENTLY_CLICKED.getCurrentlyClicked().namePlural.toLowerCase()}`;
        });
    }

    init() {
        Handlers.BUILDING.register(new Identifier(this.NAMESPACE, "keyboard"), this.keyboard);
        Handlers.BUILDING.register(new Identifier(this.NAMESPACE, "grandpa"), this.grandpa);
        Handlers.BUILDING.register(new Identifier(this.NAMESPACE, "ranch"), this.ranch);
        Handlers.BUILDING.register(new Identifier(this.NAMESPACE, "television"), this.television);
        Handlers.BUILDING.register(new Identifier(this.NAMESPACE, "worker"), this.worker);
        Handlers.BUILDING.register(new Identifier(this.NAMESPACE, "wallet"), this.wallet);
        Handlers.BUILDING.register(new Identifier(this.NAMESPACE, "church"), this.church);

        for (const uid in this.UPGRADES_DATA) {
            Handlers.UPGRADE.register(new Identifier(this.NAMESPACE, uid), new Upgrade(this, this.UPGRADES_DATA[uid]));
        }

        // Register personalization things (must be before save load because loading requires these to be registered to set them)
        Handlers.CURRENTLY_CLICKED.register(new Identifier(this.NAMESPACE, "cookie"), {name: "Cookie", namePlural: "Cookies", src: "img/cookie.png"});
        Handlers.CURRENTLY_CLICKED.register(new Identifier(this.NAMESPACE, "potato"), {name: "Potato", namePlural: "Potatoes", src: "img/potato.png"});
        Handlers.CURRENTLY_CLICKED.register(new Identifier(this.NAMESPACE, "strawberry"), {name: "Strawberry", namePlural: "Strawberries", src: "img/strawberry.png"});
        Handlers.CURRENTLY_CLICKED.register(new Identifier(this.NAMESPACE, "cake"), {name: "Cake", namePlural: "Cakes", src: "img/cake.png", circular: false, pixelated: true});
        Handlers.BACKGROUND.register(new Identifier(this.NAMESPACE, "blue"), {name: "Blue", src: "img/backgrounds/background-blue.png"});
        Handlers.BACKGROUND.register(new Identifier(this.NAMESPACE, "green"), {name: "Green", src: "img/backgrounds/background-green.png"});
        Handlers.BACKGROUND.register(new Identifier(this.NAMESPACE, "gray"), {name: "Gray", src: "img/backgrounds/background-gray.png"});
        Handlers.BACKGROUND.register(new Identifier(this.NAMESPACE, "purple"), {name: "Purple", src: "img/backgrounds/background-purple.png"});
        Handlers.BACKGROUND.register(new Identifier(this.NAMESPACE, "darkblue"), {name: "Dark Blue", src: "img/backgrounds/background-darkblue.png"});
        Handlers.BACKGROUND.register(new Identifier(this.NAMESPACE, "orange"), {name: "Orange", src: "img/backgrounds/background-orange.png"});
        Handlers.BACKGROUND.register(new Identifier(this.NAMESPACE, "pink"), {name: "Pink", src: "img/backgrounds/background-pink.png"});
        Handlers.BACKGROUND.register(new Identifier(this.NAMESPACE, "lime"), {name: "Lime", src: "img/backgrounds/background-lime.png"});
        Handlers.BACKGROUND.register(new Identifier(this.NAMESPACE, "yellow"), {name: "Yellow", src: "img/backgrounds/background-yellow.png"});
        Handlers.BACKGROUND.register(new Identifier(this.NAMESPACE, "red"), {name: "Red", src: "img/backgrounds/background-red.png"});
        Handlers.BACKGROUND.register(new Identifier(this.NAMESPACE, "white"), {name: "White", src: "img/backgrounds/background-white.png"});

        Handlers.CURRENTLY_CLICKED.setCurrentlyClicked("clickercookie:cookie");
        Handlers.BACKGROUND.setBackground("clickercookie:blue");

        // Holiday Events
        const date = new Date();
        // anniversary
        if (date.getMonth() === 2 && date.getDate() === 3) { // if date is 3/3
            Handlers.CURRENTLY_CLICKED.setCurrentlyClicked("cake");
            new SimplePopup({
                x: 350,
                y: 175,
                text: "It's Clicker Cookie's birthday! \nThe cookie has been replaced with a birthday cake, but you can change it back in Options.",
                title: "woo hoo!"
            });
        }
    }

    gameLoop() {
        // check for stopped cookie production
        if (cookieProductionStopped)
            this.cookies = 0;

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
    }

    updateStatistics() { // todo: make this only run when the stats page is a. first pulled up, b. continued to be pulled up
        document.getElementById("cookiesStat").innerText = `${Handlers.CURRENTLY_CLICKED.getCurrentlyClicked().namePlural}: ${makeSlightlyImperfectFloatNice(this.cookies)}`;
        document.getElementById("allTimeCookies").innerText = `All Time ${Handlers.CURRENTLY_CLICKED.getCurrentlyClicked().namePlural}: ${makeSlightlyImperfectFloatNice(this.totalCookies)}`;
        document.getElementById("cookiesPerSecondStat").innerText = `${Handlers.CURRENTLY_CLICKED.getCurrentlyClicked().namePlural} Per Second: ${makeSlightlyImperfectFloatNice(this.cookiesPerSecond)}`;
        document.getElementById("buildingsOwnedStat").innerText = `Buildings Owned: ${commaify(Handlers.BUILDING.buildingsOwned)}`; // todo: should this be in Game? How should statistics actually work at all?
        document.getElementById("cookieBeenClickedTimesStat").innerText = `Total ${Handlers.CURRENTLY_CLICKED.getCurrentlyClicked().name} Clicks: ${this.cookieBeenClickedTimes}`;
        document.getElementById("cookiesPerClickStat").innerText = `${Handlers.CURRENTLY_CLICKED.getCurrentlyClicked().namePlural} Per Click: ${this.cookiesPerClick}`;
    }

    cookieClicked() {
        this.cookies += this.cookiesPerClick;
        this.cookieBeenClickedTimes++;
        this.totalCookies += this.cookiesPerClick;
    }
    cpsUpdate() {
        this.cookies = this.cookies + this.cookiesPerSecond;
        this.totalCookies = this.totalCookies + this.cookiesPerSecond;
    }

    // ------------ All of ClickerCookie's SaveProvider stuff ------------
    getSaveData(): ClickerCookieSaveData {
        return {
            version: 0, // todo: this will be 1 when full release
            cookies: this.cookies,
            totalCookies: this.totalCookies,
            cookiesPerClick: this.cookiesPerClick,
            cookieBeenClickedTimes: this.cookieBeenClickedTimes
        }
    }
    loadSaveData(saveData: ClickerCookieSaveData) {
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
    }
}