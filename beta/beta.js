// ------------------------------------
// Variable & Object Definitions
// ------------------------------------
const version = "0.6";
const versionBranch = location.pathname == "/beta/beta" ? 1 : 0; // 0 is main, 1 is beta
const inDevelopment = 0; // toggle if developing actively. This is completely different than the builtin dev mode! Recommended that versionBranch is 1 for easier saving if this is toggled.
const desktop = false;

// customization
const personalization = {};

personalization.currentBackground = "url(img/backgrounds/background-blue.png)";

personalization.currentClicked = "Cookie";
personalization.currentClickedPlural = "Cookies"; // some words have plural "es" at the end so for grammatical safety this is staying

// cookies
const core = {};

core.cookies = 0;
core.cookiesPerClick = 1;
core.cookieBeenClickedTimes = 0;
core.totalCookies = 0;
core.cookiesPerSecond = 0;
core.buildingsOwned = 0;
// upgrades
const upgrades = {};

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
    "Hardwood Walking Stick","Rocking Chair","grandpa3","grandpa4","grandpa5", // grandpa
    "Pig Slop","ranch2","ranch3","ranch4","ranch5", // ranch
    "LED Display","television2","television3","television4","television5", // television
    "Medkits","worker2","worker3","worker4","worker5", // worker
    "200 dollar bills","wallet2","wallet3","wallet4","wallet5", // wallet
    "church1","church2","church3","church4","church5", // church
];
upgrades.quotes = [
    "press harder","so heavy they're always pressed","that's very heavy","<i><b>efficiency</b></i>","Why press when you don't have to?", // keyboard
    "nonna dat softwood junk","newest addition to the porch*","temp","temp","temp", // grandpa
    "Wait, what have we been feeding them before now?","temp","temp","temp","temp", // ranch
    "World's greatest leap in digital technology*","temp","temp","temp","temp", // television
    "Constant supply of Band-Aids in case of emergency","temp","temp","temp","temp", // worker
    "I'm sure the federal reserve will be okay with this...*","temp","temp","temp","temp", // wallet
    "temp","temp","temp","temp","temp", // church
];
upgrades.descriptions = ["Multiplys Keyboard and clicking cookie production by 2","Multiplys Grandpa production by 2","Multiplys Ranch production by 2","Multiplys TV production by 2","Multiplys Worker production by 2","Multiplys Wallet production by 2","Multiplys Church production by 2"];
upgrades.img = [
    "reinforced-keys.png","obsidian-keys.png","osmium-keys.png","10-finger-typing.png",undefined,
    "hardwood-walking-stick.png","rocking-chair.png",undefined,undefined,undefined,
    "ranch-upgrade1.png",undefined,undefined,undefined,undefined,
    "tv-upgrade1.png",undefined,undefined,undefined,undefined,
    "worker-upgrade1.png",undefined,undefined,undefined,undefined,
    "200-dollar-bill.png",undefined,undefined,undefined,undefined,
    undefined,undefined,undefined,undefined,undefined,
];

upgrades.upgradesBought = 0;
upgrades.currentlyShown = 0;
upgrades.rowsOfUpgrades = 0;

// buildings
const buildings = {};

let buildingInfoName = "Name";
let buildingInfoPrice = 0;
let buildingInfoQuote = "Quote";
let buildingInfoProduces = 0;
let buildingInfoProducing = 0;

// dev variables
const dev = {
    devMode: 0,
    CPSGiven: 0
};

// mods stuff
const mods = {};

mods.numberLoaded = 0;
mods.allMods = [];
let isModded = 0;

// middle other occupiers
let statsUp = 0;
let infoUp = 0;
let optionsUp = 0;

// misc
let cookieProductionStopped = 0;
let hasCheated = 0;
let won = 0;
let mobile;
let savingAllowed = true;

// save stuff
const saves = {};
saves.rawImportedData; // parsed data from the Import function but cannot be read
saves.importedData; // Data from the Import function
saves.allToSave = ["core.cookies", "core.totalCookies", "core.cookiesPerSecond", // List of every variable that should be saved, in no particular order.
    "keyboard.CPSGiven","grandpa.CPSGiven","ranch.CPSGiven","television.CPSGiven","worker.CPSGiven","wallet.CPSGiven","church.CPSGiven",
    "keyboard.bought","grandpa.bought","ranch.bought","television.bought","worker.bought","wallet.bought","church.bought",
    "keyboard.CPSGain","grandpa.CPSGain","ranch.CPSGain","television.CPSGain","worker.CPSGain","wallet.CPSGain","church.CPSGain",
    "keyboard.upgradeCost","grandpa.upgradeCost","ranch.upgradeCost","television.upgradeCost","worker.upgradeCost","wallet.upgradeCost","church.upgradeCost",
    "upgrades.unlocked","upgrades.bought","upgrades.upgradesBought",
    "core.cookiesPerClick","core.cookieBeenClickedTimes","core.buildingsOwned","hasCheated","won","isModded","versionBranch"
];
saves.defaultSavedValues = { // Should be self-explanatory. Doesn't have to be ordered like allToSave, but I would appreciate if it was.
    "core.cookies":0, "core.totalCookies":0, "core.cookiesPerSecond":0,
    "keyboard.CPSGiven":0,"grandpa.CPSGiven":0,"ranch.CPSGiven":0,"television.CPSGiven":0,"worker.CPSGiven":0,"wallet.CPSGiven":0,"church.CPSGiven":0,
    "keyboard.bought":0,"grandpa.bought":0,"ranch.bought":0,"television.bought":0,"worker.bought":0,"wallet.bought":0,"church.bought":0,
    "keyboard.CPSGain":0.1,"grandpa.CPSGain":1,"ranch.CPSGain":8,"television.CPSGain":47,"worker.CPSGain":260,"wallet.CPSGain":1440,"church.CPSGain":7800,
    "keyboard.upgradeCost":15,"grandpa.upgradeCost":100,"ranch.upgradeCost":1100,"television.upgradeCost":12000,"worker.upgradeCost":130000,"wallet.upgradeCost":1400000,"church.upgradeCost":20000000,
    "upgrades.unlocked":upgrades.unlocked,"upgrades.bought":upgrades.bought,"upgrades.upgradesBought":0,
    "core.cookiesPerClick":1,"core.cookieBeenClickedTimes":0,"core.buildingsOwned":0,"hasCheated":0,"won":0,"isModded":0,"versionBranch":versionBranch
};
saves.dataLoaded; // data from an auto-save (local storage)

// view versions of variables (their main versions have long decimal points)
const variableView = {};

variableView.cookiesView = Math.round(core.cookies * 10) / 10;
variableView.totalCookiesView = Math.round(core.totalCookies * 10) / 10;
variableView.cookiesPerSecondView = Math.round(core.cookiesPerSecond * 10) / 10;

const helper = {};

