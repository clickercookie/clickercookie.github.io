// ------------------------------------
// Variable & Object Definitions
// ------------------------------------
const version = "0.6";
const versionBranch = 1; // 0 is main, 1 is beta
const inDevelopment = 0; // toggle if developing actively. This is completely different than the builtin dev mode! Recommended that versionBranch is 1 for easier saving if this is toggled.
const desktop = false;

// customization
const personalization = {};

personalization.currentBackground = "url(img/backgrounds/background-blue.png)";

personalization.currentClicked = "Cookie";
personalization.currentClickedPlural = "Cookies";
personalization.currentClickedLowercase = "cookie";
personalization.currentClickedLowercasePlural = "cookies";

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

// tad bit complex, documentation on this is coming
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
    "Reinforced Keys","Obsidian Keys","Osmium Keys","10 finger typing","keyboard5", // keyboard
    "Hardwood Walking Stick","grandpa2","grandpa3","grandpa4","grandpa5", // grandpa
    "Pig Slop","ranch2","ranch3","ranch4","ranch5", // ranch
    "LED Display","television2","television3","television4","television5", // television
    "Medkits","worker2","worker3","worker4","worker5", // worker
    "200 dollar bills","wallet2","wallet3","wallet4","wallet5", // wallet
    "church1","church2","church3","church4","church5", // church
];
upgrades.quotes = [
    "press harder","so heavy they're always pressed","that's very heavy","<i><b>efficiency</b></i>","temp", // keyboard
    "nonna dat softwood junk","temp","temp","temp","temp", // grandpa
    "Wait, what have we been feeding them before now?","temp","temp","temp","temp", // ranch
    "World's greatest leap in digital technology","temp","temp","temp","temp", // television
    "Constant supply of Band-Aids in case of emergency","temp","temp","temp","temp", // worker
    "I'm sure the federal reserve will be okay with this...","temp","temp","temp","temp", // wallet
    "temp","temp","temp","temp","temp", // church
];
upgrades.descriptions = ["Multiplys Keyboard and clicking cookie production by 2","Multiplys Grandpa production by 2","Multiplys Ranch production by 2","Multiplys TV production by 2","Multiplys Worker production by 2","Multiplys Wallet production by 2","Multiplys Church production by 2"];

upgrades.upgradesBought = 0;

// buildings
const buildings = {};

let buildingInfoName = "Name";
let buildingInfoPrice = 0;
let buildingInfoQuote = "Quote";
let buildingInfoProduces = 0;
let buildingInfoProducing = 0;

// keyboards
buildings.keyboard = {
    bought: 0,
    CPSGain: 0.1,
    CPSGiven: 0,
    upgradeCost: 15
};
// grandpas
buildings.grandpa = {
    bought: 0,
    CPSGain: 1,
    CPSGiven: 0,
    upgradeCost: 100,
    unlocked: 0
};
// ranches
buildings.ranch = {
    bought: 0,
    CPSGain: 8,
    CPSGiven: 0,
    upgradeCost: 1100,
    unlocked: 0
};
// televisions
buildings.tv = {
    bought: 0,
    CPSGain: 47,
    CPSGiven: 0,
    upgradeCost: 12000,
    unlocked: 0
};
// workers
buildings.worker = {
    bought: 0,
    CPSGain: 260,
    CPSGiven: 0,
    upgradeCost: 130000,
    unlocked: 0
};
// wallets
buildings.wallet = {
    bought: 0,
    CPSGain: 1440,
    CPSGiven: 0,
    upgradeCost: 1400000,
    unlocked: 0
};
// churches
buildings.church = {
    bought: 0,
    CPSGain: 7800,
    CPSGiven: 0,
    upgradeCost: 20000000,
    unlocked: 0
};

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
let grandmaPromptClicks = 0;
let cookieProductionStopped = 0;
let buttonDoWhat = "default";
let hasCheated = 0;
let won = 0;
let mobile;
let savingAllowed = true;

// save stuff
const saves = {};
saves.rawImportedData; // parsed data from the Import function but cannot be read
saves.importedData; // Data from the Import function
saves.allToSave = ["core.cookies", "core.totalCookies", "core.cookiesPerSecond", // List of every variable that should be saved, in no particular order.
                "buildings.keyboard.CPSGiven","buildings.grandpa.CPSGiven","buildings.ranch.CPSGiven","buildings.tv.CPSGiven","buildings.worker.CPSGiven","buildings.wallet.CPSGiven","buildings.church.CPSGiven",
                "buildings.keyboard.bought","buildings.grandpa.bought","buildings.ranch.bought","buildings.tv.bought","buildings.worker.bought","buildings.wallet.bought","buildings.church.bought",
                "buildings.keyboard.CPSGain","buildings.grandpa.CPSGain","buildings.ranch.CPSGain","buildings.tv.CPSGain","buildings.worker.CPSGain","buildings.wallet.CPSGain","buildings.church.CPSGain",
                "buildings.keyboard.upgradeCost","buildings.grandpa.upgradeCost","buildings.ranch.upgradeCost","buildings.tv.upgradeCost","buildings.worker.upgradeCost","buildings.wallet.upgradeCost","buildings.church.upgradeCost",
                "upgrades.unlocked","upgrades.bought","upgrades.upgradesBought",
                "core.cookiesPerClick","core.cookieBeenClickedTimes","core.buildingsOwned","grandmaPromptClicks","hasCheated","won","isModded","versionBranch"
];
saves.defaultSavedValues = { // Should be self-explanatory. Doesn't have to be ordered like allToSave, but I would appreciate if it was.
    "core.cookies":0, "core.totalCookies":0, "core.cookiesPerSecond":0,
    "buildings.keyboard.CPSGiven":0,"buildings.grandpa.CPSGiven":0,"buildings.ranch.CPSGiven":0,"buildings.tv.CPSGiven":0,"buildings.worker.CPSGiven":0,"buildings.wallet.CPSGiven":0,"buildings.church.CPSGiven":0,
    "buildings.keyboard.bought":0,"buildings.grandpa.bought":0,"buildings.ranch.bought":0,"buildings.tv.bought":0,"buildings.worker.bought":0,"buildings.wallet.bought":0,"buildings.church.bought":0,
    "buildings.keyboard.CPSGain":0.1,"buildings.grandpa.CPSGain":1,"buildings.ranch.CPSGain":8,"buildings.tv.CPSGain":47,"buildings.worker.CPSGain":260,"buildings.wallet.CPSGain":1440,"buildings.church.CPSGain":7800,
    "buildings.keyboard.upgradeCost":15,"buildings.grandpa.upgradeCost":100,"buildings.ranch.upgradeCost":1100,"buildings.tv.upgradeCost":12000,"buildings.worker.upgradeCost":130000,"buildings.wallet.upgradeCost":1400000,"buildings.church.upgradeCost":20000000,
    "upgrades.unlocked":upgrades.unlocked,"upgrades.bought":upgrades.bought,"upgrades.upgradesBought":0,
    "core.cookiesPerClick":1,"core.cookieBeenClickedTimes":0,"core.buildingsOwned":0,"grandmaPromptClicks":0,"hasCheated":0,"won":0,"isModded":0,"versionBranch":versionBranch
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
    if (localStorage.save[0] == "[" || localStorage.betaSave[0] == "[") {
        helper.popup.createAdvanced(400,220,"<h3 class='simple-popup-title' style='display:block;'>oh no</h3> \
        <p class='popup-content'>so bad news, your save is invalid. good news, it won't ever be invalidated again. so yeah, sorry about that...</p> \
        <div style='display:flex;flex-direction:row;height:40px;'> \
        <button onclick='saves.resetSave(true)' id='simplePopupButton' class='popup-button' style='margin-top:20px;width:auto;margin-right:3px'>Reformat me!</button> \
        </div>");
        return "Save the save!";
    }

    if (won == 1) {
        document.getElementById("win").style.display = "block";
    }
    if (hasCheated == 1) {
        document.getElementById("ifCheatedStat").innerHTML = "You have cheated on this playthrough!";
    }

    // check for development special stuff
    if (inDevelopment == 1) {
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
        document.getElementById("versionNumber").innerHTML = "Version: " + version + " Dev";

        dev.setDevMode("on");
        document.getElementById("offSelectionDev").innerHTML = "Overwritten";
    }

    // change version branch specific stuff
    switch (versionBranch) {
        case 0:
            // change title
            document.getElementById("title").innerHTML = "Clicker Cookie";
            // change version displayed
            document.getElementById("versionNumber").innerHTML = "Version: " +version;
            document.getElementById("versionSwitchInfoText").innerHTML = "Clicking this will switch to the beta branch";
            break;
        case 1:
            // change title
            document.getElementById("title").innerHTML = "Clicker Cookie Beta";
            // change version displayed
            document.getElementById("versionNumber").innerHTML = "Version: " +version+ " Beta";
            document.getElementById("versionSwitchInfoText").innerHTML = "Clicking this will switch to the main branch";
            // show the developer mode switch
            document.getElementById("devForm").style.display = "block";
            break;
    }
    switch (inDevelopment) {
        case 0:
            break;
        case 1:
            document.getElementById("title").innerHTML = "Clicker Cookie Dev";
            break;
    }

    // Changelog Entries, AKA the messiest place ever.
    createChangelogEntry("0.6",["The long awaited 5 upgrades for every single building. No upgrades are planned beyond this."],
    ["The saving system. Yes, 3rd time or something, but this time I GURANTEE it's going to stick.",
    "All changelog entries are now created with Javascript to cut down on the HTML size."],
    ["Centering of buildings bought was done stupidly, fixed now.",
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
            switch (versionBranch) {
                case 0:
                    location.href = "mobile/mobile.html";
                    break;
                case 1:
                    location.href = "../mobile/mobile.html";
                    break;
            }
        }
    }
    else {
        mobile = 0;
    }
    
    // this would go after data is loaded, but it requires the mobile variable to be assigned a value
    if (isModded == 1 && mobile == 0) {
        document.getElementById("ifModdedStat").innerHTML = "You have activated mods on this playthrough!";
    }
}

