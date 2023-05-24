// ------------------------------------
// Variable & Object Definitions
// ------------------------------------
const version = "0.5.1";
const versionBranch = 1; // 0 is main, 1 is beta
const inDevelopment = 0; // toggle if developing actively. This is completely different than the builtin dev mode! Recommended that versionBranch is 1 for easier saving if this is toggled.

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

upgrades.upgrade0 = {}, upgrades.upgrade1 = {}, upgrades.upgrade2 = {}, upgrades.upgrade3 = {}, upgrades.upgrade4 = {}, upgrades.upgrade5 = {}, upgrades.upgrade6 = {};

upgrades.upgrade0.bought = 0;
upgrades.upgrade1.bought = 0;
upgrades.upgrade2.bought = 0;
upgrades.upgrade3.bought = 0;
upgrades.upgrade4.bought = 0;
upgrades.upgrade5.bought = 0;
upgrades.upgrade6.bought = 0;

upgrades.upgrade0.price = 100;
upgrades.upgrade1.price = 1000;
upgrades.upgrade2.price = 11000;
upgrades.upgrade3.price = 120000;
upgrades.upgrade4.price = 1300000;
upgrades.upgrade5.price = 14000000;
upgrades.upgrade6.price = 100;

upgrades.info = {};
upgrades.info.upgrade0 = {}, upgrades.info.upgrade1 = {}, upgrades.info.upgrade2 = {}, upgrades.info.upgrade3 = {}, upgrades.info.upgrade4 = {}, upgrades.info.upgrade5 = {}, upgrades.info.upgrade6 = {};

upgrades.info.upgrade0.name = "Reinforced Keys";
upgrades.info.upgrade1.name = "Hardwood Walking Stick";
upgrades.info.upgrade2.name = "Pig Slop";
upgrades.info.upgrade3.name = "LED Display";
upgrades.info.upgrade4.name = "Medkits";
upgrades.info.upgrade5.name = "200 dollar bills";
upgrades.info.upgrade6.name = "null";
upgrades.info.upgrade0.description = "Multiplys Keyboard and clicking cookie production by 2" + "<br>" + "<i>\"" + "press harder" + "\"</i>";
upgrades.info.upgrade1.description = "Multiplys Grandpa production by 2" + "<br>" + "<i>\"" + "nonna dat softwood junk" + "\"</i>";
upgrades.info.upgrade2.description = "Multiplys Ranch production by 2" + "<br>" + "<i>\"" + "Wait, what have we been feeding them before now?" + "\"</i>";
upgrades.info.upgrade3.description = "Multiplys TV production by 2" + "<br>" + "<i>\"" + "World's greatest leap in digital technology" + "\"</i>";
upgrades.info.upgrade4.description = "Multiplys Worker production by 2" + "<br>" + "<i>\"" + "Constant supply of Band-Aids in case of emergency" + "\"</i>";
upgrades.info.upgrade5.description = "Multiplys Wallet production by 2" + "<br>" + "<i>\"" + "Don't know how the goverment is going to take to this currency" + "\"</i>";
upgrades.info.upgrade6.description = "null";

let buildingInfoName = "Name";
let buildingInfoPrice = 0;
let buildingInfoQuote = "Quote";
let buildingInfoProduces = 0;
let buildingInfoProducing = 0;

// buildings
const buildings = {};

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
let isMobile;

// save stuff
const saves = {};
saves.rawImportedData; // parsed data from the Import function but cannot be read
saves.importedData; // Data from the Import function
saves.allToSave = [core.cookies, core.totalCookies, core.cookiesPerSecond, // all additions to this variable MUST BE AT THE END, then reflected in getLocalSave()
                buildings.keyboard.CPSGiven,buildings.grandpa.CPSGiven,buildings.ranch.CPSGiven,buildings.tv.CPSGiven,buildings.worker.CPSGiven,buildings.wallet.CPSGiven,buildings.church.CPSGiven,
                buildings.keyboard.bought,buildings.grandpa.bought,buildings.ranch.bought,buildings.tv.bought,buildings.worker.bought,buildings.wallet.bought,buildings.church.bought,
                buildings.keyboard.CPSGain,buildings.grandpa.CPSGain,buildings.ranch.CPSGain,buildings.tv.CPSGain,buildings.worker.CPSGain,buildings.wallet.CPSGain,buildings.church.CPSGain,
                buildings.keyboard.upgradeCost,buildings.grandpa.upgradeCost,buildings.ranch.upgradeCost,buildings.tv.upgradeCost,buildings.worker.upgradeCost,buildings.wallet.upgradeCost,buildings.church.upgradeCost,
                upgrades.upgrade0.bought,upgrades.upgrade1.bought,upgrades.upgrade2.bought,upgrades.upgrade3.bought,upgrades.upgrade4.bought,upgrades.upgrade5.bought,upgrades.upgrade6.bought,
                core.cookiesPerClick,core.cookieBeenClickedTimes,core.buildingsOwned,grandmaPromptClicks,hasCheated,won];