// ------------------------------------
// Initialization and Checks for Errors
// ------------------------------------
core.initialization = function() {
    if (isNaN(core.cookies)) {
        saves.resetSave();
        console.log("Cookies were NaN and save was reset.");
    }

    if (localStorage.cookies >= 0) {
        helper.popup.createSimple(400,200,"You are using the old saving method. You will have issues with saving now that the new one is implimented. Clicking below will reset your save to the new format.",false,"localStorage.clear()","Warning",false,false);
    }

    helper.reloadBuildingPrices();
    if (localStorage.getItem("save") == null) {
        localStorage.setItem("save",JSON.stringify(saves.defaultSavedValues));
        console.log("save was null and was automatically reset, if this is your first time playing this is an intended behavior.");
    }
    if (localStorage.getItem("betaSave") == null) {
        localStorage.setItem("betaSave",JSON.stringify(saves.defaultSavedValues));
        console.log("betaSave was null and was automatically reset, if this is your first time playing this is an intended behavior.");
    }

    saves.loadAutoSave();

    // if saves are old
    if (localStorage.betaSave[0] == "[") {
        helper.popup.createAdvanced(400,220,`<h3 class='simple-popup-title' style='display:block;'>oh no</h3>
        <p class='popup-content'>so we changed the saving system again, good news, press the button below and it will be transfered to the new format.</p>
        <div style='display:flex;flex-direction:row;height:40px;'>
        <button onclick='saves.convert05Save(true)' id='simplePopupButton' class='popup-button' style='margin-top:20px;width:auto;margin-right:3px'>Reformat me!</button>
        </div>`);
        return "Save the save!";
    } else if (localStorage.save[0] == "[") {
        // TODO 0.6: MUST ADD save SUPPORT HERE BEFORE RELEASE!!!
    }

    if (localStorage.getItem("betaSaveOld") != null) { // TODO 0.6: remove this check for full release
        helper.popup.createAdvanced(400,220,`<h3 class='simple-popup-title' style='display:block;'>oh no</h3> 
        <p class='popup-content'>so i kinda lied when i said your save is invalid, i can get it back if you want</p> 
        <div style='display:flex;flex-direction:row;height:40px;'> 
        <button onclick='localStorage.removeItem("betaSaveOld")'>i don't want it</button>
        <button onclick='saves.convert05Save(true,true); localStorage.removeItem("betaSaveOld")' id='simplePopupButton' class='popup-button' style='margin-top:20px;width:auto;margin-right:3px'>gimme it back</button> 
        </div>`);
    }

    if (won) {
        // document.getElementById("win").style.display = "block";
    }
    if (hasCheated) {
        document.getElementById("ifCheatedStat").innerHTML = "You have cheated on this playthrough!";
    }

    // check for development special stuff
    if (inDevelopment) {
        // quick buttons
        const devDiv = document.createElement("div");
        
        const devWarning = document.createElement("h4");
        devWarning.appendChild(document.createTextNode("Dev build detected, options below"));
        devWarning.setAttribute("style","color:black;");
        devDiv.appendChild(devWarning);

        const devResetButton = document.createElement("button");
        devResetButton.appendChild(document.createTextNode("Reset Sava Data"));
        devResetButton.setAttribute("onclick","saves.resetSave()");
        devDiv.appendChild(devResetButton);

        const br1 = document.createElement("br");
        devDiv.appendChild(br1);

        const br2 = document.createElement("br");
        devDiv.appendChild(br2);

        const devLoadButton = document.createElement("button");
        devLoadButton.appendChild(document.createTextNode("Force Load Save"));
        devLoadButton.setAttribute("onclick","saves.loadAutoSave()");
        devDiv.appendChild(devLoadButton);

        const br3 = document.createElement("br");
        devDiv.appendChild(br3);

        const mousePos = document.createElement("p");
        mousePos.appendChild(document.createTextNode("Mouse Pos: (?, ?)"));
        mousePos.setAttribute("id","mousePosDevText");
        mousePos.setAttribute("style","margin-bottom:0px;");
        devDiv.appendChild(mousePos);

        const br4 = document.createElement("br");
        devDiv.appendChild(br4);

        const mobileOn = document.createElement("button");
        mobileOn.appendChild(document.createTextNode("Goto Mobile Mode"));
        const mobileOnHyperlink = document.createElement("a");
        mobileOnHyperlink.setAttribute("href","../mobile/mobile.html");
        mobileOnHyperlink.appendChild(mobileOn);
        devDiv.appendChild(mobileOnHyperlink);

        const br5 = document.createElement("br");
        devDiv.appendChild(br5);

        const toggleSaving = document.createElement("button");
        toggleSaving.appendChild(document.createTextNode("Toggle Auto-Saving"));
        toggleSaving.setAttribute("id","mousePosDevText");
        toggleSaving.setAttribute("onclick","dev.toggleSaving()");
        toggleSaving.setAttribute("style","margin-bottom:0px;");
        devDiv.appendChild(toggleSaving);
        const currentSavingStatus = document.createElement("p");
        currentSavingStatus.appendChild(document.createTextNode("saving: true"));
        currentSavingStatus.setAttribute("id","currentSavingStatus");
        currentSavingStatus.setAttribute("style","margin-bottom:0px;");
        devDiv.appendChild(currentSavingStatus);

        document.getElementById("leftSide").insertBefore(devDiv, document.getElementById("leftSidePush"));

        // version change
        document.getElementById("versionNumber").innerHTML = `Version: ${version} Dev`;

        dev.setDevMode("on");
        document.getElementById("offSelectionDev").innerHTML = "Overwritten";
    }

    // change version branch specific stuff
    if (!versionBranch) {
        // change title
        document.getElementById("title").innerHTML = "Clicker Cookie";
        // change version displayed
        document.getElementById("versionNumber").innerHTML = `Version: ${version}`;
        document.getElementById("versionSwitchInfoText").innerHTML = "Clicking this will switch to the beta branch";
    } else {
        // change title
        document.getElementById("title").innerHTML = "Clicker Cookie Beta";
        // change version displayed
        document.getElementById("versionNumber").innerHTML = `Version: ${version} Beta`;
        document.getElementById("versionSwitchInfoText").innerHTML = "Clicking this will switch to the main branch";
        // show the developer mode switch
        document.getElementById("devForm").style.display = "block";
    }
    if (inDevelopment) {
        document.getElementById("title").innerHTML = "Clicker Cookie Dev";
    }

    // Changelog Entries, AKA the messiest place ever.
    createChangelogEntry("0.6",["The long awaited 5 upgrades for every single building. No upgrades are planned beyond this.",
    "Temporary notification in the bottom-left corner when the game saves."],
    ["Upgrades to building and upgrade pixel art. For any artists willing to contribute, .ase files can be found in a seperate folder in the img folder on the GitHub.",
    "All buildings are now apart of a class so mod developers can have an easier time creating them.",
    "The saving system. Yes, 3rd time or something, but this time I GURANTEE it's going to stick.",
    "Grandma has been removed due to addition of upgrades and needing to rebalance when the player \"wins\". Also because i'm scared of copyright issues :)",
    "All changelog entries are now created with Javascript to cut down on the HTML size.",
    "Upgrade viewer and building info are now combined into one tooltip and sizes have been adjusted.",
    "Most logic based variable assignments now use ternary operators.",
    "All remaining ancient plus sign string concatenation now use template literals."],
    ["Centering of buildings bought was done stupidly, fixed now.",
    "Advanced popups had no filter.",
    "Previously created changelog entries are now grammatically correct."],"actual upgrades")

    createChangelogEntry("0.5.2",["Mobile Support!",
    "Mods!",
    "Little X button in the middle area."],
    ["Cleaned up CSS.",
    "Saves from the main branch no longer are allowed in beta and vice versa to prevent corrupted saves.",
    "Popups are now a flexbox.",
    "Small gradient on middle text to make it slightly more nice to look at then solid black.",
    "Better middle button function."],
    ["Options middle text said \"Autosave Management\" when it was supposed to save \"Save Management\"."],"hold the phone","June 23rd")

    createChangelogEntry("0.5.1",["Cookie Wobble!",
    "Can create an advanced popup with pure HTML, contrary to the old way where everything was predetermined.",
    "Credits button under Info."],
    ["All variables and functions now are apart of an object.",
    "Cleaned up Javascript in general.",
    "Most numbers now have commas.",
    "All versions from now on have a name and their version number assigned in changelogs.",
    "Removed unused/unnessesary functions.",
    "camelCase onclick attributes (onClick) have all been switched to lowercase (onclick).",
    "Renamed some save-related variables to make more sense.",
    "Initialization is now inside an object method and called at the bottom of Javascript."],
    ["Hover infobox not updating when the mouse doesn't move.",
    "Grandma showing in simple popups when she isn't supposed to be.",
    "0.5 header having no date.",
    "upgrade#Identifier is no longer used an has been deleted.",
    "Options middle text was highlightable.",
    "Middle text subtitles weren't lined up with other text.",
    "Cookie was clickable in a box shape outside the actual visible cookie."],"Objects Everywhere","May 24th")

    createChangelogEntry("0.5",["AUTO SAVING!!!",
    "EXPORTING & IMPORTING DATA!!!",
    "New temporary cookie!",
    "Hovering over buildings gives a small infobox!",
    "More backgrounds!",
    "A familiar face...",
    "Cursor changes type when hovering over certain elements.",
    "Special development buttons for when in active development.",
    "+ More!"],
    ["Prices are now seperated from the building name.",
    "Can now switch between middle button text by pressing another button opposed to pressing the active button and then button you want.",
    "Version number now says if the game is in beta or not.",
    "Extended popup functionality.",
    "Upgrade hovering is more efficient."],
    ["Double-tapping cookie zooming in on mobile devices.",
    "These list items being highlightable."],undefined,"May 6th")

    createChangelogEntry("0.4.1",["Color!",
    "Buttons!",
    "Keyboard Upgrade Chain final pixel art!",
    "+ More!"],undefined,
    ["Incorrect All Time Cookies & Cookie Clicked variable calculations.",
    "Switched to let instead of var.",
    "Positioning on some incorrect positions."],undefined,"March 24th");

    createChangelogEntry("0.4",["Final major buildings (Wallet & Church).",
    "Upgrades! Only first level upgrades are currently available, excluding the keyboard which has 2 upgrades.",
    "Ability to switch to the beta branch by clicking the version number. The beta branch has code that visually works as expected, but may not have completed pixel art and some incorrect values that skipped me during testing."],
    ["Layout of the body. This may break things so pleases report any issues that occur!"],
    ["Everything."],undefined,"March 24th");

    createChangelogEntry("0.2.2",["Borders to the left and right sides of the screen.",
    "The capability to create a popup for usage later."],undefined,undefined,undefined,"March 16th");

    createChangelogEntry("0.2.1",["Television!",
    "Laborers!"],["Made CSS better."],undefined,undefined,"March 16th");

    createChangelogEntry("0.2",["A Github page.",
    "Version number."],undefined,undefined,undefined,"March 16th");

    createChangelogEntry("0.1.1",["Ranches! Buyable for 1000 cookies for the time being.",
    "Minor hover effect when hovering over buildings."],undefined,["totalCookies variable is fixed, but still unused (but not for long!)"],undefined,"March 9th");
    
    createChangelogEntry("0.1",["Existance."],undefined,undefined,undefined,"March 4th");

    if (navigator.userAgent.match(/Android/i) // stolen from https://www.tutorialspoint.com/How-to-detect-a-mobile-device-with-JavaScript (doesn't always work)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)) {
        mobile = 1;
        personalization.currentBackground = "url(../img/backgrounds/background-blue.png)";
        if (location.pathname == "/" || location.pathname == "/beta/beta" || location.pathname == "/beta/beta.html") {
            if (!versionBranch) {
                location.href = "mobile/mobile.html";
            } else {
                location.href = "../mobile/mobile.html";
            }
        }
    }
    else {
        mobile = 0;
    }
    
    // this would go after data is loaded, but it requires the mobile variable to be assigned a value
    if (isModded && !mobile) {
        document.getElementById("ifModdedStat").innerHTML = "You have activated mods on this playthrough!";
    }
}