// mouse position stuff
let mousePos = { x: undefined, y: undefined };
let mousePosY = `${mousePos.y}`;

window.addEventListener('mousemove', (event) => {
    mousePos = { x: event.clientX, y: event.clientY };
    if (inDevelopment == 1) {
        document.getElementById("mousePosDevText").textContent = "Mouse Pos: " + `(${mousePos.x}, ${mousePos.y})`;
    }
    mousePosY = `${mousePos.y}`;
});

let buildingInfoYPos = `${mousePos.y}` - 50;

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
        buildings.grandpa.unlocked = 1;
    }
    if (core.totalCookies >= 700) {
        buildings.ranch.unlocked = 1;
    }
    if (core.totalCookies >= 8000) {
        buildings.tv.unlocked = 1;
    }
    if (core.totalCookies >= 80000) {
        buildings.worker.unlocked = 1;
    }
    if (core.totalCookies >= 700000) {
        buildings.wallet.unlocked = 1;
    }
    if (core.totalCookies >= 15000000) {
        buildings.church.unlocked = 1;
    }

    // these 2 could be combined, but would make manually unlocking buildings more difficult

    // keep unlocked
    if (buildings.grandpa.unlocked == 1) {
        document.getElementById("building1").style.display = "block";
    }
    else {
        document.getElementById("building1").style.display = "none";
    }
    if (buildings.ranch.unlocked == 1) {
        document.getElementById("building2").style.display = "block";
    }
    else {
        document.getElementById("building2").style.display = "none";
    }
    if (buildings.tv.unlocked == 1) {
        document.getElementById("building3").style.display = "block";
    }
    else {
        document.getElementById("building3").style.display = "none";
    }
    if (buildings.worker.unlocked == 1) {
        document.getElementById("building4").style.display = "block";
    }
    else {
        document.getElementById("building4").style.display = "none";
    }
    if (buildings.wallet.unlocked == 1) {
        document.getElementById("building5").style.display = "block";
    }
    else {
        document.getElementById("building5").style.display = "none";
    }
    if (buildings.church.unlocked == 1) {
        document.getElementById("building6").style.display = "block";
    }
    else {
        document.getElementById("building6").style.display = "none";
    }

    // check for grandma's visit
    if (core.totalCookies >= 1000000000) {
        core.grandmasArrival();
    }

    // check for stopped cookie production
    if (cookieProductionStopped == 1) {
        core.cookies = 0;
    }

    // set buildingInfo y to ${mousePos.y}
    buildingInfoYPos = `${mousePos.y}` - 50;
    document.getElementById("buildingInfo").style.top = buildingInfoYPos + "px";

    // log to console in case of error
    if (core.cookies < 0) {
        helper.popup.createSimple(300,150,"<i>huh, what just happened?</i> <br> An error occured: " + personalization.currentClickedPlural + " are in negative!<br>Please report this to the GitHub accessable in the bottom left corner",false,"default","",false,true);
    }
    // stats that need to be updated beforehand
    core.buildingsOwned = buildings.keyboard.bought + buildings.grandpa.bought + buildings.ranch.bought + buildings.tv.bought + buildings.worker.bought + buildings.wallet.bought + buildings.church.bought;
    
    // set statistic page statistics
    if (statsUp == 1) {
        document.getElementById("cookiesStat").innerHTML = personalization.currentClickedPlural + ": " + helper.commaify(variableView.cookiesView);
        document.getElementById("allTimeCookies").innerHTML = "All Time " + personalization.currentClickedPlural + ": " + helper.commaify(variableView.totalCookiesView);
        document.getElementById("cookiesPerSecondStat").innerHTML = personalization.currentClickedPlural + " Per Second: " + helper.commaify(variableView.cookiesPerSecondView);
        document.getElementById("buildingsOwnedStat").innerHTML = "Buildings Owned: " + helper.commaify(core.buildingsOwned);
        document.getElementById("cookieBeenClickedTimesStat").innerHTML = "Total " + personalization.currentClicked + " Clicks: " + helper.commaify(core.cookieBeenClickedTimes); // move to cookieClicked() later
        document.getElementById("upgradesBoughtStat").innerHTML = `Upgrades Bought: ${upgrades.upgradesBought}`;
    }

    // set number of bought to bought (not required unless number of bought is set in console)
    document.getElementById("keyboardsBought").innerHTML = +buildings.keyboard.bought;
    document.getElementById("grandpasBought").innerHTML = +buildings.grandpa.bought;
    document.getElementById("ranchesBought").innerHTML = +buildings.ranch.bought;
    document.getElementById("tvsBought").innerHTML = +buildings.tv.bought;
    document.getElementById("workersBought").innerHTML = +buildings.worker.bought;
    document.getElementById("walletsBought").innerHTML = +buildings.wallet.bought;
    document.getElementById("churchesBought").innerHTML = +buildings.church.bought;

    core.cookiesPerSecond = buildings.keyboard.CPSGiven+buildings.grandpa.CPSGiven+buildings.ranch.CPSGiven+buildings.tv.CPSGiven+buildings.worker.CPSGiven+buildings.wallet.CPSGiven+buildings.church.CPSGiven+dev.CPSGiven;
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
dev.beginGrandma = function() {
    if (dev.devMode == 1) {
        dev.setCookies(1000000000);
        document.getElementById("ifCheatedStat").innerHTML = "You have cheated on this playthrough!";
        hasCheated = 1;
        grandmaPromptClicks = 0;
    }
    else {
        console.log("You need developer mode ON to run this command.");
    }
}
dev.ignoreGrandma = function() {
    if (dev.devMode == 1) {
        grandmaPromptClicks = 10;
        document.getElementById("ifCheatedStat").innerHTML = "You have cheated on this playthrough!";
        hasCheated = 1;
    }
    else {
        console.log("You need developer mode ON to run this command.");
    }
}
dev.setCookies = function(x) {
    if (dev.devMode == 1) {
        core.cookies = x;
        core.totalCookies = core.totalCookies + x;
        hasCheated = 1;
        helper.reloadCookieCounter();
        document.getElementById("ifCheatedStat").innerHTML = "You have cheated on this playthrough!";
        dev.ignoreGrandma();
    }
    else {
        console.log("You need developer mode ON to run this command.");
    }
}
dev.setCPS = function(x) {
    if (dev.devMode == 1) {
        dev.CPSGiven = x;
        hasCheated = 1;
        variableView.cookiesPerSecondView = Math.round(core.cookiesPerSecond * 10) / 10;
        helper.reloadCPSCounter();
        document.getElementById("ifCheatedStat").innerHTML = "<b>You have cheated on this playthrough!</b>";
        dev.ignoreGrandma();
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
        document.getElementById("currentSavingStatus").innerHTML = "saving: "+savingAllowed;
    } else {
        console.log("You need developer mode ON to run this command.");
    }
}