saves.defaultSavedValues = [ // matches order of allToSave
    0,0,0,
    0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,
    0.1,1,8,47,260,1440,7800,
    15,100,1100,12000,130000,1400000,20000000,
    0,0,0,0,0,0,0,
    1,0,0,0,0,0];
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
    if (localStorage.getItem("devSave") == null) {
        localStorage.setItem("devSave",JSON.stringify(saves.defaultSavedValues));
        console.log("devSave was null and was automatically reset, if this is your first time playing this is an intended behavior.");
    }
    saves.loadAutoSave();
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

        const devSaveButton = document.createElement("button");
        devSaveButton.appendChild(document.createTextNode("Force Auto Save"));
        devSaveButton.setAttribute("onclick","saves.autoSave()");
        devDiv.appendChild(devSaveButton);

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
        mobileOn.appendChild(document.createTextNode("Mobile On"));
        mobileOn.setAttribute("onclick","isMobile = 1");
        devDiv.appendChild(mobileOn);

        const mobileOff = document.createElement("button");
        mobileOff.appendChild(document.createTextNode("Mobile Off"));
        mobileOff.setAttribute("onclick","isMobile = 0");
        devDiv.appendChild(mobileOff);

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

    // set default upgrades
    document.getElementById("upgrade0").style.backgroundImage = "url(img/upgrades/reinforced-keys.png)";
    document.getElementById("upgrade1").style.backgroundImage = "url(img/upgrades/hardwood-walking-stick.png)";
    document.getElementById("upgrade2").style.backgroundImage = "url(img/upgrades/ranch-upgrade1.png)";
    document.getElementById("upgrade3").style.backgroundImage = "url(img/upgrades/tv-upgrade1.png)";
    document.getElementById("upgrade4").style.backgroundImage = "url(img/upgrades/worker-upgrade1.png)";

    if (navigator.userAgent.match(/Android/i) // stolen from https://www.tutorialspoint.com/How-to-detect-a-mobile-device-with-JavaScript (doesn't always work)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)) {
        isMobile = 1;
        document.getElementById("cookie").className = "cookie-noanimation";
    }
    else {
        isMobile = 0;
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
const autoSaveInterval = setInterval(saves.autoSave, 60 * 1000);

function perMillisecondUniversal() {
    variableView.cookiesView = Math.round(core.cookies * 10) / 10;
    variableView.cookiesView = helper.commaify(variableView.cookiesView);
    variableView.totalCookiesView = Math.round(core.totalCookies * 10) / 10;
    variableView.totalCookiesView = helper.commaify(variableView.totalCookiesView);
    variableView.cookiesPerSecondView = Math.round(core.cookiesPerSecond * 10) / 10;
    variableView.cookiesPerSecondView = helper.commaify(variableView.cookiesPerSecondView);

    // CPS
    document.getElementById("cookiesPerSecondCounter").innerHTML = personalization.currentClickedPlural + " Per Second: " +variableView.cookiesPerSecondView;
    helper.reloadCookieCounter();

    // Upgrade Unlocks (very long) (changes accepted) (create a github pull request)
        // Keyboards
        if (buildings.keyboard.bought >= 1 && upgrades.upgrade0.bought == 0) {
            document.getElementById("upgrade0").style.display = "inline-block";
        }
        if (buildings.keyboard.bought >= 5 && upgrades.upgrade0.bought == 1) {
            upgrades.create("upgrade0","Obsidian Keys","Multiplys keyboard and clicking " + personalization.currentClickedLowercasePlural + " by 2","so heavy they're always pressed",500,"img/upgrades/obsidian-keys.png");
        }
        // Grandpas
        if (buildings.grandpa.bought >= 1 && upgrades.upgrade1.bought == 0) {
            document.getElementById("upgrade1").style.display = "inline-block";
        }
        // Ranches
        if (buildings.ranch.bought >= 1 && upgrades.upgrade2.bought == 0) {
            document.getElementById("upgrade2").style.display = "inline-block";
        }
        // TVs
        if (buildings.tv.bought >= 1 && upgrades.upgrade3.bought == 0) {
            document.getElementById("upgrade3").style.display = "inline-block";
        }
        // Workers
        if (buildings.worker.bought >= 1 && upgrades.upgrade4.bought == 0) {
            document.getElementById("upgrade4").style.display = "inline-block";
        }

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
        document.getElementById("cookiesPerSecondCounter").innerHTML = personalization.currentClickedPlural +" Per Second: " +cookiesPerSecondView;
        document.getElementById("ifCheatedStat").innerHTML = "<b>You have cheated on this playthrough!</b>";
        dev.ignoreGrandma();
    }
    else {
        console.log("You need developer mode ON to run this command.");
    }
}