// Events
let mousePos = { x: undefined, y: undefined };

window.addEventListener('mousemove', (event) => {
    mousePos = { x: event.clientX, y: event.clientY };
    if (inDevelopment) {
        document.getElementById("mousePosDevText").textContent = `Mouse Pos: (${mousePos.x}, ${mousePos.y})`;
    }
    // set positions affected by mouse pos
    document.getElementById("tooltip").style.top = `${mousePos.y - 50}px`;
});

// timer things
const intervalCPSU = setInterval(cookiesPerSecondUpdate, 1000);
const perMillisecondUniversalVar = setInterval(perMillisecondUniversal, 1);
const autoSaveInterval = setInterval(autoSaveIntervalFunc, 60 * 1000);

function perMillisecondUniversal() {
    variableView.cookiesView = Math.round(core.cookies * 10) / 10;
    variableView.cookiesView = helper.commaify(variableView.cookiesView);
    variableView.totalCookiesView = Math.round(core.totalCookies * 10) / 10;
    variableView.totalCookiesView = helper.commaify(variableView.totalCookiesView);
    variableView.cookiesPerSecondView = Math.round(core.cookiesPerSecond * 10) / 10;
    variableView.cookiesPerSecondView = helper.commaify(variableView.cookiesPerSecondView);

    // CPS
    helper.reloadCPSCounter();
    helper.reloadCookieCounter();

    upgrades.checkUpgradeAvailability();

    // building unlocks
    if (core.totalCookies >= 100) {
        grandpa.unlocked = 1;
        grandpa.setVisibility(true);
    }
    if (core.totalCookies >= 700) {
        ranch.unlocked = 1;
        ranch.setVisibility(true);
    }
    if (core.totalCookies >= 8000) {
        television.unlocked = 1;
        television.setVisibility(true);
    }
    if (core.totalCookies >= 80000) {
        worker.unlocked = 1;
        worker.setVisibility(true);
    }
    if (core.totalCookies >= 700000) {
        wallet.unlocked = 1;
        wallet.setVisibility(true);
    }
    if (core.totalCookies >= 15000000) {
        church.unlocked = 1;
        church.setVisibility(true);
    }

    // check for stopped cookie production
    if (cookieProductionStopped) {
        core.cookies = 0;
    }

    // log to console in case of error
    if (core.cookies < 0) {
        helper.popup.createSimple(300,150,`<i>huh, what just happened?</i> <br> An error occured: ${personalization.currentClickedPlural} are in negative!<br>Please report this to the GitHub accessable in the bottom left corner`,false,"default","",false,true);
    }
    // stats that need to be updated beforehand
    core.buildingsOwned = keyboard.bought + grandpa.bought + ranch.bought + television.bought + worker.bought + wallet.bought + church.bought;
    
    // set statistic page statistics
    if (statsUp) {
        document.getElementById("cookiesStat").innerHTML = `${personalization.currentClickedPlural}: ${helper.commaify(variableView.cookiesView)}`;
        document.getElementById("allTimeCookies").innerHTML = `All Time ${personalization.currentClickedPlural}: ${helper.commaify(variableView.totalCookiesView)}`;
        document.getElementById("cookiesPerSecondStat").innerHTML = `${personalization.currentClickedPlural} Per Second: ${helper.commaify(variableView.cookiesPerSecondView)}`;
        document.getElementById("buildingsOwnedStat").innerHTML = `Buildings Owned: ${helper.commaify(core.buildingsOwned)}`;
        document.getElementById("cookieBeenClickedTimesStat").innerHTML = `Total ${personalization.currentClicked} Clicks: ${helper.commaify(core.cookieBeenClickedTimes)}`; // move to cookieClicked() later
        document.getElementById("upgradesBoughtStat").innerHTML = `Upgrades Bought: ${upgrades.upgradesBought}`;
    }

    // set number of bought to bought (not required unless number of bought is set in console)
    document.getElementById("keyboardsBought").innerHTML = keyboard.bought;
    document.getElementById("grandpasBought").innerHTML = grandpa.bought;
    document.getElementById("ranchesBought").innerHTML = ranch.bought;
    document.getElementById("televisionsBought").innerHTML = television.bought;
    document.getElementById("workersBought").innerHTML = worker.bought;
    document.getElementById("walletsBought").innerHTML = wallet.bought;
    document.getElementById("churchesBought").innerHTML = church.bought;
    
    // upgrades shown calculation
    upgrades.rowsOfUpgrades = Math.ceil(upgrades.currentlyShown / 5);

    core.cookiesPerSecond = keyboard.CPSGiven+grandpa.CPSGiven+ranch.CPSGiven+television.CPSGiven+worker.CPSGiven+wallet.CPSGiven+church.CPSGiven+dev.CPSGiven;
}

function cookiesPerSecondUpdate() {
    core.cookies = core.cookies + core.cookiesPerSecond;
    core.totalCookies = core.totalCookies + core.cookiesPerSecond;
    helper.reloadCookieCounter();
}

function autoSaveIntervalFunc() { // Turns out this is required and that the game hasn't been auto-saving ever since Objects Everywhere...
    if (!savingAllowed) {
        return false;
    }
    saves.autoSave();
}

// ------------------------------------
// Functions
// ------------------------------------
core.cookieClicked = function() {
    core.cookies += core.cookiesPerClick;
    core.cookieBeenClickedTimes += 1;
    core.totalCookies += core.cookiesPerClick;
    helper.reloadCookieCounter();
}
// dev commands
dev.setDevMode = function(value) {
    switch (value) {
        case "off":
            dev.devMode = 0;
            break;
        case "on":
            dev.devMode = 1;
            console.log("Developer Mode activated.");
            document.getElementById("devModeSelect").disabled = true;
            document.getElementById("whiteBackground").style.display = "block";
            break;
    }
}
dev.setCookies = function(x) {
    if (dev.devMode) {
        core.cookies = x;
        core.totalCookies = core.totalCookies + x;
        hasCheated = 1;
        helper.reloadCookieCounter();
        document.getElementById("ifCheatedStat").innerHTML = "You have cheated on this playthrough!";
    }
    else {
        console.log("You need developer mode ON to run this command.");
    }
}
dev.setCPS = function(x) {
    if (dev.devMode) {
        dev.CPSGiven = x;
        hasCheated = 1;
        variableView.cookiesPerSecondView = Math.round(core.cookiesPerSecond * 10) / 10;
        helper.reloadCPSCounter();
        document.getElementById("ifCheatedStat").innerHTML = "<b>You have cheated on this playthrough!</b>";
    }
    else {
        console.log("You need developer mode ON to run this command.");
    }
}
dev.toggleSaving = function() {
    if (this.devMode) {
        if (savingAllowed) {
            savingAllowed = false;
        }
        else {
            savingAllowed = true;
        }
        if (!inDevelopment) {return;}
        document.getElementById("currentSavingStatus").innerHTML = `saving: ${savingAllowed}`;
    } else {
        console.log("You need developer mode ON to run this command.");
    }
}