function versionSwitch() {
    switch (versionBranch) {
        case 0:
            window.location.href = "/beta/beta.html";
            break;
        case 1:
            window.location.href = "/";
            break;
    }
}

// ------------------------------------
// Buildings
// ------------------------------------
buildings.keyboard.buy = function() {
    if (core.cookies >= buildings.keyboard.upgradeCost) {
        core.cookies -= buildings.keyboard.upgradeCost;
        buildings.keyboard.upgradeCost *= 1.15;
        buildings.keyboard.upgradeCost = Math.floor(buildings.keyboard.upgradeCost);
        buildings.keyboard.bought += 1;
        buildings.keyboard.CPSGiven += buildings.keyboard.CPSGain;
        helper.reloadCookieCounter();
        document.getElementById("keyboardUpgrade").innerHTML = helper.commaify(buildings.keyboard.upgradeCost);
        document.getElementById("keyboardsBought").innerHTML = buildings.keyboard.bought;
        buildings.hovered("keyboard");
    }
}
buildings.grandpa.buy = function() {
    if (core.cookies >= buildings.grandpa.upgradeCost) {
        core.cookies -= buildings.grandpa.upgradeCost;
        buildings.grandpa.upgradeCost *= 1.15;
        buildings.grandpa.upgradeCost = Math.floor(buildings.grandpa.upgradeCost);
        buildings.grandpa.bought += 1;
        buildings.grandpa.CPSGiven += buildings.grandpa.CPSGain;
        helper.reloadCookieCounter();
        document.getElementById("grandpaUpgrade").innerHTML = helper.commaify(buildings.grandpa.upgradeCost);
        document.getElementById("grandpasBought").innerHTML = buildings.grandpa.bought;
        buildings.hovered("grandpa");
    }
}
buildings.ranch.buy = function() {
    if (core.cookies >= buildings.ranch.upgradeCost) {
        core.cookies -= buildings.ranch.upgradeCost;
        buildings.ranch.upgradeCost *= 1.15;
        buildings.ranch.upgradeCost = Math.floor(buildings.ranch.upgradeCost);
        buildings.ranch.bought += 1;
        buildings.ranch.CPSGiven += buildings.ranch.CPSGain;
        helper.reloadCookieCounter();
        document.getElementById("ranchUpgrade").innerHTML = helper.commaify(buildings.ranch.upgradeCost);
        document.getElementById("ranchesBought").innerHTML = buildings.ranch.bought;
        buildings.hovered("ranch");
    }
}
buildings.tv.buy = function() {
    if (core.cookies >= buildings.tv.upgradeCost) {
        core.cookies -= buildings.tv.upgradeCost;
        buildings.tv.upgradeCost *= 1.15;
        buildings.tv.upgradeCost = Math.floor(buildings.tv.upgradeCost);
        buildings.tv.bought += 1;
        buildings.tv.CPSGiven += buildings.tv.CPSGain;
        helper.reloadCookieCounter();
        document.getElementById("tvUpgrade").innerHTML = helper.commaify(buildings.tv.upgradeCost);
        document.getElementById("tvsBought").innerHTML = buildings.tv.bought;
        buildings.hovered("tv");
    }
}
buildings.worker.buy = function() {
    if (core.cookies >= buildings.worker.upgradeCost) {
        core.cookies -= buildings.worker.upgradeCost;
        buildings.worker.upgradeCost *= 1.15;
        buildings.worker.upgradeCost = Math.floor(buildings.worker.upgradeCost);
        buildings.worker.bought += 1;
        buildings.worker.CPSGiven += buildings.worker.CPSGain;
        helper.reloadCookieCounter();
        document.getElementById("workerUpgrade").innerHTML = helper.commaify(buildings.worker.upgradeCost);
        document.getElementById("workersBought").innerHTML = buildings.worker.bought;
        buildings.hovered("worker");
    }
}
buildings.wallet.buy = function() {
    if (core.cookies >= buildings.wallet.upgradeCost) {
        core.cookies -= buildings.wallet.upgradeCost;
        buildings.wallet.upgradeCost *= 1.15;
        buildings.wallet.upgradeCost = Math.floor(buildings.wallet.upgradeCost);
        buildings.wallet.bought += 1;
        buildings.wallet.CPSGiven += buildings.wallet.CPSGain;
        helper.reloadCookieCounter();
        document.getElementById("walletUpgrade").innerHTML = helper.commaify(buildings.wallet.upgradeCost);
        document.getElementById("walletsBought").innerHTML = buildings.wallet.bought;
        buildings.hovered("wallet");
    }
}
buildings.church.buy = function() {
    if (core.cookies >= buildings.church.upgradeCost) {
        core.cookies -= buildings.church.upgradeCost;
        buildings.church.upgradeCost *= 1.15;
        buildings.church.upgradeCost = Math.floor(buildings.church.upgradeCost);
        buildings.church.bought += 1;
        buildings.church.CPSGiven += buildings.church.CPSGain;
        helper.reloadCookieCounter();
        document.getElementById("churchUpgrade").innerHTML = helper.commaify(buildings.church.upgradeCost);
        document.getElementById("churchesBought").innerHTML = buildings.church.bought;
        buildings.hovered("church");
    }
}

