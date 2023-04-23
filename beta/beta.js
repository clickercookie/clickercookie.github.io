// variable definitions
const version = "0.5";
const versionBranch = 1; // 0 is main, 1 is beta, switches stylesheets so must say same depending on the .css file name (style.css or beta.css)
const inDevelopment = 0; // toggle if developing actively. This is completely different than the builtin dev mode! Recommended that versionBranch is 1 for easier saving if this is toggled.

// customization
const backgroundForm = document.getElementById("backgroundSelect");
let currentBackground = "url(img/backgrounds/background-blue.png)";

let currentClicked = "Cookie";
let currentClickedPlural = "Cookies";
let currentClickedLowercase = "cookie";
let currentClickedLowercasePlural = "cookies";

// cookies
let cookies = 0;
let cookiesView = Math.floor(cookies);
// upgrades
let upgrade0sBought = 0;
let upgrade1sBought = 0;
let upgrade2sBought = 0;
let upgrade3sBought = 0;
let upgrade4sBought = 0;
let upgrade5sBought = 0;
let upgrade6sBought = 0;

// yes, i know, this is WILDLY INEFFICENT. If you can code better than me, please rewrite this better :D
let upgrade0Name = "Reinforced Keys";
let upgrade1Name = "Hardwood Walking Stick";
let upgrade2Name = "Pig Slop";
let upgrade3Name = "LED Display";
let upgrade4Name = "Medkits";
let upgrade5Name = "200 dollar bills";
let upgrade6Name = "null";
let upgrade0Description = "Multiplys Keyboard and clicking cookie production by 2" + "<br>" + "<i>'" + "press harder" + "'</i>";
let upgrade1Description = "Multiplys Grandpa production by 2" + "<br>" + "<i>'" + "nonna dat softwood crap" + "'</i>";
let upgrade2Description = "Multiplys Ranch production by 2" + "<br>" + "<i>'" + "Wait, what have we been feeding them before now?" + "'</i>";
let upgrade3Description = "Multiplys TV production by 2" + "<br>" + "<i>'" + "World's greatest leap in digital technology" + "'</i>";
let upgrade4Description = "Multiplys Worker production by 2" + "<br>" + "<i>'" + "Constant supply of Band-Aids in case of emergency" + "'</i>";
let upgrade5Description = "Multiplys Wallet production by 2" + "<br>" + "<i>'" + "Don't know how the goverment is going to take to this currency" + "'</i>";
let upgrade6Description = "null";
let upgrade0Price = 100;
let upgrade1Price = 1000;
let upgrade2Price = 11000;
let upgrade3Price = 120000;
let upgrade4Price = 1300000;
let upgrade5Price = 14000000;
let upgrade6Price = 100;
let upgrade0Identifier = "up0";
let upgrade1Identifier = "up1";
let upgrade2Identifier = "up2";
let upgrade3Identifier = "up3";
let upgrade4Identifier = "up4";
let upgrade5Identifier = "up4";
let upgrade6Identifier = "up4";

// keyboards
let keyboardsBought = 0;
let keyboardCPSGain = 0.1;
let keyboardCPSGiven = 0;
let keyboardUpgradeCost = 15;
// grandpas
let grandpasBought = 0;
let grandpaCPSGain = 1;
let grandpaCPSGiven = 0;
let grandpaUpgradeCost = 100;
let grandpaUnlocked = 0;
// ranches
let ranchesBought = 0;
let ranchCPSGain = 8;
let ranchCPSGiven = 0;
let ranchUpgradeCost = 1100;
let ranchUnlocked = 0;
// televisions
let tvsBought = 0;
let tvCPSGain = 47;
let tvCPSGiven = 0;
let tvUpgradeCost = 12000;
let tvUnlocked = 0;
// workers
let workersBought = 0;
let workerCPSGain = 260;
let workerCPSGiven = 0;
let workerUpgradeCost = 130000;
let workerUnlocked = 0;
// wallets
let walletsBought = 0;
let walletCPSGain = 1440;
let walletCPSGiven = 0;
let walletUpgradeCost = 1400000;
let walletUnlocked = 0;
// churches
let churchesBought = 0;
let churchCPSGain = 7800;
let churchCPSGiven = 0;
let churchUpgradeCost = 20000000;
let churchUnlocked = 0;

// dev variables
let devMode = 0;
let devCPSGiven = 0;

// stats
let cookiesPerClick = 1;
let cookieBeenClickedTimes = 0;
let totalCookies = 0;
let totalCookiesView = Math.round(totalCookies * 10) / 10; // merge totalcookies & totalcookies view later
let cookiesPerSecond = 0;
let cookiesPerSecondView = cookiesPerSecond;
let buildingsOwned = 0;

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

// save stuff
let currentImportedData; // parsed stringified and not ready for object-turning
let dataIncomplete; // Parsed JSON but cannot be read for an unknown reason without being parsed again
let data; // Completely functional parseded JSON
let allToSave = [cookies, totalCookies, cookiesPerSecond, // all additions to this variable MUST BE AT THE END, then reflected in getLocalSave()
                keyboardCPSGiven,grandpaCPSGiven,ranchCPSGiven,tvCPSGiven,workerCPSGiven,walletCPSGiven,churchCPSGiven,
                keyboardsBought,grandpasBought,ranchesBought,tvsBought,workersBought,walletsBought,churchesBought,
                keyboardCPSGain,grandpaCPSGain,ranchCPSGain,tvCPSGain,workerCPSGain,walletCPSGain,churchCPSGain,
                keyboardUpgradeCost,grandpaUpgradeCost,ranchUpgradeCost,tvUpgradeCost,workerUpgradeCost,walletUpgradeCost,churchUpgradeCost,
                upgrade0sBought,upgrade1sBought,upgrade2sBought,upgrade3sBought,upgrade4sBought,upgrade5sBought,upgrade6sBought,
                cookiesPerClick,cookieBeenClickedTimes,buildingsOwned,grandmaPromptClicks,hasCheated];