// ------------------------------------
// Buildings
// ------------------------------------
class Building {
    static instances = [];

    constructor(name,quote,upgradeCost,CPSGain,id,iconImg="unknown.png",esPlural=false) {
        if (document.getElementById(`building${id}`) != null) {
            helper.popup.createSimple(300,150,`<i>huh, what just happened?</i> <br> An error occured: Tried to create a building that already exists (id ${id}).`,true,"default","Error",false,true);
            return;
        }

        this.name = name; // SHOULD BE SAME AS OBJECT INSTANCE NAME, might change this requirement but how to do that is currently beyond my knowledge
        this.quote = quote;
        this.upgradeCost = upgradeCost;
        this.CPSGiven = 0;
        this.CPSGain = CPSGain;
        this.id = id

        this.bought = 0;
        this.unlocked = 0;
        if (esPlural) { this.plural = "es"; } 
        else { this.plural = "s"; }

        Building.instances.push(this.name);

        // setup HTML (uses indentation to show structure)
        this.building = document.createElement("div");
        this.building.setAttribute("id",`building${this.id}`);
        this.building.setAttribute("class","building");
        this.building.setAttribute("onclick",`${this.name}.buy()`); // this is why names must be the instance name
        this.building.setAttribute("onmouseover",`${this.name}.hovered()`); // this is why names must be the instance name
        this.building.setAttribute("onmouseout","hideTooltip()");

            const icon = document.createElement("img");
            icon.setAttribute("class","building-icon");
            icon.setAttribute("src",`img/${iconImg}`);
            icon.setAttribute("alt",`${this.name} icon`);
            this.building.appendChild(icon);

            const buildingContent = document.createElement("div");
            buildingContent.setAttribute("class","building-content");

                const buildingsBoughtWrapper = document.createElement("div");
                buildingsBoughtWrapper.setAttribute("class","buildings-bought-wrapper");

                    const buildingsBought = document.createElement("p");
                    buildingsBought.setAttribute("class","buildings-bought");
                    buildingsBought.setAttribute("id",`${this.name}${this.plural}Bought`);
                    buildingsBought.innerHTML = "0";
                    buildingsBoughtWrapper.appendChild(buildingsBought);
                
                buildingContent.appendChild(buildingsBoughtWrapper);
            
                const buildingName = document.createElement("p");
                buildingName.setAttribute("class","building-name");
                buildingName.innerHTML = `${capitalize(this.name)}`; // ? THIS IS ERROR
                buildingContent.appendChild(buildingName);

                const buildingPrice = document.createElement("p");
                buildingPrice.setAttribute("class","building-price");
                buildingPrice.setAttribute("id",`${this.name}Cost`);
                buildingPrice.innerHTML = this.upgradeCost;
                buildingContent.appendChild(buildingPrice);

            this.building.appendChild(buildingContent);

        document.getElementById("buildingsWrapper").appendChild(this.building);
        // end setup HTML
    }

    buy() {
        if (core.cookies >= this.upgradeCost) {
            core.cookies -= this.upgradeCost;
            this.upgradeCost *= 1.15;
            this.upgradeCost = Math.floor(this.upgradeCost);
            this.bought += 1;
            this.CPSGiven += this.CPSGain;
            helper.reloadCookieCounter();
            document.getElementById(`${this.name}Cost`).innerHTML = helper.commaify(this.upgradeCost);
            document.getElementById(`${this.name}${this.plural}Bought`).innerHTML = this.bought;
            this.hovered();
        }
    }

    hovered() {
        document.getElementById("tooltipDesc").style.display = "none";
        document.getElementById("tooltipProduces").style.display = "block";
        document.getElementById("tooltipProducing").style.display = "block";

        buildingInfoName = this.name.capitalize();
        buildingInfoPrice = helper.commaify(this.upgradeCost);
        buildingInfoQuote = this.quote;
        buildingInfoProduces = helper.commaify(this.CPSGain);
        buildingInfoProducing = helper.commaify(Math.round(this.CPSGiven * 10) / 10);

        if (!mobile) {
            document.getElementById("tooltipName").innerHTML = buildingInfoName;
            document.getElementById("tooltipPrice").innerHTML = `Price: ${buildingInfoPrice}`;
            document.getElementById("tooltipQuote").innerHTML = `\"${buildingInfoQuote}\"`;
            document.getElementById("tooltipProduces").innerHTML = `Produces: ${buildingInfoProduces} CPS`;
            document.getElementById("tooltipProducing").innerHTML = `Producing: ${buildingInfoProducing} CPS`;
        }
    
        document.getElementById("tooltip").style.display = "block";
    }

    setVisibility(bool) {
        if (bool) {
            this.building.style.display = "block";
        } else {
            this.building.style.display = "none";
        }
    }

    reloadPrice() {
        document.getElementById(`${this.name}Cost`).innerHTML = helper.commaify(this.upgradeCost);
    }

    destroy() {
        delete Building.instances[this.name];
        document.getElementById(`building${this.id}`).remove();
    }
}

// ------------------------------------
// Upgrades
// ------------------------------------
upgrades.create = function(id) {
    let building;
    if (id >= 0) {
        building = 0;
    }
    if (id >= 5) {
        building = 1;
    }
    if (id >= 10) {
        building = 2;
    }
    if (id >= 15) {
        building = 3;
    }
    if (id >= 20) {
        building = 4;
    }
    if (id >= 25) {
        building = 5;
    }
    if (id >= 30) {
        building = 6;
    }

    const upgrade = document.createElement("div");
    upgrade.setAttribute("class","upgrade");
    upgrade.setAttribute("id",`upgrade${id}`)
    upgrade.setAttribute("onclick",`upgrades.clicked(${id},${building})`);
    upgrade.setAttribute("onmouseover",`upgrades.hovered(${id},${building})`);
    upgrade.setAttribute("onmouseout","hideTooltip()");

    icon = this.img[id];
    if (icon === undefined) {
        if (!mobile) {
            upgrade.style.backgroundImage = "url(img/unknown-64-64.png)";
        }
        if (mobile || desktop) {
            upgrade.style.backgroundImage = "url(../img/unknown-64-64.png)";
        }
    } else {
        if (!mobile) {
            upgrade.style.backgroundImage = `url(img/upgrades/${icon})`;
        }
        if (mobile || desktop) {
            upgrade.style.backgroundImage = `url(../img/upgrades/${icon})`;
        }
    }

    document.getElementById("upgradesHolder").appendChild(upgrade);
    upgrades.currentlyShown += 1;
}

upgrades.clicked = function(id,building) { // yes it's messy, dont judge me
    switch (building) {
    case 0:
        if (core.cookies >= upgrades.prices[id]) {
            core.cookies -= upgrades.prices[id];
            keyboard.CPSGiven *= 2;
            keyboard.CPSGain *= 2;
            core.cookiesPerClick *= 2;
            upgrades.bought[id] = 1;
            if (!mobile) {
                upgrades.hovered(id,building);
            }
            upgrades.destroy(id);
            upgrades.upgradesBought += 1;
            upgrades.currentlyShown -= 1;
        }
        break;
    case 1:
        if (core.cookies >= upgrades.prices[id]) {
            core.cookies -= upgrades.prices[id];
            grandpa.CPSGiven *= 2;
            grandpa.CPSGain *= 2;
            upgrades.bought[id] = 1;
            if (!mobile) {
                upgrades.hovered(id,building);
            }
            upgrades.destroy(id);
            upgrades.upgradesBought += 1;
            upgrades.currentlyShown -= 1;
        }
        break;
    case 2:
        if (core.cookies >= upgrades.prices[id]) {
            core.cookies -= upgrades.prices[id];
            ranch.CPSGiven *= 2;
            ranch.CPSGain *= 2;
            upgrades.bought[id] = 1;
            if (!mobile) {
                upgrades.hovered(id,building);
            }
            upgrades.destroy(id);
            upgrades.upgradesBought += 1;
            upgrades.currentlyShown -= 1;
        }
        break;
    case 3:
        if (core.cookies >= upgrades.prices[id]) {
            core.cookies -= upgrades.prices[id];
            television.CPSGiven *= 2;
            television.CPSGain *= 2;
            upgrades.bought[id] = 1;
            if (!mobile) {
                upgrades.hovered(id,building);
            }
            upgrades.destroy(id);
            upgrades.upgradesBought += 1;
            upgrades.currentlyShown -= 1;
        }
        break;
    case 4:
        if (core.cookies >= upgrades.prices[id]) {
            core.cookies -= upgrades.prices[id];
            worker.CPSGiven *= 2;
            worker.CPSGain *= 2;
            upgrades.bought[id] = 1;
            if (!mobile) {
                upgrades.hovered(id,building);
            }
            upgrades.destroy(id);
            upgrades.upgradesBought += 1;
            upgrades.currentlyShown -= 1;
        }
        break;
    case 5:
        if (core.cookies >= upgrades.prices[id]) {
            core.cookies -= upgrades.prices[id];
            wallet.CPSGiven *= 2;
            wallet.CPSGain *= 2;
            upgrades.bought[id] = 1;
            if (!mobile) {
                upgrades.hovered(id,building);
            }
            upgrades.destroy(id);
            upgrades.upgradesBought += 1;
            upgrades.currentlyShown -= 1;
        }
        break;
    case 6:
        if (core.cookies >= upgrades.prices[id]) {
            core.cookies -= upgrades.prices[id];
            church.CPSGiven *= 2;
            church.CPSGain *= 2;
            upgrades.bought[id] = 1;
            if (!mobile) {
                upgrades.hovered(id,building);
            }
            upgrades.destroy(id);
            upgrades.upgradesBought += 1;
            upgrades.currentlyShown -= 1;
        }
        break;
    }
    upgrades.expandUpgradesHolder(); // sometimes the upgrade holder has one too many rows because of weird onmouseover behavior, this prevents that
}