buildings.hovered = function(building) {
    switch (building) {
        case "keyboard":
            buildingInfoName = "Keyboard";
            buildingInfoPrice = helper.commaify(buildings.keyboard.upgradeCost);
            buildingInfoQuote = "type in cookies";
            buildingInfoProduces = helper.commaify(buildings.keyboard.CPSGain);
            buildingInfoProducing = helper.commaify(Math.round(buildings.keyboard.CPSGiven * 10) / 10);
            break;
        case "grandpa":
            buildingInfoName = "Grandpa";
            buildingInfoPrice = helper.commaify(buildings.grandpa.upgradeCost);
            buildingInfoQuote = "as long as gramps gets a cut";
            buildingInfoProduces = helper.commaify(buildings.grandpa.CPSGain);
            buildingInfoProducing = helper.commaify(Math.round(buildings.grandpa.CPSGiven * 10) / 10);
            break;
        case "ranch":
            buildingInfoName = "Ranch";
            buildingInfoPrice = helper.commaify(buildings.ranch.upgradeCost);
            buildingInfoQuote = "Not the dressing kind";
            buildingInfoProduces = helper.commaify(buildings.ranch.CPSGain);
            buildingInfoProducing = helper.commaify(Math.round(buildings.ranch.CPSGiven * 10) / 10);
            break;
        case "tv":
            buildingInfoName = "Television";
            buildingInfoPrice = helper.commaify(buildings.tv.upgradeCost);
            buildingInfoQuote = "hold infomercials on your cookies";
            buildingInfoProduces = helper.commaify(buildings.tv.CPSGain);
            buildingInfoProducing = helper.commaify(Math.round(buildings.tv.CPSGiven * 10) / 10);
            break;
        case "worker":
            buildingInfoName = "Worker";
            buildingInfoPrice = helper.commaify(buildings.worker.upgradeCost);
            buildingInfoQuote = "cookies via manual labor";
            buildingInfoProduces = helper.commaify(buildings.worker.CPSGain);
            buildingInfoProducing = helper.commaify(Math.round(buildings.worker.CPSGiven * 10) / 10);
            break;
        case "wallet":
            buildingInfoName = "Wallet";
            buildingInfoPrice = helper.commaify(buildings.wallet.upgradeCost);
            buildingInfoQuote = "store cookies and make interest?"; // CHANGE ME
            buildingInfoProduces = helper.commaify(buildings.wallet.CPSGain);
            buildingInfoProducing = helper.commaify(Math.round(buildings.wallet.CPSGiven * 10) / 10);
            break;
        case "church":
            buildingInfoName = "Church";
            buildingInfoPrice = helper.commaify(buildings.church.upgradeCost);
            buildingInfoQuote = "pray to the almighty cookie gods";
            buildingInfoProduces = helper.commaify(buildings.church.CPSGain);
            buildingInfoProducing = helper.commaify(Math.round(buildings.church.CPSGiven * 10) / 10);
            break;
    }
    if (!mobile) {
        document.getElementById("buildingInfoName").innerHTML = buildingInfoName;
        document.getElementById("buildingInfoPrice").innerHTML = "Price: " + buildingInfoPrice;
        document.getElementById("buildingInfoQuote").innerHTML = "\""+buildingInfoQuote+"\"";
        document.getElementById("buildingInfoProduces").innerHTML = "Produces: "+buildingInfoProduces+" CPS";
        document.getElementById("buildingInfoProducing").innerHTML = "Producing: "+ buildingInfoProducing+" CPS";
    }

    document.getElementById("buildingInfo").style.display = "block";
}
buildings.undoHover = function() {
    document.getElementById("buildingInfo").style.display = "none";
}

// ------------------------------------
// Upgrades
// ------------------------------------
upgrades.create = function(id,icon) {
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
    upgrade.setAttribute("onmouseout","upgrades.undoHover()")
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
}

upgrades.clicked = function(id,building) { // yes it's messy, dont judge me
    switch (building) {
    case 0:
        if (core.cookies >= upgrades.prices[id]) {
            core.cookies -= upgrades.prices[id];
            buildings.keyboard.CPSGiven *= 2;
            buildings.keyboard.CPSGain *= 2;
            core.cookiesPerClick *= 2;
            upgrades.bought[id] = 1;
            if (!mobile) {
                upgrades.hovered(id,building);
            }
            upgrades.destroy(id);
            upgrades.upgradesBought += 1;
        }
        break;
    case 1:
        if (core.cookies >= upgrades.prices[id]) {
            core.cookies -= upgrades.prices[id];
            buildings.grandpa.CPSGiven *= 2;
            buildings.grandpa.CPSGain *= 2;
            upgrades.bought[id] = 1;
            if (!mobile) {
                upgrades.hovered(id,building);
            }
            upgrades.destroy(id);
            upgrades.upgradesBought += 1;
        }
        break;
    case 2:
        if (core.cookies >= upgrades.prices[id]) {
            core.cookies -= upgrades.prices[id];
            buildings.ranch.CPSGiven *= 2;
            buildings.ranch.CPSGain *= 2;
            upgrades.bought[id] = 1;
            if (!mobile) {
                upgrades.hovered(id,building);
            }
            upgrades.destroy(id);
            upgrades.upgradesBought += 1;
        }
        break;
    case 3:
        if (core.cookies >= upgrades.prices[id]) {
            core.cookies -= upgrades.prices[id];
            buildings.tv.CPSGiven *= 2;
            buildings.tv.CPSGain *= 2;
            upgrades.bought[id] = 1;
            if (!mobile) {
                upgrades.hovered(id,building);
            }
            upgrades.destroy(id);
            upgrades.upgradesBought += 1;
        }
        break;
    case 4:
        if (core.cookies >= upgrades.prices[id]) {
            core.cookies -= upgrades.prices[id];
            buildings.worker.CPSGiven *= 2;
            buildings.worker.CPSGain *= 2;
            upgrades.bought[id] = 1;
            if (!mobile) {
                upgrades.hovered(id,building);
            }
            upgrades.destroy(id);
            upgrades.upgradesBought += 1;
        }
        break;
    case 5:
        if (core.cookies >= upgrades.prices[id]) {
            core.cookies -= upgrades.prices[id];
            buildings.wallet.CPSGiven *= 2;
            buildings.wallet.CPSGain *= 2;
            upgrades.bought[id] = 1;
            if (!mobile) {
                upgrades.hovered(id,building);
            }
            upgrades.destroy(id);
            upgrades.upgradesBought += 1;
        }
        break;
    case 6:
        if (core.cookies >= upgrades.prices[id]) {
            core.cookies -= upgrades.prices[id];
            buildings.church.CPSGiven *= 2;
            buildings.church.CPSGain *= 2;
            upgrades.bought[id] = 1;
            if (!mobile) {
                upgrades.hovered(id,building);
            }
            upgrades.destroy(id);
            upgrades.upgradesBought += 1;
        }
        break;
    }
}