let defaultSavedValues = [ // matches order of allToSave
    0,0,0,
    0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,
    0.1,1,8,47,260,1440,7800,
    15,100,1100,12000,130000,1400000,20000000,
    0,0,0,0,0,0,0,
    1,0,0,0,0];
let dataLoaded;

// timer things
const intervalCPSU = setInterval(cookiesPerSecondUpdate, 1000);
const perMillisecondUniversalVar = setInterval(perMillisecondUniversal, 1);
const autoSaveInterval = setInterval(autoSave, 60 * 1000);

// set version
switch (versionBranch) { // number
    case 0:
        document.getElementById("versionNumber").innerHTML = "Version: " +version;
        break;
    case 1:
        document.getElementById("versionNumber").innerHTML = "Version: " +version+ " Beta";
        break;
}
switch (versionBranch) { // info
    case 0:
        document.getElementById("versionSwitchInfoText").innerHTML = "Clicking this will switch to the beta branch, this will wipe your current progress!";
        break;
    case 1:
        document.getElementById("versionSwitchInfoText").innerHTML = "Clicking this will switch to the main branch, this will wipe your current progress!";
        break;
}

if (isNaN(cookies)) {
    resetSave();
}
if (localStorage.cookies >= 0) {
    createSimplePopUp(400,200,"You are using the old saving method. You may have issues with saving now that the new one is implimented. Clicking below will reset your save to the new format.",false,"localStorage.clear()","Warning",false);
}
reloadBuildingPrices();
if (localStorage.getItem("save") == null) {
    localStorage.setItem("save",JSON.stringify(defaultSavedValues));
}
if (localStorage.getItem("betaSave") == null) {
    localStorage.setItem("betaSave",JSON.stringify(defaultSavedValues));
}
if (localStorage.getItem("devSave") == null) {
    localStorage.setItem("devSave",JSON.stringify(defaultSavedValues));
}
loadAutoSave();

if (won == 1) {
    document.getElementById("win").style.display = "block";
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
    devResetButton.setAttribute("onclick","resetSave()");
    devDiv.appendChild(devResetButton);

    const br1 = document.createElement("br");
    devDiv.appendChild(br1);

    const devSaveButton = document.createElement("button");
    devSaveButton.appendChild(document.createTextNode("Force Auto Save"));
    devSaveButton.setAttribute("onclick","autoSave()");
    devDiv.appendChild(devSaveButton);

    const br2 = document.createElement("br");
    devDiv.appendChild(br2);

    const devLoadButton = document.createElement("button");
    devLoadButton.appendChild(document.createTextNode("Force Load Save"));
    devLoadButton.setAttribute("onclick","loadAutoSave()");
    devDiv.appendChild(devLoadButton);

    document.getElementById("leftSide").insertBefore(devDiv, document.getElementById("leftSidePush"));

    // version change
    document.getElementById("versionNumber").innerHTML = "Version: " + version + " Dev";

    setDevMode("on");
    document.getElementById("offSelectionDev").innerHTML = "Overwritten";
}

// change title
switch (versionBranch) {
    case 0:
        document.getElementById("title").innerHTML = "Clicker Cookie";
        break;
    case 1:
        document.getElementById("title").innerHTML = "Clicker Cookie Beta";
        break;
}
switch (inDevelopment) {
    case 0:
        break;
    case 1:
        document.getElementById("title").innerHTML = "Clicker Cookie Dev";
        break;
}

// sounds
const cookieClick = new Audio("sfx/cookie-click.wav");
cookieClick.volume = 0.05;

// set default upgrades
document.getElementById("upgrade0").style.backgroundImage = "url(img/upgrades/reinforced-keys.png)";
document.getElementById("upgrade1").style.backgroundImage = "url(img/upgrades/hardwood-walking-stick.png)";
document.getElementById("upgrade2").style.backgroundImage = "url(img/upgrades/ranch-upgrade1.png)";
document.getElementById("upgrade3").style.backgroundImage = "url(img/upgrades/tv-upgrade1.png)";
document.getElementById("upgrade4").style.backgroundImage = "url(img/upgrades/worker-upgrade1.png)";