upgrades.destroy = function(id) {
    document.getElementById(`upgrade${id}`).remove();
    if (!mobile) {
        hideTooltip();
    }
}
upgrades.destroyAll = function() {
    for (i = 0; i < upgrades.unlocked.length; i++) {
        try {
            document.getElementById(`upgrade${i}`).remove();
        } catch {
            continue;
        }
    }
    upgrades.currentlyShown = 0;
}

upgrades.hovered = function(id,building) {
    document.getElementById("tooltipProduces").style.display = "none";
    document.getElementById("tooltipProducing").style.display = "none";
    document.getElementById("tooltipDesc").style.display = "block";

    document.getElementById("tooltipName").innerHTML = upgrades.names[id];
    document.getElementById("tooltipPrice").innerHTML = `Price: ${helper.commaify(upgrades.prices[id])}`;
    document.getElementById("tooltipDesc").innerHTML = `${upgrades.descriptions[building]}`;
    document.getElementById("tooltipQuote").innerHTML = `<i>\"${upgrades.quotes[id]}\"</i>`;

    document.getElementById("tooltip").style.display = "block";
}
upgrades.expandUpgradesHolder = function(retract=false) {
    upgrades.rowsOfUpgrades = Math.ceil(upgrades.currentlyShown / 5);

    const holder = document.getElementById("upgradesHolder");
    if (retract) {
        holder.style.height = "67.6px";
        return;
    }
    const size = (upgrades.rowsOfUpgrades === 0) ? 67.6 : 67.6 * upgrades.rowsOfUpgrades;
    holder.style.height = `${size}px`;
}
upgrades.showUnlocked = function() {
    for (i = 0; i < upgrades.unlocked.length; i++) {
        if (upgrades.unlocked[i] == 1 && upgrades.bought[i] != 1) {upgrades.create(i);}
    }
}
upgrades.checkUpgradeAvailability = function() {
    let runThroughTimes = 0; // buildings.building.bought needs for boughtUnlockRequirements indicies
    const boughtUnlockRequirements = [ // number of buildings bought required to unlock an upgrade, in chronological order
        1,5,10,25,50
    ];
    // Keyboards
    for (i = 0; i <= 5; i++) {
        if (keyboard.bought >= boughtUnlockRequirements[runThroughTimes] && upgrades.unlocked[i] == 0) {
            upgrades.unlocked[i] = 1;
            upgrades.create(i);
        }
        runThroughTimes++;
    }
    // Grandpas
    runThroughTimes = 0;
    for (i = 5; i <= 9; i++) {
        if (grandpa.bought >= boughtUnlockRequirements[runThroughTimes] && upgrades.unlocked[i] == 0) {
            upgrades.unlocked[i] = 1;
            upgrades.create(i);
        }
        runThroughTimes++;
    }
    // Ranches
    runThroughTimes = 0;
    for (i = 10; i <= 14; i++) {
        if (ranch.bought >= boughtUnlockRequirements[runThroughTimes] && upgrades.unlocked[i] == 0) {
            upgrades.unlocked[i] = 1;
            upgrades.create(i);
        }
        runThroughTimes++;
    }
    // TVs
    runThroughTimes = 0;
    for (i = 15; i <= 19; i++) {
        if (television.bought >= boughtUnlockRequirements[runThroughTimes] && upgrades.unlocked[i] == 0) {
            upgrades.unlocked[i] = 1;
            upgrades.create(i);
        }
        runThroughTimes++;
    }
    // Workers
    runThroughTimes = 0;
    for (i = 20; i <= 24; i++) {
        if (worker.bought >= boughtUnlockRequirements[runThroughTimes] && upgrades.unlocked[i] == 0) {
            upgrades.unlocked[i] = 1;
            upgrades.create(i);
        }
        runThroughTimes++;
    }
    // Wallets
    runThroughTimes = 0;
    for (i = 25; i <= 29; i++) {
        if (wallet.bought >= boughtUnlockRequirements[runThroughTimes] && upgrades.unlocked[i] == 0) {
            upgrades.unlocked[i] = 1;
            upgrades.create(i);
        }
        runThroughTimes++;
    }
    // Churches
    runThroughTimes = 0;
    for (i = 30; i <= 34; i++) {
        if (church.bought >= boughtUnlockRequirements[runThroughTimes] && upgrades.unlocked[i] == 0) {
            upgrades.unlocked[i] = 1;
            upgrades.create(i);
        }
        runThroughTimes++;
    }
}

// ------------------------------------
// Helper Functions
// ------------------------------------
helper.reloadCookieCounter = function() {
    document.getElementById("cookieCounter").innerHTML = `${personalization.currentClickedPlural}: ${variableView.cookiesView}`;
    if (mobile) {
        document.getElementById("cookieCounterStore").innerHTML = `${personalization.currentClickedPlural}: ${variableView.cookiesView}`;
        document.getElementById("cookieCounterStats").innerHTML = `${personalization.currentClickedPlural}: ${variableView.cookiesView}`;
        document.getElementById("cookieCounterOptions").innerHTML = `${personalization.currentClickedPlural}: ${variableView.cookiesView}`;
    }
}
helper.reloadCPSCounter = function() {
    document.getElementById("cookiesPerSecondCounter").innerHTML = `${personalization.currentClickedPlural} Per Second: ${variableView.cookiesPerSecondView}`;
    if (mobile) {
        document.getElementById("cookiesPerSecondCounterStore").innerHTML = `${personalization.currentClickedPlural} Per Second: ${variableView.cookiesPerSecondView}`;
        document.getElementById("cookiesPerSecondCounterStats").innerHTML = `${personalization.currentClickedPlural} Per Second: ${variableView.cookiesPerSecondView}`;
        document.getElementById("cookiesPerSecondCounterOptions").innerHTML = `${personalization.currentClickedPlural} Per Second: ${variableView.cookiesPerSecondView}`;
    }
}
helper.reloadBuildingPrices = function() { // doesn't account for modded buildings, figuring that out is the work of the developer (sorry!)
    keyboard.reloadPrice();
    grandpa.reloadPrice();
    ranch.reloadPrice();
    television.reloadPrice();
    worker.reloadPrice();
    wallet.reloadPrice();
    church.reloadPrice();
}
helper.consoleLogDev = function(str) {
    if (dev.devMode) {
        console.log(str);
    }
}
helper.commaify = function(toComma) {
    let commaifyed = toComma.toLocaleString("en-US");
    return commaifyed;
}
function hideTooltip() {
    document.getElementById("tooltip").style.display = "none";
}
function capitalize(str) {
    if (!str) {str = this;}

    const capitalized =
        str.charAt(0).toUpperCase()
        + str.slice(1);

    return capitalized;
}
String.prototype.capitalize = capitalize;