function versionSwitch() {
    switch (versionBranch) {
        case 0:
            window.location.href = "beta/beta.html";
            break;
        case 1:
            window.location.href = "/";
            break;
    }
}

// buildings
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

// managing upgrades
upgrades.create = function(identifier,name,description,quote,price,img) {
    switch (identifier) {
        case "upgrade0":
            document.getElementById("upgrade0").style.display = "inline-block";
            upgrades.info.upgrade0.name = name;
            upgrades.info.upgrade0.description = description + "<br>" + "<i>\"" + quote + "\"</i>";
            upgrades.upgrade0.price = price;
            document.getElementById("upgrade0").style.backgroundImage = "url(" + img + ")";
            break;
        case "upgrade1":
            document.getElementById("upgrade1").style.display = "inline-block";
            upgrades.info.upgrade1.name = name;
            upgrades.info.upgrade1.description = description + "<br>" + "<i>\"" + quote + "\"</i>";
            upgrades.upgrade1.price = price;
            document.getElementById("upgrade1").style.backgroundImage = "url(" + img + ")";
            break;
        case "upgrade2":
            document.getElementById("upgrade2").style.display = "inline-block";
            upgrades.info.upgrade2.name = name;
            upgrades.info.upgrade2.description = description + "<br>" + "<i>\"" + quote + "\"</i>";
            upgrades.upgrade2.price = price;
            document.getElementById("upgrade2").style.backgroundImage = "url(" + img + ")";
            break;
        case "upgrade3":
            document.getElementById("upgrade3").style.display = "inline-block";
            upgrades.info.upgrade3.name = name;
            upgrades.info.upgrade3.description = description + "<br>" + "<i>\"" + quote + "\"</i>";
            upgrades.upgrade3.price = price;
            document.getElementById("upgrade3").style.backgroundImage = "url(" + img + ")";
            break;
        case "upgrade4":
            document.getElementById("upgrade4").style.display = "inline-block";
            upgrades.info.upgrade4.name = name;
            upgrades.info.upgrade4.description = description + "<br>" + "<i>\"" + quote + "\"</i>";
            upgrades.upgrade4.price = price;
            document.getElementById("upgrade4").style.backgroundImage = "url(" + img + ")";
            break;
        case "upgrade5":
            document.getElementById("upgrade5").style.display = "inline-block";
            upgrades.info.upgrade5.name = name;
            upgrades.info.upgrade5.description = description + "<br>" + "<i>\"" + quote + "\"</i>";
            upgrades.upgrade5.price = price;
            document.getElementById("upgrade5").style.backgroundImage = "url(" + img + ")";
            break;
        case "upgrade6":
            document.getElementById("upgrade6").style.display = "inline-block";
            upgrades.info.upgrade6.name = name;
            upgrades.info.upgrade6.description = description + "<br>" + "<i>\"" + quote + "\"</i>";
            upgrades.upgrade6.price = price;
            document.getElementById("upgrade6").style.backgroundImage = "url(" + img + ")";
            break;
        default:
            helper.popup.createSimple(300,150,"<i>huh, what just happened?</i> <br> A fatal error occured: upgrade identifier is invalid!<br>Please report this to the GitHub accessable in the bottom left corner",true,"default","",false,true);
            break;
    }
}
upgrades.destroy = function(identifier) {
    switch (identifier) {
        case "upgrade0":
            document.getElementById("upgrade0").style.display = "none";
            break;
        case "upgrade1":
            document.getElementById("upgrade1").style.display = "none";
            break;
        case "upgrade2":
            document.getElementById("upgrade2").style.display = "none";
            break;
        case "upgrade3":
            document.getElementById("upgrade3").style.display = "none";
            break;
        case "upgrade4":
            document.getElementById("upgrade4").style.display = "none";
            break;
        case "upgrade5":
            document.getElementById("upgrade5").style.display = "none";
            break;
        case "upgrade6":
            document.getElementById("upgrade6").style.display = "none";
            break;
        default:
            helper.popup.createSimple(300,150,"<i>huh, what just happened?</i> <br> A fatal error occured: upgrade identifier is invalid for destroyed upgrade!<br>Please report this to the GitHub accessable in the bottom left corner",true,"default","",false,true);
            break;
    }
}