upgrades.destroy = function(id) {
    document.getElementById(`upgrade${id}`).remove();
    if (!mobile) {
        upgrades.undoHover();
    }
}
upgrades.destroyAll = function() {
    for (i = 0; i < upgrades.unlocked.length; i++) {
        try {
            document.getElementById(`upgrade${i}`).remove();
        } catch {
            continue
        }
    }
}

upgrades.hovered = function(id,building) {
    document.getElementById("upgradeName").innerHTML = "Name: " + upgrades.names[id];
    document.getElementById("upgradePrice").innerHTML = "Price: " + helper.commaify(upgrades.prices[id])
    document.getElementById("upgradeDesc").innerHTML = `Description: ${upgrades.descriptions[building]} <br> <i>\"${upgrades.quotes[id]}\"</i>`;

    document.getElementById("upgradeViewer").style.display = "block";
    document.getElementById("upgradeViewer").style.float = "right";
}
upgrades.undoHover = function() {
    document.getElementById("upgradeName").innerHTML = "Name: ";
    document.getElementById("upgradePrice").innerHTML = "Price: ";
    document.getElementById("upgradeDesc").innerHTML = "Description: ";

    document.getElementById("upgradeViewer").style.display = "none";
    document.getElementById("upgradeViewer").style.float = "right";
}
upgrades.showUnlocked = function() { // yes it's terrible, don't judge me
    // Keyboards
    if (upgrades.unlocked[0] == 1 && upgrades.bought[0] != 1) {upgrades.create(0,"reinforced-keys.png");}
    if (upgrades.unlocked[1] == 1 && upgrades.bought[1] != 1) {upgrades.create(1,"obsidian-keys.png");}
    if (upgrades.unlocked[2] == 1 && upgrades.bought[2] != 1) {upgrades.create(2);}
    if (upgrades.unlocked[3] == 1 && upgrades.bought[3] != 1) {upgrades.create(3);}
    if (upgrades.unlocked[4] == 1 && upgrades.bought[4] != 1) {upgrades.create(4);}
    // Grandpas
    if (upgrades.unlocked[5] == 1 && upgrades.bought[5] != 1) {upgrades.create(5,"hardwood-walking-stick.png");}
    if (upgrades.unlocked[6] == 1 && upgrades.bought[6] != 1) {upgrades.create(6);}
    if (upgrades.unlocked[7] == 1 && upgrades.bought[7] != 1) {upgrades.create(7);}
    if (upgrades.unlocked[8] == 1 && upgrades.bought[8] != 1) {upgrades.create(8);}
    if (upgrades.unlocked[9] == 1 && upgrades.bought[9] != 1) {upgrades.create(9);}
    // Ranches
    if (upgrades.unlocked[10] == 1 && upgrades.bought[10] != 1) {upgrades.create(10,"ranch-upgrade1.png");}
    if (upgrades.unlocked[11] == 1 && upgrades.bought[11] != 1) {upgrades.create(11);}
    if (upgrades.unlocked[12] == 1 && upgrades.bought[12] != 1) {upgrades.create(12);}
    if (upgrades.unlocked[13] == 1 && upgrades.bought[13] != 1) {upgrades.create(13);}
    if (upgrades.unlocked[14] == 1 && upgrades.bought[14] != 1) {upgrades.create(14);}
    // Televisions
    if (upgrades.unlocked[15] == 1 && upgrades.bought[15] != 1) {upgrades.create(15,"tv-upgrade1.png");}
    if (upgrades.unlocked[16] == 1 && upgrades.bought[16] != 1) {upgrades.create(16);}
    if (upgrades.unlocked[17] == 1 && upgrades.bought[17] != 1) {upgrades.create(17);}
    if (upgrades.unlocked[18] == 1 && upgrades.bought[18] != 1) {upgrades.create(18);}
    if (upgrades.unlocked[19] == 1 && upgrades.bought[19] != 1) {upgrades.create(19);}
    // Workers
    if (upgrades.unlocked[20] == 1 && upgrades.bought[20] != 1) {upgrades.create(20,"worker-upgrade1.png");}
    if (upgrades.unlocked[21] == 1 && upgrades.bought[21] != 1) {upgrades.create(21);}
    if (upgrades.unlocked[22] == 1 && upgrades.bought[22] != 1) {upgrades.create(22);}
    if (upgrades.unlocked[23] == 1 && upgrades.bought[23] != 1) {upgrades.create(23);}
    if (upgrades.unlocked[24] == 1 && upgrades.bought[24] != 1) {upgrades.create(24);}
    // Wallets
    if (upgrades.unlocked[25] == 1 && upgrades.bought[25] != 1) {upgrades.create(25);}
    if (upgrades.unlocked[26] == 1 && upgrades.bought[26] != 1) {upgrades.create(26);}
    if (upgrades.unlocked[27] == 1 && upgrades.bought[27] != 1) {upgrades.create(27);}
    if (upgrades.unlocked[28] == 1 && upgrades.bought[28] != 1) {upgrades.create(28);}
    if (upgrades.unlocked[29] == 1 && upgrades.bought[29] != 1) {upgrades.create(29);}
    // Churches
    if (upgrades.unlocked[30] == 1 && upgrades.bought[30] != 1) {upgrades.create(30);}
    if (upgrades.unlocked[31] == 1 && upgrades.bought[31] != 1) {upgrades.create(31);}
    if (upgrades.unlocked[32] == 1 && upgrades.bought[32] != 1) {upgrades.create(32);}
    if (upgrades.unlocked[33] == 1 && upgrades.bought[33] != 1) {upgrades.create(33);}
    if (upgrades.unlocked[34] == 1 && upgrades.bought[34] != 1) {upgrades.create(34);}
}
upgrades.checkUpgradeAvailability = function() { // Upgrade Unlocks (very long, changes would be greatly appreciated!)
    // Keyboards
    if (buildings.keyboard.bought >= 1 && upgrades.unlocked[0] == 0) {
        upgrades.unlocked[0] = 1;
        upgrades.create(0,"reinforced-keys.png");
    }
    if (buildings.keyboard.bought >= 5 && upgrades.unlocked[1] == 0) {
        upgrades.unlocked[1] = 1;
        upgrades.create(1,"obsidian-keys.png");
    }
    if (buildings.keyboard.bought >= 10 && upgrades.unlocked[2] == 0) {
        upgrades.unlocked[2] = 1;
        upgrades.create(2);
    }
    if (buildings.keyboard.bought >= 25 && upgrades.unlocked[3] == 0) {
        upgrades.unlocked[3] = 1;
        upgrades.create(3);
    }
    if (buildings.keyboard.bought >= 50 && upgrades.unlocked[4] == 0) {
        upgrades.unlocked[4] = 1;
        upgrades.create(4);
    }
    // Grandpas
    if (buildings.grandpa.bought >= 1 && upgrades.unlocked[5] == 0) {
        upgrades.unlocked[5] = 1;
        upgrades.create(5,"hardwood-walking-stick.png");
    }
    if (buildings.grandpa.bought >= 5 && upgrades.unlocked[6] == 0) {
        upgrades.unlocked[6] = 1;
        upgrades.create(6);
    }
    if (buildings.grandpa.bought >= 10 && upgrades.unlocked[7] == 0) {
        upgrades.unlocked[7] = 1;
        upgrades.create(7);
    }
    if (buildings.grandpa.bought >= 25 && upgrades.unlocked[8] == 0) {
        upgrades.unlocked[8] = 1;
        upgrades.create(8);
    }
    if (buildings.grandpa.bought >= 50 && upgrades.unlocked[9] == 0) {
        upgrades.unlocked[9] = 1;
        upgrades.create(9);
    }
    // Ranches
    if (buildings.ranch.bought >= 1 && upgrades.unlocked[10] == 0) {
        upgrades.unlocked[10] = 1;
        upgrades.create(10,"ranch-upgrade1.png");
    }
    if (buildings.ranch.bought >= 5 && upgrades.unlocked[11] == 0) {
        upgrades.unlocked[11] = 1;
        upgrades.create(11);
    }
    if (buildings.ranch.bought >= 10 && upgrades.unlocked[12] == 0) {
        upgrades.unlocked[12] = 1;
        upgrades.create(12);
    }
    if (buildings.ranch.bought >= 25 && upgrades.unlocked[13] == 0) {
        upgrades.unlocked[13] = 1;
        upgrades.create(13);
    }
    if (buildings.ranch.bought >= 50 && upgrades.unlocked[14] == 0) {
        upgrades.unlocked[14] = 1;
        upgrades.create(14);
    }
    // TVs
    if (buildings.tv.bought >= 1 && upgrades.unlocked[15] == 0) {
        upgrades.unlocked[15] = 1;
        upgrades.create(15,"tv-upgrade1.png");
    }
    if (buildings.tv.bought >= 5 && upgrades.unlocked[16] == 0) {
        upgrades.unlocked[16] = 1;
        upgrades.create(16);
    }
    if (buildings.tv.bought >= 10 && upgrades.unlocked[17] == 0) {
        upgrades.unlocked[17] = 1;
        upgrades.create(17);
    }
    if (buildings.tv.bought >= 25 && upgrades.unlocked[18] == 0) {
        upgrades.unlocked[18] = 1;
        upgrades.create(18);
    }
    if (buildings.tv.bought >= 50 && upgrades.unlocked[19] == 0) {
        upgrades.unlocked[19] = 1;
        upgrades.create(19);
    }
    // Workers
    if (buildings.worker.bought >= 1 && upgrades.unlocked[20] == 0) {
        upgrades.unlocked[20] = 1;
        upgrades.create(20,"worker-upgrade1.png");
    }
    if (buildings.worker.bought >= 5 && upgrades.unlocked[21] == 0) {
        upgrades.unlocked[21] = 1;
        upgrades.create(21);
    }
    if (buildings.worker.bought >= 10 && upgrades.unlocked[22] == 0) {
        upgrades.unlocked[22] = 1;
        upgrades.create(22);
    }
    if (buildings.worker.bought >= 25 && upgrades.unlocked[23] == 0) {
        upgrades.unlocked[23] = 1;
        upgrades.create(23);
    }
    if (buildings.worker.bought >= 50 && upgrades.unlocked[24] == 0) {
        upgrades.unlocked[24] = 1;
        upgrades.create(24);
    }
    // Wallets
    if (buildings.wallet.bought >= 1 && upgrades.unlocked[25] == 0) {
        upgrades.unlocked[25] = 1;
        upgrades.create(25);
    }
    if (buildings.wallet.bought >= 5 && upgrades.unlocked[26] == 0) {
        upgrades.unlocked[26] = 1;
        upgrades.create(26);
    }
    if (buildings.wallet.bought >= 10 && upgrades.unlocked[27] == 0) {
        upgrades.unlocked[27] = 1;
        upgrades.create(27);
    }
    if (buildings.wallet.bought >= 25 && upgrades.unlocked[28] == 0) {
        upgrades.unlocked[28] = 1;
        upgrades.create(28);
    }
    if (buildings.wallet.bought >= 50 && upgrades.unlocked[29] == 0) {
        upgrades.unlocked[29] = 1;
        upgrades.create(29);
    }
    // Churches
    if (buildings.church.bought >= 1 && upgrades.unlocked[30] == 0) {
        upgrades.unlocked[30] = 1;
        upgrades.create(30);
    }
    if (buildings.church.bought >= 5 && upgrades.unlocked[31] == 0) {
        upgrades.unlocked[31] = 1;
        upgrades.create(31);
    }
    if (buildings.church.bought >= 10 && upgrades.unlocked[32] == 0) {
        upgrades.unlocked[32] = 1;
        upgrades.create(32);
    }
    if (buildings.church.bought >= 25 && upgrades.unlocked[33] == 0) {
        upgrades.unlocked[33] = 1;
        upgrades.create(33);
    }
    if (buildings.church.bought >= 50 && upgrades.unlocked[34] == 0) {
        upgrades.unlocked[34] = 1;
        upgrades.create(34);
    }
}