function perMillisecondUniversal() {
    cookiesView = Math.round(cookies * 10) / 10;
    totalCookiesView = Math.round(totalCookies * 10) / 10;
    cookiesPerSecondView = Math.round(cookiesPerSecond * 10) / 10;

    // CPS
    document.getElementById("cookiesPerSecondCounter").innerHTML = currentClickedPlural + " Per Second: " +cookiesPerSecondView;
    reloadCookieCounter();

    // Upgrade Unlocks (very long) (fixes accepted) (create a github pull request)
        // Keyboards
        if (keyboardsBought >= 1 && upgrade0sBought == 0) {
            document.getElementById("upgrade0").style.display = "inline-block";
        }
        if (upgrade0sBought == 1 && keyboardsBought >= 5) {
            createUpgrade("upgrade0","Obsidian Keys","Multiplys keyboard and clicking " + currentClickedLowercasePlural + " by 2","so heavy they're always pressed",500,"img/upgrades/obsidian-keys.png");
        }
        // Grandpas
        if (grandpasBought >= 1 && upgrade1sBought == 0) {
            document.getElementById("upgrade1").style.display = "inline-block";
        }
        // Ranches
        if (ranchesBought >= 1 && upgrade2sBought == 0) {
            document.getElementById("upgrade2").style.display = "inline-block";
        }
        // TVs
        if (tvsBought >= 1 && upgrade3sBought == 0) {
            document.getElementById("upgrade3").style.display = "inline-block";
        }
        // Workers
        if (workersBought >= 1 && upgrade4sBought == 0) {
            document.getElementById("upgrade4").style.display = "inline-block";
        }

    // building unlocks
    if (totalCookies >= 100) {
        grandpaUnlocked = 1;
    }
    if (totalCookies >= 700) {
        ranchUnlocked = 1;
    }
    if (totalCookies >= 8000) {
        tvUnlocked = 1;
    }
    if (totalCookies >= 80000) {
        workerUnlocked = 1;
    }
    if (totalCookies >= 700000) {
        walletUnlocked = 1;
    }
    if (totalCookies >= 15000000) {
        churchUnlocked = 1;
    }

    // these 2 could be combined, but would make manually unlocking buildings more difficult

    // keep unlocked
    if (grandpaUnlocked == 1) {
        document.getElementById("grandpaUpgrade").style.display = "inline";
        document.getElementById("building1").style.display = "block";
    }
    if (ranchUnlocked == 1) {
        document.getElementById("ranchUpgrade").style.display = "inline";
        document.getElementById("building2").style.display = "block";
    }
    if (tvUnlocked == 1) {
        document.getElementById("tvUpgrade").style.display = "inline";
        document.getElementById("building3").style.display = "block";
    }
    if (workerUnlocked == 1) {
        document.getElementById("workerUpgrade").style.display = "inline";
        document.getElementById("building4").style.display = "block";
    }
    if (walletUnlocked == 1) {
        document.getElementById("walletUpgrade").style.display = "inline";
        document.getElementById("building5").style.display = "block";
    }
    if (churchUnlocked == 1) {
        document.getElementById("churchUpgrade").style.display = "inline";
        document.getElementById("building6").style.display = "block";
    }

    // check for grandma's visit
    if (totalCookies >= 1000000000) {
        grandmasArrival();
    }

    // check for stopped cookie production
    if (cookieProductionStopped == 1) {
        cookies = 0;
    }

    // log to console in case of error
    if (cookies < 0) {
        createSimplePopUp(300,150,"<i>huh, what just happened?</i> <br> An error occured: " + currentClickedPlural + " are in negative!<br>Please report this to the GitHub accessable in the bottom left corner",false,"default","",false,true);
    }
    if (upgrade0Identifier == upgrade1Identifier) {
        createSimplePopUp(300,150,"<i>huh, what just happened?</i> <br> An error occured: Multiple of same upgrade or identifier is not set!<br>Please report this to the GitHub accessable in the bottom left corner",false,"default","",false,true);
    }
    // stats that need to be updated beforehand
    buildingsOwned = keyboardsBought + grandpasBought + ranchesBought + tvsBought + workersBought + walletsBought + churchesBought;
    
    // set statistic page statistics
    if (statsUp == 1) {
        document.getElementById("cookiesStat").innerHTML = currentClickedPlural + ": " + cookiesView;
        document.getElementById("allTimeCookies").innerHTML = "All Time " + currentClickedPlural + ": " + totalCookiesView;
        document.getElementById("cookiesPerSecondStat").innerHTML = currentClickedPlural + " Per Second: " + cookiesPerSecondView;
        document.getElementById("buildingsOwnedStat").innerHTML = "Buildings Owned: " + buildingsOwned;
        document.getElementById("cookieBeenClickedTimesStat").innerHTML = "Total " + currentClicked + " Clicks: " + cookieBeenClickedTimes; // move to cookieClicked() later
    }

    // set number of bought to bought (not required unless number of bought is set in console)
    document.getElementById("keyboardsBought").innerHTML = +keyboardsBought;
    document.getElementById("grandpasBought").innerHTML = +grandpasBought;
    document.getElementById("ranchesBought").innerHTML = +ranchesBought;
    document.getElementById("tvsBought").innerHTML = +tvsBought;
    document.getElementById("workersBought").innerHTML = +workersBought;
    document.getElementById("walletsBought").innerHTML = +walletsBought;
    document.getElementById("churchesBought").innerHTML = +churchesBought;

    cookiesPerSecond = keyboardCPSGiven+grandpaCPSGiven+ranchCPSGiven+tvCPSGiven+workerCPSGiven+walletCPSGiven+churchCPSGiven+devCPSGiven;
}

function cookiesPerSecondUpdate() {
    cookies = cookies + cookiesPerSecond;
    totalCookies = totalCookies + cookiesPerSecond;
    reloadCookieCounter();
}

function cookieClicked() {
    cookies = cookies + cookiesPerClick;
    cookieBeenClickedTimes = cookieBeenClickedTimes + 1;
    totalCookies = totalCookies + cookiesPerClick;
    reloadCookieCounter();
    cookieClick.play();
}

function popupBackClicked() {
    destroySimplePopUp();
}
// dev commands
function beginGrandma() {
    if (devMode == 1) {
        setCookies(1000000000);
        grandmaPromptClicks = 0;
    }
    else {
        console.log("You need developer mode ON to run this command.");
    }
}

function ignoreGrandma() {
    if (devMode == 1) {
        grandmaPromptClicks = 10;
    }
    else {
        console.log("You need developer mode ON to run this command.");
    }
}

function setCookies(x) {
    if (devMode == 1) {
        cookies = x;
        totalCookies = totalCookies + x;
        hasCheated = 1;
        reloadCookieCounter();
        document.getElementById("ifCheatedStat").innerHTML = "You have cheated on this playthrough!";
        ignoreGrandma();
    }
    else {
        console.log("You need developer mode ON to run this command.");
    }
}