// Popups
helper.popup = {};
helper.popup.createSimple = function(x,y,text,noButton=false,doWhat="default",title="",backButton=false,isError=false) {
    document.getElementById("simplePopup").style.display = "flex";
    document.getElementById("simplePopupContent").innerHTML = text;
    document.getElementById("simplePopup").style.width = `${x}px`;
    document.getElementById("simplePopupButtonDiv").style.width = `${x}px`;
    document.getElementById("simplePopup").style.height = `${y}px`;
    if (title == "") {
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
        document.getElementById("simplePopup").style.borderColor = "red";
    } else {
        document.getElementById("simplePopup").style.borderColor = "black";
    }

    const filter = document.getElementById("filter");
    filter.style.display = "block";

    if (doWhat !== "default") {
        document.getElementById("simplePopupButton").setAttribute("onclick",`helper.popup.simpleClicked(\"${doWhat}\")`);
    } else {
        document.getElementById("simplePopupButton").setAttribute("onclick","helper.popup.simpleClicked()");
    }
}
helper.popup.destroySimple = function() {
    document.getElementById("simplePopup").style.display = "none";
    document.getElementById("simplePopupContent").innerHTML = "null";
    document.getElementById("simplePopupButton").style.display = "none";
    document.getElementById("filter").style.display = "none";
}
helper.popup.simpleClicked = function(doWhat="default") {
    switch (doWhat) {
        case "default":
            helper.popup.destroySimple();
            break;
        case "resetSave()":
            saves.resetSave();
            helper.popup.destroySimple();
            break;
        case "localStorage.clear()":
            localStorage.clear();
            helper.popup.destroySimple();
            location.reload();
            break;
        default:
            alert(`Simple Popup doWhat is invalid, value is: ${doWhat} \nPlease report this to the GitHub accessable in the bottom left corner`)
            this.destroySimple();
    }
    if (core.cookies < 0) { // TODO 0.6: investigate
        core.cookies = 0;
    }
}
helper.popup.createAdvanced = function(x,y,html,filter=true) { // i would recommend only adding filter if the popup is clickable, but not all are so it can be toggled
    const advancedPopup = document.getElementById("advancedPopup");

    advancedPopup.style.display = "flex";
    advancedPopup.style.width = `${x}px`;
    advancedPopup.style.height = `${y}px`;

    if (filter) { document.getElementById("filter").style.display = "block"; }

    advancedPopup.innerHTML = html;
}
helper.popup.destroyAdvanced = function() {
    document.getElementById("advancedPopup").style.display = "none";
    document.getElementById("filter").style.display = "none";
}

// set areas to different things
personalization.setBackground = function(color) {
    if (!mobile) {
        personalization.currentBackground = `url(img/backgrounds/background-${color}.png)`;
    }
    if (mobile || desktop) {
        personalization.currentBackground = `url(../img/backgrounds/background-${color}.png)`;
    }
    if (!mobile) {
        document.getElementById("leftSide").style.background = personalization.currentBackground;
        document.getElementById("middleButtons").style.background = personalization.currentBackground;
        document.getElementById("rightSide").style.background = personalization.currentBackground;
    } else {
        document.querySelector(".content").style.background = `linear-gradient(to right, rgba(0,0,0,0.2), rgba(0,0,0,0.2)), ${personalization.currentBackground}`;
    }

    helper.consoleLogDev(`Background color set to: ${color}`);
}

personalization.setCurrentClicked = function(value) {
    switch (value) {
        case "cookie":
            if (!mobile) {
                document.getElementById("cookie").src = "img/cookie.png";
            }
            if (mobile || desktop) {
                document.getElementById("cookie").src = "../img/cookie.png";
            }
            personalization.currentClicked = "Cookie";
            personalization.currentClickedPlural = "Cookies";
            break;
        case "potato":
            if (!mobile) {
                document.getElementById("cookie").src = "img/potato.png";
            }
            if (mobile || desktop) {
                document.getElementById("cookie").src = "../img/potato.png";
            }
            personalization.currentClicked = "Potato";
            personalization.currentClickedPlural = "Potatoes";
            break;
        case "strawberry":
            if (!mobile) {
                document.getElementById("cookie").src = "img/strawberry.png";
            }
            if (mobile) {
                document.getElementById("cookie").src = "../img/strawberry.png";
            }
            personalization.currentClicked = "Strawberry";
            personalization.currentClickedPlural = "Strawberries";
            break;
    }
    upgrades.descriptions[0] = `Multiplys Keyboard and clicking ${this.currentClicked} production by 2`;
}

// ------------------------------------
// Random Functions
// ------------------------------------
function toggleMiddle(param) {
    const statsMT = document.getElementById("statsMiddleText");
    const infoMT = document.getElementById("infoMiddleText");
    const optionsMT = document.getElementById("optionsMiddleText");
    const middle = document.getElementById("middle");
    const middleBackground = "radial-gradient(rgb(8, 8, 8), rgb(3, 3, 3), black)";
    statsMT.style.display = "none";
    infoMT.style.display = "none";
    optionsMT.style.display = "none";
    if (param == "stats") {
        switch (statsUp) {
            case 0:
                optionsUp = 0;
                infoUp = 0;
                statsUp = 1;
                statsMT.style.display = "block";
                middle.style.background = middleBackground;
                break;
            case 1:
                statsUp = 0;
                optionsMT.style.display = "none";
                middle.style.background = personalization.currentBackground;
                break;
        }
    }
    if (param == "info") {
        switch (infoUp) {
            case 0:
                statsUp = 0;
                optionsUp = 0;
                infoUp = 1;
                infoMT.style.display = "block";
                middle.style.background = middleBackground;
                break;
            case 1:
                infoUp = 0;
                infoMT.style.display = "none";
                middle.style.background = personalization.currentBackground;
                break;
        }
    }
    if (param == "options") {
        switch (optionsUp) {
            case 0:
                statsUp = 0;
                infoUp = 0;
                optionsUp = 1;
                optionsMT.style.display = "block";
                middle.style.background = middleBackground;
                break;
            case 1:
                optionsUp = 0;
                optionsMT.style.display = "none";
                middle.style.background = personalization.currentBackground;
                break;
        }
    }
}
function closeMiddle() {
    optionsUp = 0;
    infoUp = 0;
    statsUp = 0;

    document.getElementById("optionsMiddleText").style.display = "none";
    document.getElementById("statsMiddleText").style.display = "none";
    document.getElementById("infoMiddleText").style.display = "none";
    document.getElementById("middle").style.background = personalization.currentBackground;
}
function versionNumberMousedOver(undo=false) {
    if (!undo) {
        document.getElementById("versionSwitchInfo").style.display = "block";
    } else {
        document.getElementById("versionSwitchInfo").style.display = "none";
    }
}
function versionSwitch() {
    if (versionBranch) {
        window.location.href = "/";
    } else {
        window.location.href = "/beta/beta.html";
    }
}

// ------------------------------------
// Saving
// ------------------------------------
saves.exportData = function() {
    saves.autoSave();
    const dataJSON = !versionBranch ? JSON.stringify(localStorage.save) : JSON.stringify(localStorage.betaSave);

    const textToBLOB = new Blob([dataJSON], { type: 'text/plain' });
    const sFileName = 'save.ccsave';

    let newLink = document.createElement("a");
    newLink.download = sFileName;

    if (window.webkitURL != null) {
        newLink.href = window.webkitURL.createObjectURL(textToBLOB);
    }
    else {
        newLink.href = window.URL.createObjectURL(textToBLOB);
        newLink.style.display = "none";
        document.body.appendChild(newLink);
    }

    newLink.click(); 
}

saves.importData = function() {
    saves.autoSave();
    var file = document.getElementById("importDataInput").files[0];
    var reader = new FileReader();

    reader.onload = function (e) {
        saves.rawImportedData = JSON.parse(reader.result);
    }
    reader.onerror = (e) => alert("something broke, don't expect me to fix it :D");

    reader.readAsText(file);
    
    reader.onloadend = () => {
        saves.importReadData();
    };
}
saves.importReadData = function() {
    saves.importedData = JSON.parse(saves.rawImportedData);
    helper.consoleLogDev("imported data: ");
    helper.consoleLogDev(saves.importedData);

    const versionBranchToDisplay = !versionBranch ? "main" : "beta";
    const saveKeys = Object.keys(saves.importedData);
    saveKeys.forEach((element,index) => { // checks if save's version matches current version
        if (element == "versionBranch") {
            if (saves.importedData[element] != versionBranch) { // i had to nest this because you can't break a forEach function
                helper.popup.createSimple(300,150,`This is a save file from another version branch (${versionBranchToDisplay}). This is incompatible with this version. Please use a different file.`,false,"default","Alert",false,true);
                return false;
            }
        }
    });

    saveKeys.forEach((element,index) => {
        let variable = element;
        helper.consoleLogDev(`IMPORT: variable: ${variable}, data: ${saves.importedData[element]}, element: ${element}`);
        try {
            if (element == "upgrades.bought" || element == "upgrades.unlocked") { // arrays don't work without inserting brackets when using eval
                eval(`${variable} = [${saves.importedData[element]}]`);
            } else {
                eval(`${variable} = ${saves.importedData[element]}`); // YES, i know i shouldn't use this. I have no idea how to do this otherwise so yeah probably will stay.
            }
        } catch {
            helper.consoleLogDev(`Attempted to save to constant variable ${variable}`);
        }
    });
    helper.reloadBuildingPrices();

    upgrades.destroyAll();
    upgrades.showUnlocked();

    helper.consoleLogDev(`Imported save with ${core.cookies} cookies.`);

    if (mobile) {
        navbarItemClicked("Cookie");
    }
}