function versionNumberMousedOver() {
    document.getElementById("versionSwitchInfo").style.display = "block";
}
function versionNumberMousedOverUndo() {
    document.getElementById("versionSwitchInfo").style.display = "none";
}

// ------------------------------------
// Helper Functions
// ------------------------------------
helper.reloadCookieCounter = function() {
    document.getElementById("cookieCounter").innerHTML = personalization.currentClickedPlural + ": " +variableView.cookiesView;
    if (mobile) {
        document.getElementById("cookieCounterStore").innerHTML = personalization.currentClickedPlural + ": " +variableView.cookiesView;
        document.getElementById("cookieCounterStats").innerHTML = personalization.currentClickedPlural + ": " +variableView.cookiesView;
        document.getElementById("cookieCounterOptions").innerHTML = personalization.currentClickedPlural + ": " +variableView.cookiesView;
    }
}
helper.reloadCPSCounter = function() {
    document.getElementById("cookiesPerSecondCounter").innerHTML = personalization.currentClickedPlural + " Per Second: " +variableView.cookiesPerSecondView;
    if (mobile) {
        document.getElementById("cookiesPerSecondCounterStore").innerHTML = personalization.currentClickedPlural + " Per Second: " +variableView.cookiesPerSecondView;
        document.getElementById("cookiesPerSecondCounterStats").innerHTML = personalization.currentClickedPlural + " Per Second: " +variableView.cookiesPerSecondView;
        document.getElementById("cookiesPerSecondCounterOptions").innerHTML = personalization.currentClickedPlural + " Per Second: " +variableView.cookiesPerSecondView;
    }
}
helper.reloadBuildingPrices = function() {
    document.getElementById("keyboardUpgrade").innerHTML = helper.commaify(buildings.keyboard.upgradeCost);
    document.getElementById("grandpaUpgrade").innerHTML = helper.commaify(buildings.grandpa.upgradeCost);
    document.getElementById("ranchUpgrade").innerHTML = helper.commaify(buildings.ranch.upgradeCost);
    document.getElementById("tvUpgrade").innerHTML = helper.commaify(buildings.tv.upgradeCost);
    document.getElementById("workerUpgrade").innerHTML = helper.commaify(buildings.worker.upgradeCost);
    document.getElementById("walletUpgrade").innerHTML = helper.commaify(buildings.wallet.upgradeCost);
    document.getElementById("churchUpgrade").innerHTML = helper.commaify(buildings.church.upgradeCost);
}
helper.consoleLogDev = function(str) {
    if (dev.devMode == 1) {
        console.log(str);
    }
}
helper.commaify = function(toComma) {
    let commaifyed = toComma.toLocaleString("en-US");
    return commaifyed;
}

