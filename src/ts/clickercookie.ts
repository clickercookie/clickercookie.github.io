import { Building } from "./buildings.js";
import { commaify, popup } from "./helper.js";
import { Game } from "./main.js";
import { Mod } from "./mods.js";
import { Personalization } from "./personalization.js";
import { Upgrade, UpgradeData, UpgradeSave } from "./upgrades.js";

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
    version: string;

    // core
    cookies: number;
    totalCookies: number;
    cookiesPerClick: number;
    cookieBeenClickedTimes: number;

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
    upgradesSave: Record<string, UpgradeSave>;
}

export default class ClickerCookie extends Mod {
    // core stuff
    public cookies: number;
    public totalCookies: number;
    public cookiesPerSecond: number;
    public cookiesPerClick: number;
    public cookieBeenClickedTimes: number;
    public buildingsOwned: number;

    /** view versions of variables (their main versions have long decimal points) */
    public variableView: {
        cookiesView: string,
        totalCookiesView: string,
        cookiesPerSecondView: string
    };

    // buildings
    public keyboard: Building;
    public grandpa: Building;
    public ranch: Building;
    public television: Building;
    public worker: Building;
    public wallet: Building;
    public church: Building;

    // upgrades
    public readonly UPGRADES_DATA: UpgradeData[];

    constructor() {
        super("clickercookie");

        // core stuff
        this.cookies = 0;
        this.totalCookies = 0;
        this.cookiesPerSecond = 0;
        this.cookiesPerClick = 1;
        this.cookieBeenClickedTimes = 0;
        this.buildingsOwned = 0;

        this.variableView = {
            cookiesView: "",
            totalCookiesView: "",
            cookiesPerSecondView: ""
        };

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

        // temp: push to this.buildings
        this.buildings.push(this.keyboard);
        this.buildings.push(this.grandpa);
        this.buildings.push(this.ranch);
        this.buildings.push(this.television);
        this.buildings.push(this.worker);
        this.buildings.push(this.wallet);
        this.buildings.push(this.church);


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

        for (let i in this.UPGRADES_DATA) {
            this.upgradeHandler.register(new Upgrade(this, this.UPGRADES_DATA[i]));
        }

        Mod.registerKooh("init", () => { this.init() });
        Mod.registerKooh("click", () => { this.cookieClicked() });
        Mod.registerKooh("loop", () => { this.gameLoop() });
        Mod.registerKooh("cps", () => { this.cpsUpdate() })
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

        // Holiday Events
        const date = new Date();
        // anniversary
        if (date.getMonth() === 2 && date.getDate() === 3) { // if date is 3/3
            Personalization.setCurrentlyClicked("cake");
            popup.createSimple(350,175,"It's Clicker Cookie's birthday! \nThe cookie has been replaced with a birthday cake, but you can change it back in Options.",false,"default","woo hoo!");
        }
    }

    gameLoop() {
        // todo: can we get this out of game loop?
        this.reloadViewVariables();
    
        // CPS
        this.reloadCPSCounter();
        this.reloadCookieCounter();

        // check for stopped cookie production
        if (cookieProductionStopped)
            this.cookies = 0;
    
        // log to console in case of error
        if (this.cookies < 0) {
            popup.createSimple(300,150,`<i>huh, what just happened?</i> <br> An error occured: ${Personalization.getCurrentlyClickedPlural()} are in negative!<br>Please report this to the GitHub accessable in the bottom left corner`,false,"reset cookies","",false,true);
        }

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

    reloadCookieCounter() { // todo: make this be run on a set method or smth instead of its own method
        document.getElementById("cookieCounter").innerHTML = `${Personalization.getCurrentlyClickedPlural()}: ${this.variableView.cookiesView}`;
    }
    reloadCPSCounter() {
        document.getElementById("cookiesPerSecondCounter").innerHTML = `${Personalization.getCurrentlyClickedPlural()} Per Second: ${this.variableView.cookiesPerSecondView}`;
    }

    cookieClicked() {
        this.cookies += this.cookiesPerClick;
        this.cookieBeenClickedTimes++;
        this.totalCookies += this.cookiesPerClick;
        this.reloadCookieCounter();
    }
    cpsUpdate() {
        this.cookies = this.cookies + this.cookiesPerSecond;
        this.totalCookies = this.totalCookies + this.cookiesPerSecond;
        this.reloadCookieCounter();
    }


    reloadViewVariables() { 
        this.variableView.cookiesView = commaify(Math.round(this.cookies * 10) / 10);
        this.variableView.totalCookiesView = commaify(Math.round(this.totalCookies * 10) / 10);
        this.variableView.cookiesPerSecondView = commaify(Math.round(this.cookiesPerSecond * 10) / 10);
    }

    // ------------ All of ClickerCookie's SaveProvider stuff ------------
    getSaveData(): ClickerCookieSaveData {
        return {
            version: Game.VERSION,
            cookies: this.cookies,
            totalCookies: this.totalCookies,
            cookiesPerClick: this.cookiesPerClick,
            cookieBeenClickedTimes: this.cookieBeenClickedTimes,
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
            upgradesSave: this.upgradeHandler.dumpUpgradesSave()
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
    }
}