saves.autoSave = function() { // yes if you are wondering i totally 100% without a doubt wrote this code
    const save = {};
  
    for (let i = 0; i < this.allToSave.length; i++) {
        const variable = this.allToSave[i];
    
        // Get the name of the variable/property
        const name = typeof variable === 'object' ? variable.name : variable;
    
        // Get the value of the variable/property
        const value = typeof variable === 'object' ? variable.value : eval(variable); // YES, i know i shouldn't use this. This will be changed once 0.6 enters beta.
    
        // Add the variable/property to the object
        save[name] = value;
    }

    if (!versionBranch) {
        localStorage.setItem("save",JSON.stringify(save));
    } else {
        localStorage.setItem("betaSave",JSON.stringify(save));
    }
    if (inDevelopment) {console.log("save object: "); console.log(save);}

    // Update saving notification
    const indicator = document.getElementById("savingIndicator");
    indicator.classList.add("visible");

    setTimeout(function () {
        indicator.classList.remove("visible");
    }, 1500);
}

saves.loadAutoSave = function() {
    const loadedSave = !versionBranch ? JSON.parse(localStorage.getItem("save")) : JSON.parse(localStorage.getItem("betaSave"));

    const saveKeys = Object.keys(loadedSave);
    saveKeys.forEach((element,index) => {
        let variable = element;
        if (inDevelopment) {
            console.log(`loaded variable: ${variable}`);
            console.log(`loaded value: ${loadedSave[element]}`);
        }
        
        try {
            eval(`${variable} = ${loadedSave[element]}`); // YES, i know i shouldn't use this. I have no idea how to do this otherwise so yeah probably will stay.
        } catch {
            helper.consoleLogDev(`Attempted to load variable: ${variable}`);
        }
        if (variable === "upgrades.unlocked") { // arrays don't work with eval???
            upgrades.unlocked = loadedSave["upgrades.unlocked"];
        }
        if (variable === "upgrades.bought") {
            upgrades.bought = loadedSave["upgrades.bought"];
        }
    });

    helper.reloadBuildingPrices();

    upgrades.destroyAll();
    upgrades.showUnlocked();
}

saves.resetSave = function() {
    if (!versionBranch) {
        localStorage.setItem("save",JSON.stringify(saves.defaultSavedValues));
    } else {
        localStorage.setItem("betaSave",JSON.stringify(saves.defaultSavedValues));
    }
    saves.loadAutoSave();
    helper.reloadBuildingPrices();
    
    grandpa.unlocked = 0;
    ranch.unlocked = 0;
    television.unlocked = 0;
    worker.unlocked = 0;
    wallet.unlocked = 0;
    church.unlocked = 0;
    document.getElementById("ifCheatedStat").innerHTML = "";
    document.getElementById("ifModdedStat").innerHTML = "";

    upgrades.destroyAll();

    // document.getElementById("win").style.display = "none";

    document.getElementById("building1").style.display = "none";
    document.getElementById("building2").style.display = "none";
    document.getElementById("building3").style.display = "none";
    document.getElementById("building4").style.display = "none";
    document.getElementById("building5").style.display = "none";
    document.getElementById("building6").style.display = "none";

    if (mobile) {
        navbarItemClicked("Cookie");
    }
}

saves.convert05Save = function(isBeta=false, isBetaSaveOld=false) { // ! this is remaining only for the lifespan of 0.6 and will be removed in the next major update or after a certain time gap, also why this function is a nightmare to understand
    const oldSave = isBeta ? isBetaSaveOld ? JSON.parse(localStorage.getItem("betaSaveOld")) : JSON.parse(localStorage.getItem("betaSave")) : JSON.parse(localStorage.getItem("save"));

    core.cookies = oldSave[0];
    core.totalCookies = oldSave[1];
    core.cookiesPerSecond = oldSave[2];

    keyboard.CPSGiven = oldSave[3];
    grandpa.CPSGiven = oldSave[4];
    ranch.CPSGiven = oldSave[5];
    television.CPSGiven = oldSave[6]
    worker.CPSGiven = oldSave[7];
    wallet.CPSGiven = oldSave[8];
    church.CPSGiven = oldSave[9];

    keyboard.bought = oldSave[10];
    grandpa.bought = oldSave[11];
    ranch.bought = oldSave[12];
    television.bought = oldSave[13];
    worker.bought = oldSave[14];
    wallet.bought = oldSave[15];
    church.bought = oldSave[16];

    keyboard.CPSGain = oldSave[17];
    grandpa.CPSGain = oldSave[18];
    ranch.CPSGain = oldSave[19];
    television.CPSGain = oldSave[20];
    worker.CPSGain = oldSave[21];
    wallet.CPSGain = oldSave[22];
    church.CPSGain = oldSave[23];

    keyboard.upgradeCost = oldSave[24];
    grandpa.upgradeCost = oldSave[25];
    ranch.upgradeCost = oldSave[26];
    television.upgradeCost = oldSave[27];
    worker.upgradeCost = oldSave[28];
    wallet.upgradeCost = oldSave[29];
    church.upgradeCost = oldSave[30];

    // no more upgrades bought crap

    core.cookiesPerClick = oldSave[38];
    core.cookieBeenClickedTimes = oldSave[39];
    core.buildingsOwned = oldSave[40];
    // no grandma prompt clicks
    hasCheated = oldSave[42];
    // no won
    isModded = oldSave[44];
    // obviously no version branch

    upgrades.unlocked = this.defaultSavedValues["upgrades.unlocked"];
    upgrades.bought = this.defaultSavedValues["upgrades.bought"];

    saves.autoSave();

    grandpa.unlocked = 0;
    ranch.unlocked = 0;
    television.unlocked = 0;
    worker.unlocked = 0;
    wallet.unlocked = 0;
    church.unlocked = 0;
    document.getElementById("ifCheatedStat").innerHTML = "";
    document.getElementById("ifModdedStat").innerHTML = "";

    upgrades.destroyAll();
    keyboard.CPSGain = 0.1;
    grandpa.CPSGain = 1;
    ranch.CPSGain = 8;
    television.CPSGain = 47;
    worker.CPSGain = 260;
    wallet.CPSGain = 1440;
    church.CPSGain = 7800;

    // document.getElementById("win").style.display = "none";

    if (oldSave[11] >= 1) {
        document.getElementById("building1").style.display = "block";
    } else {
        document.getElementById("building1").style.display = "none";
    }
    if (oldSave[12] >= 1) {
        document.getElementById("building2").style.display = "block";
    } else {
        document.getElementById("building2").style.display = "none";
    }
    if (oldSave[13] >= 1) {
        document.getElementById("building3").style.display = "block";
    } else {
        document.getElementById("building3").style.display = "none";
    }
    if (oldSave[14] >= 1) {
        document.getElementById("building4").style.display = "block";
    } else {
        document.getElementById("building4").style.display = "none";
    }
    if (oldSave[15] >= 1) {
        document.getElementById("building5").style.display = "block";
    } else {
        document.getElementById("building5").style.display = "none";
    }
    if (oldSave[16] >= 1) {
        document.getElementById("building6").style.display = "block";
    } else {
        document.getElementById("building6").style.display = "none";
    }
    
    if (localStorage.getItem("devSave") != null) {
        localStorage.removeItem("devSave");
    }
    if (isBetaSaveOld) {
        localStorage.removeItem("betaSaveOld");
    }
    location.reload();
}

// ------------------------------------
// Modding
// ------------------------------------
mods.loadURL = function(url) {
    const file = document.createElement("script");
    file.setAttribute("src",url);
    file.setAttribute("type","text/javascript");
    const modId = mods.numberLoaded + 1;
    file.setAttribute("id",`mod${modId}`);

    document.head.appendChild(file);

    document.getElementById("addModURLForm").reset();
    document.getElementById("importedMessage").style.display = "block";

    mods.numberLoaded += 1;
    isModded = 1;
    document.getElementById("ifModdedStat").innerHTML = "You have activated mods on this playthrough!";
    mods.reloadModsLoadedText();
}
mods.loadFile = function() { // add check if mod is valid
    var file = document.getElementById("addModFile").files[0];
    var reader = new FileReader();

    reader.onerror = (e) => alert("something broke, don't expect me to fix it :D");

    reader.readAsText(file);
    
    reader.onloadend = () => {
        const readFile = reader.result;
        
        const script = document.createElement("script");
        script.appendChild(document.createTextNode(readFile));
        script.setAttribute("type","text/javascript");
        const modId = mods.numberLoaded + 1;
        script.setAttribute("id","mod" + modId);

        document.head.appendChild(script);

        document.getElementById("addModURLForm").reset();
        document.getElementById("importedMessage").style.display = "block";

        mods.numberLoaded += 1;
        isModded = 1;
        document.getElementById("ifModdedStat").innerHTML = "You have activated mods on this playthrough!";
        mods.reloadModsLoadedText();
    };
}