function setCPS(x) {
    if (devMode == 1) {
        devCPSGiven = x;
        cookiesPerSecondView = Math.round(cookiesPerSecond * 10) / 10;
        document.getElementById("cookiesPerSecondCounter").innerHTML = currentClickedPlural +" Per Second: " +cookiesPerSecondView;
        document.getElementById("ifCheatedStat").innerHTML = "<b>You have cheated on this playthrough!</b>";
        ignoreGrandma();
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
            window.location.href = "https://clickercookie.github.io";
            break;
    }
}

// upgrades
function keyboardUpgrade() {
    if (cookies >= keyboardUpgradeCost) {
        cookies = cookies - keyboardUpgradeCost;
        keyboardUpgradeCost = keyboardUpgradeCost * 1.15;
        keyboardUpgradeCost = Math.floor(keyboardUpgradeCost);
        keyboardsBought = keyboardsBought + 1;
        keyboardCPSGiven = keyboardCPSGiven + keyboardCPSGain;
        reloadCookieCounter();
        document.getElementById("keyboardUpgrade").innerHTML = "Keyboard: " +keyboardUpgradeCost;
        document.getElementById("keyboardsBought").innerHTML = +keyboardsBought;
        makeUpgradeSound();
    }
}

function grandpaUpgrade() {
    if (cookies >= grandpaUpgradeCost) {
        cookies = cookies - grandpaUpgradeCost;
        grandpaUpgradeCost = grandpaUpgradeCost * 1.15;
        grandpaUpgradeCost = Math.floor(grandpaUpgradeCost);
        grandpasBought = grandpasBought + 1;
        grandpaCPSGiven = grandpaCPSGiven + grandpaCPSGain;
        reloadCookieCounter();
        document.getElementById("grandpaUpgrade").innerHTML = "Grandpa: " +grandpaUpgradeCost;
        document.getElementById("grandpasBought").innerHTML = +grandpasBought;
        makeUpgradeSound();
    }
}

function ranchUpgrade() {
    if (cookies >= ranchUpgradeCost) {
        cookies = cookies - ranchUpgradeCost;
        ranchUpgradeCost = ranchUpgradeCost * 1.15;
        ranchUpgradeCost = Math.floor(ranchUpgradeCost);
        ranchesBought = ranchesBought + 1;
        ranchCPSGiven = ranchCPSGiven + ranchCPSGain;
        reloadCookieCounter();
        document.getElementById("ranchUpgrade").innerHTML = "Ranch: " +ranchUpgradeCost;
        document.getElementById("ranchesBought").innerHTML = +ranchesBought;
        makeUpgradeSound();
    }
}

function tvUpgrade() {
    if (cookies >= tvUpgradeCost) {
        cookies = cookies - tvUpgradeCost;
        tvUpgradeCost = tvUpgradeCost * 1.15;
        tvUpgradeCost = Math.floor(tvUpgradeCost);
        tvsBought = tvsBought + 1;
        tvCPSGiven = tvCPSGiven + tvCPSGain;
        reloadCookieCounter();
        document.getElementById("tvUpgrade").innerHTML = "Television: " +tvUpgradeCost;
        document.getElementById("tvsBought").innerHTML = +tvsBought;
        makeUpgradeSound();
    }
}
function workerUpgrade() {
    if (cookies >= workerUpgradeCost) {
        cookies = cookies - workerUpgradeCost;
        workerUpgradeCost = workerUpgradeCost * 1.15;
        workerUpgradeCost = Math.floor(workerUpgradeCost);
        workersBought = workersBought + 1;
        workerCPSGiven = workerCPSGiven + workerCPSGain;
        reloadCookieCounter();
        document.getElementById("workerUpgrade").innerHTML = "Worker: " +workerUpgradeCost;
        document.getElementById("workersBought").innerHTML = +workersBought;
        makeUpgradeSound();
    }
}
function walletUpgrade() {
    if (cookies >= walletUpgradeCost) {
        cookies = cookies - walletUpgradeCost;
        walletUpgradeCost = walletUpgradeCost * 1.15;
        walletUpgradeCost = Math.floor(walletUpgradeCost);
        walletsBought = walletsBought + 1;
        walletCPSGiven = walletCPSGiven + walletCPSGain;
        reloadCookieCounter();
        document.getElementById("walletUpgrade").innerHTML = "Wallet: " +walletUpgradeCost;
        document.getElementById("walletsBought").innerHTML = +walletsBought;
        makeUpgradeSound();
    }
}
function churchUpgrade() {
    if (cookies >= churchUpgradeCost) {
        cookies = cookies - churchUpgradeCost;
        churchUpgradeCost = churchUpgradeCost * 1.15;
        churchUpgradeCost = Math.floor(churchUpgradeCost);
        churchesBought = churchesBought + 1;
        churchCPSGiven = churchCPSGiven + churchCPSGain;
        reloadCookieCounter();
        document.getElementById("churchUpgrade").innerHTML = "Church: " +churchUpgradeCost;
        document.getElementById("churchesBought").innerHTML = +churchesBought;
        makeUpgradeSound();
    }
}