upgrades.upgrade0.clicked = function() {
    if (core.cookies >= upgrades.upgrade0.price) {
        core.cookies -= upgrades.upgrade0.price;
        buildings.keyboard.CPSGiven *= 2;
        buildings.keyboard.CPSGain *= 2;
        core.cookiesPerClick *= 2;
        upgrades.upgrade0.bought += 1;
        upgrades.hovered("upgrade0");
        upgrades.destroy("upgrade0");
    }
}
upgrades.upgrade1.clicked = function() {
    if (core.cookies >= upgrades.upgrade1.price) {
        core.cookies -= upgrades.upgrade1.price;
        buildings.grandpa.CPSGiven *= 2;
        buildings.grandpa.CPSGain *= 2;
        upgrades.upgrade1.bought += 1;
        upgrades.hovered("upgrade1");
        upgrades.destroy("upgrade1");
    }
}
upgrades.upgrade2.clicked = function() {
    if (core.cookies >= upgrades.upgrade2.price) {
        core.cookies -= upgrades.upgrade2.price;
        buildings.ranch.CPSGiven *= 2;
        buildings.ranch.CPSGain *= 2;
        upgrades.upgrade2.bought += 1;
        upgrades.hovered("upgrade2");
        upgrades.destroy("upgrade2");
    }
}
upgrades.upgrade3.clicked = function() {
    if (core.cookies >= upgrades.upgrade3.price) {
        core.cookies -= upgrades.upgrade3.price;
        buildings.tv.CPSGiven *= 2;
        buildings.tv.CPSGain *= 2;
        upgrades.upgrade3.bought += 1;
        upgrades.hovered("upgrade3");
        upgrades.destroy("upgrade3");
    }
}
upgrades.upgrade4.clicked = function() {
    if (core.cookies >= upgrades.upgrade4.price) {
        core.cookies -= upgrades.upgrade4.price;
        buildings.worker.CPSGiven *= 2;
        buildings.worker.CPSGain *= 2;
        upgrades.upgrade4.bought += 1;
        upgrades.hovered("upgrade4");
        upgrades.destroy("upgrade4");
    }
}
upgrades.upgrade5.clicked = function() {
    if (core.cookies >= upgrades.upgrade5.price) {
        core.cookies -= upgrades.upgrade5.price;
        buildings.wallet.CPSGiven *= 2;
        buildings.wallet.CPSGain *= 2;
        upgrades.upgrade5.bought += 1;
        upgrades.hovered("upgrade5");
        upgrades.destroy("upgrade5");
    }
}
upgrades.upgrade6.clicked = function() {
    if (core.cookies >= upgrades.upgrade6.price) {
        core.cookies -= upgrades.upgrade6.price;
        buildings.church.CPSGiven *= 2;
        buildings.church.CPSGain *= 2;
        upgrades.upgrade6.bought += 1;
        upgrades.hovered("upgrade6");
        upgrades.destroy("upgrade6");
    }
}