mods.list = function() {
    const numberToList = mods.allMods.length;

    for (i = 0; i < numberToList; i++) {
        const newModItem = document.createElement("div");
        newModItem.setAttribute("class","popup-content mod-in-list");
        newModItem.setAttribute("id",`modList${i}`);

        const newModID = document.createElement("small");
        newModID.appendChild(document.createTextNode(`#${i}`));
        newModID.setAttribute("class","mod-id popup-content");
        newModItem.appendChild(newModID);

        const newModName = document.createElement("p");
        newModName.appendChild(document.createTextNode(JSON.stringify(mods.allMods[i])));
        newModName.setAttribute("class","popup-content");
        newModItem.appendChild(newModName);

        document.getElementById("modsList").appendChild(newModItem);
    }

    if (numberToList === 0) {document.getElementById("noModsMessage").style.display = "block";}
    if (numberToList > 0) {document.getElementById("removeModsMessage").style.display = "block";}
}

mods.addModData = function(id,data) { // yes i basically stole and renamed this entire function from cookie clicker's Game.registerMod orteil did it better okay i might seem smart but i'm really not.
    // READ THE DOCS!
    if (mods.allMods.includes(id)) {
        helper.popup.createAdvanced(400,200,"<h3 class='simple-popup-title' style='display:block;'>Error</h3> \
        <p class='popup-content'>This mod's ID is already present!</p> \
        <button onclick='helper.popup.destroyAdvanced()' id='simplePopupButton' class='popup-button' style='margin-top:20px;'>OK</button>");
        mods.numberLoaded -= 1;
        mods.reloadModsLoadedText();
        return false;
    }
    mods.allMods.push(id);
    document.getElementById("ifModdedStat").innerHTML = "You have activated mods on this playthrough!";
    isModded = 1;
    data.initialization();
    console.log(`Loaded mod ${id}`);
}

mods.addClicked = function() {
    helper.popup.createAdvanced(500,350,"<h3 class='simple-popup-title' style='display:block;'>Add Mod</h3> \
    <h5 class='popup-content' style='color:red; margin-bottom:3px; margin-top:5px;'>WARNING!</h5> \
    <h5 class='popup-content' style='color:red; margin-top:0px; margin-bottom:0px;'>Adding mods without verifying their legitimacy can result in unintended side effects! We are not responsible for any damages that may be caused by mods!</h5> \
    <h5 class='popup-content' style='margin-top:5px; margin-bottom:0px;'>For information regarding mods, <a onclick='saves.autoSave()' href='https://github.com/clickercookie/clickercookie.github.io/wiki/Modding' class='blue'>read the documentation</a>.</h5> \
    <form onsubmit='return false;' id='addModURLForm' style='margin-top:22px;'> \
        <label for='addModURL' class='popup-content'>From URL: </label> \
        <input id='addModURL' onchange='mods.loadURL(this.value)'> \
    </form> \
    <form> \
        <label for='addModFile' class='popup-content' style='margin-right:0px;'>From File: </label> \
        <input type='file' id='addModFile' onchange='mods.loadFile(this.value)' class='popup-content' style='width:86px;'> \
    </form> \
    <p class='popup-content no-display' id='importedMessage' style='font-size:13px; margin-top:7px; margin-bottom:0px;'>Imported!</p> \
    <button onclick='helper.popup.destroyAdvanced()' id='simplePopupButton' class='popup-button' style='margin-top:20px;'>OK</button>");
}
mods.listClicked = function() {
    helper.popup.createAdvanced(300,350,"<h3 class='simple-popup-title' style='display:block;'>All Mods</h3> \
    <p class='popup-content no-display' id='noModsMessage' style='font-size:13px; margin-top:7px; margin-bottom:0px;'>You have no mods installed!</p> \
    <div id='modsList' class='mods-list'></div> \
    <small class='popup-content no-display' id='removeModsMessage' style='margin-top:3px;'>To remove mods, refresh your page. (make sure to save!)</small> \
    <button onclick='helper.popup.destroyAdvanced()' id='simplePopupButton' class='popup-button' style='margin-top:20px;'>OK</button>");

    mods.list();
}

mods.reloadModsLoadedText = function() {
    document.getElementById("modsNumberLoaded").innerHTML = `You have ${mods.numberLoaded} mods loaded!`;
}

function print() {
    helper.popup.createSimple(250,150,"it's console.log",false,"default","dum dum",false,true)
}

// Changelog Entries
function createChangelogEntry(version,added=undefined,changed=undefined,fixed=undefined,name=undefined,release="???") {
    const changelog = document.querySelector(".changelog-wrapper");

    const newChangelogEntry = document.createElement("div");
    newChangelogEntry.setAttribute("name",`version${version}`);
    newChangelogEntry.setAttribute("class","changelog");

    const versionHeader = document.createElement("h5");
    versionHeader.setAttribute("class","changelog-version-heading");
    if (name === undefined) {
        versionHeader.appendChild(document.createTextNode(`Version ${version} - ${release}`));
    } else {
        versionHeader.appendChild(document.createTextNode(`Version ${version}: ${name} - ${release}`));
    }
    newChangelogEntry.appendChild(versionHeader)

    if (added !== undefined) {
        const addedHeader = document.createElement("p");
        addedHeader.setAttribute("class","middle-text");
        addedHeader.appendChild(document.createTextNode("Added:"));
        newChangelogEntry.appendChild(addedHeader);

        const addedList = document.createElement("ul");
        addedList.setAttribute("class","middle-ul");
        newChangelogEntry.appendChild(addedList);

        for (i = 0; i < added.length; i++) {
            const addedListItem = document.createElement('li');
            addedListItem.innerText = added[i];
            addedList.appendChild(addedListItem);
        }
    }
    if (changed !== undefined) {
        const changedHeader = document.createElement("p");
        changedHeader.setAttribute("class","middle-text");
        changedHeader.appendChild(document.createTextNode("Changed:"));
        newChangelogEntry.appendChild(changedHeader);

        const changedList = document.createElement("ul");
        changedList.setAttribute("class","middle-ul");
        newChangelogEntry.appendChild(changedList);

        for (i = 0; i < changed.length; i++) {
            const changedListItem = document.createElement('li');
            changedListItem.innerText = changed[i];
            changedList.appendChild(changedListItem);
        }
    }
    if (fixed !== undefined) {
        const fixedHeader = document.createElement("p");
        fixedHeader.setAttribute("class","middle-text");
        fixedHeader.appendChild(document.createTextNode("Fixed:"));
        newChangelogEntry.appendChild(fixedHeader);

        const fixedList = document.createElement("ul");
        fixedList.setAttribute("class","middle-ul");
        newChangelogEntry.appendChild(fixedList);

        for (i = 0; i < fixed.length; i++) {
            const fixedListItem = document.createElement('li');
            fixedListItem.innerText = fixed[i];
            fixedList.appendChild(fixedListItem);
        }
    }

    changelog.appendChild(newChangelogEntry)
}

console.log("what are you doing here? well... as long as its productive.");

// buildings have to be made here instead of init because of scope
const keyboard = new Building("keyboard","type in cookies",15,0.1,0,"keyboard.png");
keyboard.unlocked = 1;
const grandpa = new Building("grandpa","as long as gramps gets a cut",100,1,1,"grandpa.png");
grandpa.setVisibility(false);
const ranch = new Building("ranch","not the dressing kind",1100,8,2,"ranch.png",true);
ranch.setVisibility(false);
const television = new Building("television","hold infomercials on your cookies",12000,47,3,"tv.png");
television.setVisibility(false);
const worker = new Building("worker","cookies via manual labor",130000,260,4,"worker.png");
worker.setVisibility(false);
const wallet = new Building("wallet","more storage space for your vast amount of cookie income",1400000,1440,5,"wallet.png");
wallet.setVisibility(false);
const church = new Building("church","pray to the almighty cookie gods",20000000,7800,6,"church.png",true);
church.setVisibility(false);

core.initialization();