// Popups
helper.popup = {};
helper.popup.createSimpleAlertError = function(value) {
    switch (inDevelopment) {
        case 0:
            alert("An error occured: helper.popup.createSimple() has no " + value + " value. Please report this to the GitHub.");
            break;
        case 1:
            if (value == "title") {
                alert("helper.popup.createSimple() needs a "+value+" value. Use \"\" for a blank title");
            }
            else {
                alert("helper.popup.createSimple() needs a "+value+" value.");
            }
            break;
    }
}
helper.popup.createSimple = function(x,y,text,noButton,doWhat,title,backButton,isError) {
    document.getElementById("simplePopup").style.display = "flex";
    document.getElementById("simplePopupContent").innerHTML = text;
    document.getElementById("simplePopup").style.width = x + "px";
    document.getElementById("simplePopupButtonDiv").style.width = x + "px";
    document.getElementById("simplePopup").style.height = y + "px";
    switch (title) {
        case "":
            document.getElementById("simplePopupTitle").style.display = "none";
            break;
        case "undefined":
            helper.popup.createSimpleAlertError("title");
            break;
        default:
            document.getElementById("simplePopupTitle").style.display = "block";
            document.getElementById("simplePopupTitle").innerHTML = title;
            break;
    }
    switch (noButton) {
        case true:
            document.getElementById("simplePopupButton").style.display = "none";
            break;
        case false:
            document.getElementById("simplePopupButton").style.display = "inline-block";
            break;
        default:
            helper.popup.createSimpleAlertError(noButton);
            break;
    }
    switch (backButton) {
        case true:
            document.getElementById("simplePopupBackButton").style.display = "inline-block";
            break;
        case false:
            document.getElementById("simplePopupBackButton").style.display = "none";
            break;
        default:
            helper.popup.createSimpleAlertError("backButton");
            break;
    }
    switch (isError) {
        case true:
            document.getElementById("simplePopup").style.borderColor = "red";
            break;
        case false:
            document.getElementById("simplePopup").style.borderColor = "black";
            break;
        default:
            helper.popup.createSimpleAlertError("isError");
            break;
    }

    const filter = document.getElementById("filter");
    filter.style.display = "block";

    popupButtonDo = doWhat;
}
helper.popup.destroySimple = function() {
    document.getElementById("simplePopup").style.display = "none";
    document.getElementById("simplePopupContent").innerHTML = "null";
    document.getElementById("simplePopupButton").style.display = "none";
    document.getElementById("filter").style.display = "none";
}
helper.popup.simpleClicked = function() {
    switch (popupButtonDo) {
        case "default":
            helper.popup.destroySimple();
            break;
        case "grandmaPromptClicks":
            grandmaPromptClicks = grandmaPromptClicks + 1;
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
    }
    if (core.cookies < 0) {
        core.cookies = 0;
    }
}
helper.popup.createAdvanced = function(x,y,html) {
    const advancedPopup = document.getElementById("advancedPopup");

    advancedPopup.style.display = "flex";
    advancedPopup.style.width = x+"px";
    advancedPopup.style.height = y+"px";

    advancedPopup.innerHTML = html;
}
helper.popup.destroyAdvanced = function() {
    document.getElementById("advancedPopup").style.display = "none";
}

// set areas to different things
personalization.setBackground = function(color) {
    if (!mobile) {
        personalization.currentBackground = "url(img/backgrounds/background-" + color + ".png)";
    }
    if (mobile || desktop) {
        personalization.currentBackground = "url(../img/backgrounds/background-" + color + ".png)";
    }
    if (!mobile) {
        document.getElementById("leftSide").style.background = personalization.currentBackground;
        document.getElementById("middleButtons").style.background = personalization.currentBackground;
        document.getElementById("rightSide").style.background = personalization.currentBackground;
    }
    else {
        document.querySelector(".content").style.background = "linear-gradient(to right, rgba(0,0,0,0.2), rgba(0,0,0,0.2)), "+ personalization.currentBackground;
    }

    helper.consoleLogDev("Background color set to: " + color);
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
            personalization.currentClickedLowercase = "cookie";
            personalization.currentClickedLowercasePlural = "cookies";
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
            personalization.currentClickedLowercase = "potato";
            personalization.currentClickedLowercasePlural = "potatoes";
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
            personalization.currentClickedLowercase = "strawberry";
            personalization.currentClickedLowercasePlural = "strawberries";
            break;
    }
}

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

// toggle menu openness
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