upgrades.hovered = function(upgrade) {
    switch (upgrade) {
        case "upgrade0":
            document.getElementById("upgradeName").innerHTML = "Name: " + upgrades.info.upgrade0.name;
            document.getElementById("upgradePrice").innerHTML = "Price: " + helper.commaify(upgrades.upgrade0.price);
            document.getElementById("upgradeDesc").innerHTML = "Description: " + upgrades.info.upgrade0.description;
            break;
        case "upgrade1":
            document.getElementById("upgradeName").innerHTML = "Name: " + upgrades.info.upgrade1.name;
            document.getElementById("upgradePrice").innerHTML = "Price: " + helper.commaify(upgrades.upgrade1.price);
            document.getElementById("upgradeDesc").innerHTML = "Description: " + upgrades.info.upgrade1.description;
            break;
        case "upgrade2":
            document.getElementById("upgradeName").innerHTML = "Name: " + upgrades.info.upgrade2.name;
            document.getElementById("upgradePrice").innerHTML = "Price: " + helper.commaify(upgrades.upgrade2.price);
            document.getElementById("upgradeDesc").innerHTML = "Description: " + upgrades.info.upgrade2.description;
            break;
        case "upgrade3":
            document.getElementById("upgradeName").innerHTML = "Name: " + upgrades.info.upgrade3.name;
            document.getElementById("upgradePrice").innerHTML = "Price: " + helper.commaify(upgrades.upgrade3.price);
            document.getElementById("upgradeDesc").innerHTML = "Description: " + upgrades.info.upgrade3.description;
            break;
        case "upgrade4":
            document.getElementById("upgradeName").innerHTML = "Name: " + upgrades.info.upgrade4.name;
            document.getElementById("upgradePrice").innerHTML = "Price: " + helper.commaify(upgrades.upgrade4.price);
            document.getElementById("upgradeDesc").innerHTML = "Description: " + upgrades.info.upgrade4.description;
            break;
        case "upgrade5":
            document.getElementById("upgradeName").innerHTML = "Name: " + upgrades.info.upgrade5.name;
            document.getElementById("upgradePrice").innerHTML = "Price: " + helper.commaify(upgrades.upgrade5.price);
            document.getElementById("upgradeDesc").innerHTML = "Description: " + upgrades.info.upgrade5.description;
            break;
        case "upgrade6":
            document.getElementById("upgradeName").innerHTML = "Name: " + upgrades.info.upgrade6.name;
            document.getElementById("upgradePrice").innerHTML = "Price: " + helper.commaify(upgrades.upgrade6.price);
            document.getElementById("upgradeDesc").innerHTML = "Description: " + upgrades.info.upgrade6.description;
            break;
    }
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

function versionNumberMousedOver() {
    document.getElementById("versionSwitchInfo").style.display = "block";
}
function versionNumberMousedOverUndo() {
    document.getElementById("versionSwitchInfo").style.display = "none";
}

// helper functions
helper.reloadCookieCounter = function() {
    document.getElementById("cookieCounter").innerHTML = personalization.currentClickedPlural + ": " +variableView.cookiesView;
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
// popups
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
    document.getElementById("simplePopup").style.display = "block";
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

    advancedPopup.style.display = "block";
    advancedPopup.style.width = x+"px";
    advancedPopup.style.height = y+"px";

    advancedPopup.innerHTML = html;
}
helper.popup.destroyAdvanced = function() {
    document.getElementById("advancedPopup").style.display = "none";
}

// set areas to different things
personalization.setBackground = function(color) {
    personalization.currentBackground = "url(img/backgrounds/background-" + color + ".png)";
    document.getElementById("leftSide").style.background = personalization.currentBackground;
    document.getElementById("middleButtons").style.background = personalization.currentBackground;
    document.getElementById("rightSide").style.background = personalization.currentBackground;

    helper.consoleLogDev("Background color set to: " + color);
}

personalization.setCurrentClicked = function(value) {
    switch (value) {
        case "cookie":
            document.getElementById("cookie").src = "img/cookie.png";
            personalization.currentClicked = "Cookie";
            personalization.currentClickedPlural = "Cookies";
            personalization.currentClickedLowercase = "cookie";
            personalization.currentClickedLowercasePlural = "cookies";
            break;
        case "potato":
            document.getElementById("cookie").src = "img/potato.png";
            personalization.currentClicked = "Potato";
            personalization.currentClickedPlural = "Potatoes";
            personalization.currentClickedLowercase = "potato";
            personalization.currentClickedLowercasePlural = "potatoes";
            break;
        case "strawberry":
            document.getElementById("cookie").src = "img/strawberry.png";
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
function toggleStats() {
    switch (statsUp) {
        case 0:
            optionsUp = 0;
            infoUp = 0;
            statsUp = 1;
                        
            document.getElementById("infoMiddleText").style.display = "none";
            document.getElementById("optionsMiddleText").style.display = "none";

            document.getElementById("statsMiddleText").style.display = "block";
            document.getElementById("middle").style.background = "black";
            break;
        case 1:
            statsUp = 0;
            document.getElementById("statsMiddleText").style.display = "none";
            document.getElementById("middle").style.background = personalization.currentBackground;
            break;
    }
}
function toggleInfo() {
    switch (infoUp) {
        case 0:
            optionsUp = 0;
            infoUp = 1;
            statsUp = 0;

            document.getElementById("optionsMiddleText").style.display = "none";
            document.getElementById("statsMiddleText").style.display = "none";

            document.getElementById("infoMiddleText").style.display = "block";
            document.getElementById("middle").style.background = "black";
            break;
        case 1:
            infoUp = 0;
            document.getElementById("infoMiddleText").style.display = "none";
            document.getElementById("middle").style.background = personalization.currentBackground;
            break;
    }
}
function toggleOptions() {
    switch (optionsUp) {
        case 0:
            optionsUp = 1;
            infoUp = 0;
            statsUp = 0;
                        
            document.getElementById("statsMiddleText").style.display = "none";
            document.getElementById("infoMiddleText").style.display = "none";

            document.getElementById("optionsMiddleText").style.display = "block";
            document.getElementById("middle").style.background = "black";
            break;
        case 1:
            optionsUp = 0;
            document.getElementById("optionsMiddleText").style.display = "none";
            document.getElementById("middle").style.background = personalization.currentBackground;
            break;
    }
}

core.grandmasArrival = function() {
    switch (grandmaPromptClicks) {
        case 0:
            helper.popup.createSimple(300,150,"a familiar face appears...",false,"grandmaPromptClicks","",false,false);
            break;
        case 1:
            document.getElementById("simplePopupImage").src = "img/grandma.png";
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

// saves
saves.exportData = function() {
    saves.autoSave();
    let dataJSON;
    switch (versionBranch) {
        case 0:
            dataJSON = JSON.stringify(localStorage.save);
            break;
        case 1:
            switch (inDevelopment) {
                case 0:
                    dataJSON = JSON.stringify(localStorage.betaSave);
                    break;
                case 1:
                    dataJSON = JSON.stringify(localStorage.devSave);
                    break;
            }
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
        const file = e.target.result;
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

    core.cookies = saves.importedData[0];
    core.totalCookies = saves.importedData[1];
    core.cookiesPerSecond = saves.importedData[2];

    buildings.keyboard.CPSGiven = saves.importedData[3];
    buildings.grandpa.CPSGiven = saves.importedData[4];
    buildings.ranch.CPSGiven = saves.importedData[5];
    buildings.tv.CPSGiven = saves.importedData[6];
    buildings.worker.CPSGiven = saves.importedData[7];
    buildings.wallet.CPSGiven = saves.importedData[8];
    buildings.church.CPSGiven = saves.importedData[9];

    buildings.keyboard.bought = saves.importedData[10];
    buildings.grandpa.bought = saves.importedData[11];
    buildings.ranch.bought = saves.importedData[12];
    buildings.tv.bought = saves.importedData[13];
    buildings.worker.bought = saves.importedData[14];
    buildings.wallet.bought = saves.importedData[15];
    buildings.church.bought = saves.importedData[16];

    buildings.keyboard.CPSGain = saves.importedData[17];
    buildings.grandpa.CPSGain = saves.importedData[18];
    buildings.ranch.CPSGain = saves.importedData[19];
    buildings.tv.CPSGain = saves.importedData[20];
    buildings.worker.CPSGain = saves.importedData[21];
    buildings.wallet.CPSGain = saves.importedData[22];
    buildings.church.CPSGain = saves.importedData[23];

    buildings.keyboard.upgradeCost = saves.importedData[24];
    buildings.grandpa.upgradeCost = saves.importedData[25];
    buildings.ranch.upgradeCost = saves.importedData[26];
    buildings.tv.upgradeCost = saves.importedData[27];
    buildings.worker.upgradeCost = saves.importedData[28];
    buildings.wallet.upgradeCost = saves.importedData[29];
    buildings.church.upgradeCost = saves.importedData[30];

    upgrades.upgrade0.bought = saves.importedData[31];
    upgrades.upgrade1.bought = saves.importedData[32];
    upgrades.upgrade2.bought = saves.importedData[33];
    upgrades.upgrade3.bought = saves.importedData[34];
    upgrades.upgrade4.bought = saves.importedData[35];
    upgrades.upgrade5.bought = saves.importedData[36];
    upgrades.upgrade6.bought = saves.importedData[37];

    core.cookiesPerClick = saves.importedData[38];
    core.cookieBeenClickedTimes = saves.importedData[39];
    core.buildingsOwned = saves.importedData[40];
    grandmaPromptClicks = saves.importedData[41];
    hasCheated = saves.importedData[42];
    won = saves.importedData[43];
    helper.reloadBuildingPrices();

    helper.consoleLogDev("Imported save with " +core.cookies+ " cookies.");
}

saves.autoSave = function() {
    saves.allToSave = [core.cookies, core.totalCookies, core.cookiesPerSecond,
        buildings.keyboard.CPSGiven,buildings.grandpa.CPSGiven,buildings.ranch.CPSGiven,buildings.tv.CPSGiven,buildings.worker.CPSGiven,buildings.wallet.CPSGiven,buildings.church.CPSGiven,
        buildings.keyboard.bought,buildings.grandpa.bought,buildings.ranch.bought,buildings.tv.bought,buildings.worker.bought,buildings.wallet.bought,buildings.church.bought,
        buildings.keyboard.CPSGain,buildings.grandpa.CPSGain,buildings.ranch.CPSGain,buildings.tv.CPSGain,buildings.worker.CPSGain,buildings.wallet.CPSGain,buildings.church.CPSGain,
        buildings.keyboard.upgradeCost,buildings.grandpa.upgradeCost,buildings.ranch.upgradeCost,buildings.tv.upgradeCost,buildings.worker.upgradeCost,buildings.wallet.upgradeCost,buildings.church.upgradeCost,
        upgrades.upgrade0.bought,upgrades.upgrade1.bought,upgrades.upgrade2.bought,upgrades.upgrade3.bought,upgrades.upgrade4.bought,upgrades.upgrade5.bought,upgrades.upgrade6.bought,
        core.cookiesPerClick,core.cookieBeenClickedTimes,core.buildingsOwned,grandmaPromptClicks,hasCheated,won];
    switch (versionBranch) {
        case 0:
            localStorage.save = JSON.stringify(saves.allToSave);
            break;
        case 1:
            switch (inDevelopment) {
                case 0:   
                    localStorage.betaSave = JSON.stringify(saves.allToSave);
                    break;
                case 1:
                    localStorage.devSave = JSON.stringify(saves.allToSave);
                    break;
            }
            break;
        default:
            alert("Version branch is invalid and auto-saving is not functional!");
            break;
    }
}

saves.loadAutoSave = function() {
    switch (versionBranch) {
        case 0:
            saves.getLocalSave("save");
            break;
        case 1:
            switch (inDevelopment) {
                case 0:
                    saves.getLocalSave("betaSave");
                    break;
                case 1:
                    saves.getLocalSave("devSave");
                    break;
            }
            break;
    }
} // merge two later (idk why they are seperate things)
saves.getLocalSave = function(localStorageSave) {
    switch (localStorageSave) {
        case "save":
            saves.dataLoaded = JSON.parse(localStorage.save);
            break;
        case "betaSave":
            saves.dataLoaded = JSON.parse(localStorage.betaSave);
            break;
        case "devSave":
            saves.dataLoaded = JSON.parse(localStorage.devSave);
            break;
        default:
            alert("Loading auto-saving is not functional because versionBranch or inDevelopment is invalid!");
            break;
    }
    core.cookies = saves.dataLoaded[0];
    core.totalCookies = saves.dataLoaded[1];
    core.cookiesPerSecond = saves.dataLoaded[2];

    buildings.keyboard.CPSGiven = saves.dataLoaded[3];
    buildings.grandpa.CPSGiven = saves.dataLoaded[4];
    buildings.ranch.CPSGiven = saves.dataLoaded[5];
    buildings.tv.CPSGiven = saves.dataLoaded[6];
    buildings.worker.CPSGiven = saves.dataLoaded[7];
    buildings.wallet.CPSGiven = saves.dataLoaded[8];
    buildings.church.CPSGiven = saves.dataLoaded[9];

    buildings.keyboard.bought = saves.dataLoaded[10];
    buildings.grandpa.bought = saves.dataLoaded[11];
    buildings.ranch.bought = saves.dataLoaded[12];
    buildings.tv.bought = saves.dataLoaded[13];
    buildings.worker.bought = saves.dataLoaded[14];
    buildings.wallet.bought = saves.dataLoaded[15];
    buildings.church.bought = saves.dataLoaded[16];

    buildings.keyboard.CPSGain = saves.dataLoaded[17];
    buildings.grandpa.CPSGain = saves.dataLoaded[18];
    buildings.ranch.CPSGain = saves.dataLoaded[19];
    buildings.tv.CPSGain = saves.dataLoaded[20];
    buildings.worker.CPSGain = saves.dataLoaded[21];
    buildings.wallet.CPSGain = saves.dataLoaded[22];
    buildings.church.CPSGain = saves.dataLoaded[23];

    buildings.keyboard.upgradeCost = saves.dataLoaded[24];
    buildings.grandpa.upgradeCost = saves.dataLoaded[25];
    buildings.ranch.upgradeCost = saves.dataLoaded[26];
    buildings.tv.upgradeCost = saves.dataLoaded[27];
    buildings.worker.upgradeCost = saves.dataLoaded[28];
    buildings.wallet.upgradeCost = saves.dataLoaded[29];
    buildings.church.upgradeCost = saves.dataLoaded[30];

    upgrades.upgrade0.bought = saves.dataLoaded[31];
    upgrades.upgrade1.bought = saves.dataLoaded[32];
    upgrades.upgrade2.bought = saves.dataLoaded[33];
    upgrades.upgrade3.bought = saves.dataLoaded[34];
    upgrades.upgrade4.bought = saves.dataLoaded[35];
    upgrades.upgrade5.bought = saves.dataLoaded[36];
    upgrades.upgrade6.bought = saves.dataLoaded[37];

    core.cookiesPerClick = saves.dataLoaded[38];
    core.cookieBeenClickedTimes = saves.dataLoaded[39];
    core.buildingsOwned = saves.dataLoaded[40];
    grandmaPromptClicks = saves.dataLoaded[41];
    hasCheated = saves.dataLoaded[42];
    won = saves.dataLoaded[43];
    helper.reloadBuildingPrices();
}

saves.resetSave = function() {
    switch (versionBranch) {
        case 0:
            localStorage.setItem("save",JSON.stringify(saves.defaultSavedValues));
            break;
        case 1:
            switch (inDevelopment) {
                case 0:
                    localStorage.setItem("betaSave",JSON.stringify(saves.defaultSavedValues));
                    break;
                case 1:
                    localStorage.setItem("devSave",JSON.stringify(saves.defaultSavedValues));
                    break;
            }
            break;
        default:
            alert("Resetting save is not functional because versionBranch or inDevelopment is invalid!");
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

    upgrades.destroy("upgrade0");
    upgrades.destroy("upgrade1");
    upgrades.destroy("upgrade2");
    upgrades.destroy("upgrade3");
    upgrades.destroy("upgrade4");
    upgrades.destroy("upgrade5");
    upgrades.destroy("upgrade6");

    document.getElementById("win").style.display = "block";
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
    document.getElementById("buildingInfoName").innerHTML = buildingInfoName;
    document.getElementById("buildingInfoPrice").innerHTML = "Price: " + buildingInfoPrice;
    document.getElementById("buildingInfoQuote").innerHTML = "\""+buildingInfoQuote+"\"";
    document.getElementById("buildingInfoProduces").innerHTML = "Produces: "+buildingInfoProduces+" CPS";
    document.getElementById("buildingInfoProducing").innerHTML = "Producing: "+ buildingInfoProducing+" CPS";

    document.getElementById("buildingInfo").style.display = "block";
}
buildings.undoHover = function() {
    document.getElementById("buildingInfo").style.display = "none";
}

console.log("what are you doing here? well... as long as its productive.");

core.initialization();