// managing upgrades
function createUpgrade(identifier,name,description,quote,price,img) {
    switch (identifier) {
        case "upgrade0":
            document.getElementById("upgrade0").style.display = "inline-block";
            upgrade0Name = name;
            upgrade0Description = description + "<br>" + "<i>'" + quote + "'</i>";
            upgrade0Price = price;
            document.getElementById("upgrade0").style.backgroundImage = "url(" + img + ")";
            break;
        case "upgrade1":
            document.getElementById("upgrade1").style.display = "inline-block";
            upgrade1Name = name;
            upgrade1Description = description + "<br>" + "<i>'" + quote + "'</i>";
            upgrade1Price = price;
            document.getElementById("upgrade1").style.backgroundImage = "url(" + img + ")";
            break;
        case "upgrade2":
            document.getElementById("upgrade2").style.display = "inline-block";
            upgrade2Name = name;
            upgrade2Description = description + "<br>" + "<i>'" + quote + "'</i>";
            upgrade2Price = price;
            document.getElementById("upgrade2").style.backgroundImage = "url(" + img + ")";
            break;
        case "upgrade3":
            document.getElementById("upgrade3").style.display = "inline-block";
            upgrade3Name = name;
            upgrade3Description = description + "<br>" + "<i>'" + quote + "'</i>";
            upgrade3Price = price;
            document.getElementById("upgrade3").style.backgroundImage = "url(" + img + ")";
            break;
        case "upgrade4":
            document.getElementById("upgrade4").style.display = "inline-block";
            upgrade4Name = name;
            upgrade4Description = description + "<br>" + "<i>'" + quote + "'</i>";
            upgrade4Price = price;
            document.getElementById("upgrade4").style.backgroundImage = "url(" + img + ")";
            break;
        case "upgrade5":
            document.getElementById("upgrade5").style.display = "inline-block";
            upgrade5Name = name;
            upgrade5Description = description + "<br>" + "<i>'" + quote + "'</i>";
            upgrade5Price = price;
            document.getElementById("upgrade5").style.backgroundImage = "url(" + img + ")";
            break;
        case "upgrade6":
            document.getElementById("upgrade6").style.display = "inline-block";
            upgrade6Name = name;
            upgrade6Description = description + "<br>" + "<i>'" + quote + "'</i>";
            upgrade6Price = price;
            document.getElementById("upgrade6").style.backgroundImage = "url(" + img + ")";
            break;
        default:
            createSimplePopUp(300,150,"<i>huh, what just happened?</i> <br> A fatal error occured: upgrade identifier is invalid!<br>Please report this to the GitHub accessable in the bottom left corner",true,"default","",false,true);
            break;
    }
}
function destroyUpgrade(identifier) {
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
            createSimplePopUp(300,150,"<i>huh, what just happened?</i> <br> A fatal error occured: upgrade identifier is invalid for destroyed upgrade!<br>Please report this to the GitHub accessable in the bottom left corner",true,"default","",false,true);
            break;
    }
}

function upgrade0Clicked() {
    if (cookies >= upgrade0Price) {
        cookies = cookies - upgrade0Price;
        keyboardCPSGiven = keyboardCPSGiven * 2;
        keyboardCPSGain = keyboardCPSGain * 2;
        cookiesPerClick = cookiesPerClick * 2;
        upgrade0sBought = upgrade0sBought + 1;
        upgrade0Hovered();
        destroyUpgrade("upgrade0");
    }
}
function upgrade1Clicked() {
    if (cookies >= upgrade1Price) {
        cookies = cookies - upgrade1Price;
        grandpaCPSGiven = grandpaCPSGiven * 2;
        grandpaCPSGain = grandpaCPSGain * 2;
        upgrade1sBought =+ 1;
        upgrade1Hovered();
        destroyUpgrade("upgrade1");
    }
}
function upgrade2Clicked() {
    if (cookies >= upgrade2Price) {
        cookies = cookies - upgrade2Price;
        ranchCPSGiven = ranchCPSGiven * 2;
        ranchCPSGain = ranchCPSGain * 2;
        upgrade2sBought =+ 1;
        upgrade2Hovered();
        destroyUpgrade("upgrade2");
    }
}
function upgrade3Clicked() {
    if (cookies >= upgrade3Price) {
        cookies = cookies - upgrade3Price;
        tvCPSGiven = tvCPSGiven * 2;
        tvCPSGain = tvCPSGain * 2;
        upgrade3sBought =+ 1;
        upgrade3Hovered();
        destroyUpgrade("upgrade3");
    }
}
function upgrade4Clicked() {
    if (cookies >= upgrade4Price) {
        cookies = cookies - upgrade4Price;
        workerCPSGiven = workerCPSGiven * 2;
        workerCPSGain = workerCPSGain * 2;
        upgrade4sBought =+ 1;
        upgrade4Hovered();
        destroyUpgrade("upgrade4");
    }
}
function upgrade5Clicked() {
    if (cookies >= upgrade5Price) {
        cookies = cookies - upgrade5Price;
        walletCPSGiven = walletCPSGiven * 2;
        walletCPSGain = walletCPSGain * 2;
        upgrade5sBought =+ 1;
        upgrade5Hovered();
        destroyUpgrade("upgrade5");
    }
}
function upgrade6Clicked() {
    if (cookies >= upgrade6Price) {
        cookies = cookies - upgrade6Price;
        churchCPSGiven = churchCPSGiven * 2;
        churchCPSGain = churchCPSGain * 2;
        upgrade6sBought =+ 1;
        upgrade6Hovered();
        destroyUpgrade("upgrade6");
    }
}