core.grandmasArrival = function() {
    switch (grandmaPromptClicks) {
        case 0:
            helper.popup.createSimple(300,150,"a familiar face appears...",false,"grandmaPromptClicks","",false,false);
            break;
        case 1:
            if (!mobile) {
                document.getElementById("simplePopupImage").src = "img/grandma.png";
            }
            if (mobile || desktop) {
                document.getElementById("simplePopupImage").src = "../img/grandma.png";
            }
            document.getElementById("simplePopupImage").style.display = "block";
            helper.popup.createSimple(300,150,"hello...",false,"grandmaPromptClicks","",false,false);
            break;
        case 2:
            helper.popup.createSimple(300,150,"how long have you done this for?",false,"grandmaPromptClicks","",false,false);
            break;
        case 3:
            helper.popup.createSimple(300,150,"oh my...",false,"grandmaPromptClicks","",false,false);
            break;
        case 4:
            helper.popup.createSimple(300,150,"well i suppose you must know this:",false,"grandmaPromptClicks","",false,false);
            break;
        case 5:
            helper.popup.createSimple(300,150,"<i>there is nothing else to do here</i>",false,"grandmaPromptClicks","",false,false);
            break;
        case 6:
            helper.popup.createSimple(300,150,"you win.",false,"grandmaPromptClicks","",false,false);
            document.getElementById("win").style.display = "block";
            won = 1;
            break;
        case 7:
            helper.popup.createSimple(300,150,"you may keep going...",false,"grandmaPromptClicks","",false,false);
            break;
        case 8:
            helper.popup.createSimple(300,150,"but you will be wasting your time.",false,"grandmaPromptClicks","",false,false);
            break;
        case 9:
            helper.popup.destroySimple();
            document.getElementById("simplePopupImage").src = "";
            document.getElementById("simplePopupImage").style.display = "none";
            grandmaPromptClicks = grandmaPromptClicks + 1;
            break;
    }
}

// ------------------------------------
// Saving
// ------------------------------------
saves.exportData = function() {
    saves.autoSave();
    let dataJSON;
    switch (versionBranch) {
        case 0:
            dataJSON = JSON.stringify(localStorage.save);
            break;
        case 1:
            dataJSON = JSON.stringify(localStorage.betaSave);
            break;
    }

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

    let versionBranchToDisplay;
    if (!versionBranch) {
        versionBranchToDisplay = "main";
    } else {
        versionBranchToDisplay = "beta";
    }
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
        
        try {
            eval(`${variable} = ${saves.importedData[element]}`); // YES, i know i shouldn't use this. I have no idea how to do this otherwise so yeah probably will stay.
        } catch {
            helper.consoleLogDev("Attempted to save to constant variable, probably just versionBranch...");
        }
    });
    helper.reloadBuildingPrices();

    helper.consoleLogDev("Imported save with " +core.cookies+ " cookies.");

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

    switch (versionBranch) {
        case 0:
            localStorage.setItem("save",JSON.stringify(save));
            break;
        case 1:
            localStorage.setItem("betaSave",JSON.stringify(save));
            break;
    }
    if (inDevelopment) {console.log("save object: "); console.log(save);}
}

saves.loadAutoSave = function() {
    let loadedSave;
    if (!versionBranch) {
        loadedSave = JSON.parse(localStorage.getItem("save"));
    } else {
        loadedSave = JSON.parse(localStorage.getItem("betaSave"));
    }

    const saveKeys = Object.keys(loadedSave);
    saveKeys.forEach((element,index) => {
        let variable = element;
        if (inDevelopment) {
            console.log("loaded variable: " + variable);
            console.log("loaded value: "+loadedSave[element]);
        }
        
        try {
            eval(`${variable} = ${loadedSave[element]}`); // YES, i know i shouldn't use this. I have no idea how to do this otherwise so yeah probably will stay.
        } catch {
            helper.consoleLogDev("Attempted to change value of constant variable in loading, probably just versionBranch...");
        }
        if (variable === "upgrades.unlocked") { // arrays don't work with eval???
            upgrades.unlocked = loadedSave["upgrades.unlocked"];
        }
        if (variable === "upgrades.bought") {
            upgrades.bought = loadedSave["upgrades.bought"];
        }
    });

    helper.reloadBuildingPrices();
    upgrades.showUnlocked();
}

saves.resetSave = function(fromInit=false) {
    switch (versionBranch) {
        case 0:
            localStorage.setItem("save",JSON.stringify(saves.defaultSavedValues));
            break;
        case 1:
            localStorage.setItem("betaSave",JSON.stringify(saves.defaultSavedValues));
            break;
        default:
            alert("Resetting save is not functional because versionBranch is invalid!");
            break;
    }
    saves.loadAutoSave();
    helper.reloadBuildingPrices();
    // set unlocked for all to false because im a idiot and forgot to save it
    buildings.grandpa.unlocked = 0;
    buildings.ranch.unlocked = 0;
    buildings.tv.unlocked = 0;
    buildings.worker.unlocked = 0;
    buildings.wallet.unlocked = 0;
    buildings.church.unlocked = 0;
    document.getElementById("ifCheatedStat").innerHTML = "";

    upgrades.destroyAll();

    document.getElementById("win").style.display = "none";

    if (mobile) {
        navbarItemClicked("Cookie");
    }

    if (fromInit) {
        localStorage.setItem("save",JSON.stringify(saves.defaultSavedValues));
        localStorage.setItem("betaSave",JSON.stringify(saves.defaultSavedValues));
        localStorage.removeItem("devSave");
        location.reload();
    }
}

// ------------------------------------
// Modding
// ------------------------------------
mods.loadURL = function(url) {
    const file = document.createElement("script");
    file.setAttribute("src",url);
    file.setAttribute("type","text/javascript");
    const modId = mods.numberLoaded + 1;
    file.setAttribute("id","mod" + modId);

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

    let listLeft = numberToList;
    while (listLeft > 0) {
        const newModItem = document.createElement("div");
        newModItem.setAttribute("class","popup-content mod-in-list");
        newModItem.setAttribute("id","modList" + listLeft);

        const newModID = document.createElement("small");
        newModID.appendChild(document.createTextNode("#" + listLeft));
        newModID.setAttribute("class","mod-id popup-content");
        newModItem.appendChild(newModID);

        const newModName = document.createElement("p");
        newModName.appendChild(document.createTextNode(JSON.stringify(mods.allMods[listLeft - 1])));
        newModName.setAttribute("class","popup-content");
        newModItem.appendChild(newModName);

        document.getElementById("modsList").appendChild(newModItem);
        listLeft -= 1;
    }

    if (numberToList == 0) {document.getElementById("noModsMessage").style.display = "block";}
    if (numberToList > 0) {document.getElementById("removeModsMessage").style.display = "block";}
}

mods.addModData = function(id,data) { // yes i basically stole and renamed this entire function from cookie clicker's Game.registerMod orteil did it better okay i might seem smart but i'm really not.
    // READ THE DOCS!
    if (mods.allMods.includes(id)) {
        helper.popup.createAdvanced(400,200,"<h3 class='simple-popup-title' style='display:block;'>Error</h3> \
        <p class='popup-content'>This mod's ID is already present!</p> \
        <button onclick='helper.popup.destroyAdvanced()' id='simplePopupButton' class='popup-button' style='margin-top:20px;'>OK</button>");
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
    document.getElementById("modsNumberLoaded").innerHTML = "You have " + mods.numberLoaded + " mods loaded!";
}

function print() {
    helper.popup.createSimple(250,150,"it's console.log",false,"default","dum dum",false,true)
}

// Changelog Entries
function createChangelogEntry(version,added=undefined,changed=undefined,fixed=undefined,name=undefined,release="???") {
    const changelog = document.querySelector(".changelog-wrapper");

    const newChangelogEntry = document.createElement("div");
    newChangelogEntry.setAttribute("name","version"+version);
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

core.initialization();