function upgrade0Hovered() {
    document.getElementById("upgradeName").innerHTML = "Name: " + upgrade0Name;
    document.getElementById("upgradePrice").innerHTML = "Price: " + upgrade0Price;
    document.getElementById("upgradeDesc").innerHTML = "Description: " + upgrade0Description;
    document.getElementById("upgradeViewer").style.display = "block";
    document.getElementById("upgradeViewer").style.float = "right";
}
function upgrade1Hovered() {
    document.getElementById("upgradeName").innerHTML = "Name: " + upgrade1Name;
    document.getElementById("upgradePrice").innerHTML = "Price: " + upgrade1Price;
    document.getElementById("upgradeDesc").innerHTML = "Description: " + upgrade1Description;
    document.getElementById("upgradeViewer").style.display = "block";
    document.getElementById("upgradeViewer").style.float = "right";
}
function upgrade2Hovered() {
    document.getElementById("upgradeName").innerHTML = "Name: " + upgrade2Name;
    document.getElementById("upgradePrice").innerHTML = "Price: " + upgrade2Price;
    document.getElementById("upgradeDesc").innerHTML = "Description: " + upgrade2Description;
    document.getElementById("upgradeViewer").style.display = "block";
    document.getElementById("upgradeViewer").style.float = "right";
}
function upgrade3Hovered() {
    document.getElementById("upgradeName").innerHTML = "Name: " + upgrade3Name;
    document.getElementById("upgradePrice").innerHTML = "Price: " + upgrade3Price;
    document.getElementById("upgradeDesc").innerHTML = "Description: " + upgrade3Description;
    document.getElementById("upgradeViewer").style.display = "block";
    document.getElementById("upgradeViewer").style.float = "right";
}
function upgrade4Hovered() {
    document.getElementById("upgradeName").innerHTML = "Name: " + upgrade4Name;
    document.getElementById("upgradePrice").innerHTML = "Price: " + upgrade4Price;
    document.getElementById("upgradeDesc").innerHTML = "Description: " + upgrade4Description;
    document.getElementById("upgradeViewer").style.display = "block";
    document.getElementById("upgradeViewer").style.float = "right";
}
function upgrade5Hovered() {
    document.getElementById("upgradeName").innerHTML = "Name: " + upgrade5Name;
    document.getElementById("upgradePrice").innerHTML = "Price: " + upgrade5Price;
    document.getElementById("upgradeDesc").innerHTML = "Description: " + upgrade5Description;
    document.getElementById("upgradeViewer").style.display = "block";
    document.getElementById("upgradeViewer").style.float = "right";
}
function upgrade6Hovered() {
    document.getElementById("upgradeName").innerHTML = "Name: " + upgrade6Name;
    document.getElementById("upgradePrice").innerHTML = "Price: " + upgrade6Price;
    document.getElementById("upgradeDesc").innerHTML = "Description: " + upgrade6Description;
    document.getElementById("upgradeViewer").style.display = "block";
    document.getElementById("upgradeViewer").style.float = "right";
}
function upgradeUndoHover() {
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
function reloadCookieCounter() {
    document.getElementById("cookieCounter").innerHTML = currentClickedPlural + ": " +cookiesView;
}
function reloadBuildingPrices() {
    document.getElementById("keyboardUpgrade").innerHTML = "Keyboard: " +keyboardUpgradeCost;
    document.getElementById("grandpaUpgrade").innerHTML = "Grandpa: " +grandpaUpgradeCost;
    document.getElementById("ranchUpgrade").innerHTML = "Ranch: " +ranchUpgradeCost;
    document.getElementById("tvUpgrade").innerHTML = "Television: " +tvUpgradeCost;
    document.getElementById("workerUpgrade").innerHTML = "Worker: " +workerUpgradeCost;
    document.getElementById("walletUpgrade").innerHTML = "Wallet: " +walletUpgradeCost;
    document.getElementById("churchUpgrade").innerHTML = "Church: " +churchUpgradeCost;
}
function checkInvalidCookies() {
    if (cookies == NaN) {
        resetSave();
    }
}
function makeUpgradeSound() {
    cookieClick.play(); // needs to be updated to different sfx
}
function createPopupAlertError(value) {
    switch (inDevelopment) {
        case 0:
            alert("An error occured: createSimplePopUp() has no " + value + " value. Please report this to the GitHub.");
            break;
        case 1:
            if (value == "title") {
                alert("createSimplePopUp() needs a "+value+" value. Use \"\" for a blank title");
            }
            else {
                alert("createSimplePopUp() needs a "+value+" value.");
            }
            break;
    }
}
function createSimplePopUp(x,y,text,noButton,doWhat,title,backButton,isError) {
    document.getElementById("popup").style.display = "block";
    document.getElementById("popupContent").innerHTML = text;
    document.getElementById("popup").style.width = x + "px";
    document.getElementById("popupButtonDiv").style.width = x + "px";
    document.getElementById("popup").style.height = y + "px";
    switch (title) {
        case "":
            document.getElementById("popup-title").style.display = "none";
            break;
        case "undefined":
            createPopupAlertError("title");
            break;
        default:
            document.getElementById("popup-title").style.display = "block";
            document.getElementById("popup-title").innerHTML = title;
            break;
    }
    switch (noButton) {
        case true:
            document.getElementById("popupButton").style.display = "none";
            break;
        case false:
            document.getElementById("popupButton").style.display = "inline-block";
            break;
        default:
            createPopupAlertError(noButton);
            break;
    }
    switch (backButton) {
        case true:
            document.getElementById("popupBackButton").style.display = "inline-block";
            break;
        case false:
            document.getElementById("popupBackButton").style.display = "none";
            break;
        default:
            createPopupAlertError("backButton");
            break;
    }
    switch (isError) {
        case true:
            document.getElementById("popup").style.borderColor = "red";
            break;
        case false:
            document.getElementById("popup").style.borderColor = "black";
            break;
        default:
            createPopupAlertError("isError");
            break;
    }

    const filter = document.getElementById("filter");
    filter.style.display = "block";

    popupButtonDo = doWhat;
}
function destroySimplePopUp() {
    document.getElementById("popup").style.display = "none";
    document.getElementById("popupContent").innerHTML = "null";
    document.getElementById("popupButton").style.display = "none";
    document.getElementById("filter").style.display = "none";
}
function popupClicked() {
    switch (popupButtonDo) {
        case "default":
            destroySimplePopUp();
            break;
        case "grandmaPromptClicks":
            grandmaPromptClicks = grandmaPromptClicks + 1;
            break;
        case "resetSave()":
            resetSave();
            destroySimplePopUp();
            break;
        case "localStorage.clear()":
            localStorage.clear();
            destroySimplePopUp();
            location.reload();
            break;
    }
    if (cookies < 0) {
        cookies = 0;
    }
}

// set areas to different things
function setBackground(color) {
    currentBackground = "url(img/backgrounds/background-" + color + ".png)";
    document.getElementById("leftSide").style.background = currentBackground;
    document.getElementById("middleButtons").style.background = currentBackground;
    document.getElementById("rightSide").style.background = currentBackground;

    consoleLogDev("Background color set to: " + color);
}

function setCurrentClicked(value) {
    switch (value) {
        case "cookie":
            document.getElementById("cookie").src = "img/cookie.png";
            currentClicked = "Cookie";
            currentClickedPlural = "Cookies";
            currentClickedLowercase = "cookie";
            currentClickedLowercasePlural = "cookies";
            break;
        case "potato":
            document.getElementById("cookie").src = "img/potato.png";
            currentClicked = "Potato";
            currentClickedPlural = "Potatoes";
            currentClickedLowercase = "potato";
            currentClickedLowercasePlural = "potatoes";
            break;
        case "strawberry":
            document.getElementById("cookie").src = "img/strawberry.png";
            currentClicked = "Strawberry";
            currentClickedPlural = "Strawberries";
            currentClickedLowercase = "strawberry";
            currentClickedLowercasePlural = "strawberries";
            break;
    }
}

function setDevMode(value) {
    switch (value) {
        case "off":
            devMode = 0;
            break;
        case "on":
            devMode = 1;
            console.log("Developer Mode activated.");
            document.getElementById("devModeSelect").disabled = true;
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
            document.getElementById("middle").style.background = currentBackground;
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
            document.getElementById("middle").style.background = currentBackground;
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
            document.getElementById("middle").style.background = currentBackground;
    }
}

function grandmasArrival() {
    switch (grandmaPromptClicks) {
        case 0:
            createSimplePopUp(300,150,"a familiar face appears...",false,"grandmaPromptClicks","",false,false);
            break;
        case 1:
            document.getElementById("popupImage").src = "img/grandma.png";
            document.getElementById("popupImage").style.display = "block";
            createSimplePopUp(300,150,"hello...",false,"grandmaPromptClicks","",false,false);
            break;
        case 2:
            createSimplePopUp(300,150,"how long have you done this for?",false,"grandmaPromptClicks","",false,false);
            break;
        case 3:
            createSimplePopUp(300,150,"oh my...",false,"grandmaPromptClicks","",false,false);
            break;
        case 4:
            createSimplePopUp(300,150,"well i suppose you must know this:",false,"grandmaPromptClicks","",false,false);
            break;
        case 5:
            createSimplePopUp(300,150,"<i>there is nothing else to do here</i>",false,"grandmaPromptClicks","",false,false);
            break;
        case 6:
            createSimplePopUp(300,150,"you win.",false,"grandmaPromptClicks","",false,false);
            document.getElementById("win").style.display = "block";
            won = 1;
            break;
        case 7:
            createSimplePopUp(300,150,"you may keep going...",false,"grandmaPromptClicks","",false,false);
            break;
        case 8:
            createSimplePopUp(300,150,"but you will be wasting your time.",false,"grandmaPromptClicks","",false,false);
            break;
        case 9:
            destroySimplePopUp();
            grandmaPromptClicks = grandmaPromptClicks + 1;
            break;
    }
}

// saves
function exportData() {
    autoSave();
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

function importData() {
    autoSave();
    var file = document.getElementById("importDataInput").files[0];
    var reader = new FileReader();

    reader.onload = function (e) {
        const file = e.target.result;
        const lines = file.split(/\r\n|\n/);
        currentImportedData = JSON.parse(reader.result);
    }
    reader.onerror = (e) => alert("something broke, don't expect me to fix it :D");

    reader.readAsText(file);
    
    reader.onloadend = () => {
        importReadData();
    };
}
function importReadData() {
    data = JSON.parse(currentImportedData);

    cookies = data[0];
    totalcookies = data[1];
    cookiesPerSecond = data[2];

    keyboardCPSGiven = data[3];
    grandpaCPSGiven = data[4];
    ranchCPSGiven = data[5];
    tvCPSGiven = data[6];
    workerCPSGiven = data[7];
    walletCPSGiven = data[8];
    churchCPSGiven = data[9];

    keyboardsBought = data[10];
    grandpasBought = data[11];
    ranchesBought = data[12];
    tvsBought = data[13];
    workersBought = data[14];
    walletsBought = data[15];
    churchesBought = data[16];

    keyboardCPSGain = data[17];
    grandpaCPSGain = data[18];
    ranchCPSGain = data[19];
    tvCPSGain = data[20];
    workerCPSGain = data[21];
    walletCPSGain = data[22];
    churchCPSGain = data[23];

    keyboardUpgradeCost = data[24];
    grandpaUpgradeCost = data[25];
    ranchUpgradeCost = data[26];
    tvUpgradeCost = data[27];
    workerUpgradeCost = data[28];
    walletUpgradeCost = data[29];
    churchUpgradeCost = data[30];

    upgrade0sBought = data[31];
    upgrade1sBought = data[32];
    upgrade2sBought = data[33];
    upgrade3sBought = data[34];
    upgrade4sBought = data[35];
    upgrade5sBought = data[36];
    upgrade6sBought = data[37];

    cookiesPerClick = data[38];
    cookieBeenClickedTimes = data[39];
    buildingsOwned = data[40];
    grandmaPromptClicks = data[41];
    hasCheated = data[42];
    won = data[43];
    reloadBuildingPrices();

    consoleLogDev("Imported save with " +cookies+ " cookies.");
}

function autoSave() {
    allToSave = [cookies, totalCookies, cookiesPerSecond,
        keyboardCPSGiven,grandpaCPSGiven,ranchCPSGiven,tvCPSGiven,workerCPSGiven,walletCPSGiven,churchCPSGiven,
        keyboardsBought,grandpasBought,ranchesBought,tvsBought,workersBought,walletsBought,churchesBought,
        keyboardCPSGain,grandpaCPSGain,ranchCPSGain,tvCPSGain,workerCPSGain,walletCPSGain,churchCPSGain,
        keyboardUpgradeCost,grandpaUpgradeCost,ranchUpgradeCost,tvUpgradeCost,workerUpgradeCost,walletUpgradeCost,churchUpgradeCost,
        upgrade0sBought,upgrade1sBought,upgrade2sBought,upgrade3sBought,upgrade4sBought,upgrade5sBought,upgrade6sBought,
        cookiesPerClick,cookieBeenClickedTimes,buildingsOwned,grandmaPromptClicks,hasCheated,won];
    switch (versionBranch) {
        case 0:
            localStorage.save = JSON.stringify(allToSave);
            break;
        case 1:
            switch (inDevelopment) {
                case 0:   
                    localStorage.betaSave = JSON.stringify(allToSave);
                    break;
                case 1:
                    localStorage.devSave = JSON.stringify(allToSave);
                    break;
            }
            break;
        default:
            alert("Version branch is invalid and auto-saving is not functional!");
            break;
    }
}

function loadAutoSave() {
    switch (versionBranch) {
        case 0:
            getLocalSave("save");
            break;
        case 1:
            switch (inDevelopment) {
                case 0:
                    getLocalSave("betaSave");
                    break;
                case 1:
                    getLocalSave("devSave");
                    break;
            }
            break;
    }
} // merge two later (idk why they are seperate things)
function getLocalSave(localStorageSave) {
    switch (localStorageSave) {
        case "save":
            dataLoaded = JSON.parse(localStorage.save);
            break;
        case "betaSave":
            dataLoaded = JSON.parse(localStorage.betaSave);
            break;
        case "devSave":
            dataLoaded = JSON.parse(localStorage.devSave);
            break;
        default:
            alert("Loading auto-saving is not functional because versionBranch or inDevelopment is invalid!");
            break;
    }
    cookies = dataLoaded[0];
    totalcookies = dataLoaded[1];
    cookiesPerSecond = dataLoaded[2];

    keyboardCPSGiven = dataLoaded[3];
    grandpaCPSGiven = dataLoaded[4];
    ranchCPSGiven = dataLoaded[5];
    tvCPSGiven = dataLoaded[6];
    workerCPSGiven = dataLoaded[7];
    walletCPSGiven = dataLoaded[8];
    churchCPSGiven = dataLoaded[9];

    keyboardsBought = dataLoaded[10];
    grandpasBought = dataLoaded[11];
    ranchesBought = dataLoaded[12];
    tvsBought = dataLoaded[13];
    workersBought = dataLoaded[14];
    walletsBought = dataLoaded[15];
    churchesBought = dataLoaded[16];

    keyboardCPSGain = dataLoaded[17];
    grandpaCPSGain = dataLoaded[18];
    ranchCPSGain = dataLoaded[19];
    tvCPSGain = dataLoaded[20];
    workerCPSGain = dataLoaded[21];
    walletCPSGain = dataLoaded[22];
    churchCPSGain = dataLoaded[23];

    keyboardUpgradeCost = dataLoaded[24];
    grandpaUpgradeCost = dataLoaded[25];
    ranchUpgradeCost = dataLoaded[26];
    tvUpgradeCost = dataLoaded[27];
    workerUpgradeCost = dataLoaded[28];
    walletUpgradeCost = dataLoaded[29];
    churchUpgradeCost = dataLoaded[30];

    upgrade0sBought = dataLoaded[31];
    upgrade1sBought = dataLoaded[32];
    upgrade2sBought = dataLoaded[33];
    upgrade3sBought = dataLoaded[34];
    upgrade4sBought = dataLoaded[35];
    upgrade5sBought = dataLoaded[36];
    upgrade6sBought = dataLoaded[37];

    cookiesPerClick = dataLoaded[38];
    cookieBeenClickedTimes = dataLoaded[39];
    buildingsOwned = dataLoaded[40];
    grandmaPromptClicks = dataLoaded[41];
    hasCheated = dataLoaded[42];
    won = dataLoaded[43];
    reloadBuildingPrices();
}

function resetSave() {
    switch (versionBranch) {
        case 0:
            localStorage.setItem("save",JSON.stringify(defaultSavedValues));
            break;
        case 1:
            switch (inDevelopment) {
                case 0:
                    localStorage.setItem("betaSave",JSON.stringify(defaultSavedValues));
                    break;
                case 1:
                    localStorage.setItem("devSave",JSON.stringify(defaultSavedValues));
            }
            break;
        default:
            alert("Resetting save is not functional because versionBranch or inDevelopment is invalid!");
            break;
    }
    loadAutoSave();
    reloadBuildingPrices();
}

function resetSaveButton() {
    createSimplePopUp(300,150,"Are you sure you want to do this?",false,"resetSave()","Warning",true,true);
}

console.log("what are you doing here? well... as long as its productive.");
