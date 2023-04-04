// variable definitions
const version = "0.4.1";
const versionBranch = 1; // 0 is main, 1 is beta

// customization
const backgroundForm = document.getElementById("backgroundSelect");
let currentBackground = "url(img/backgrounds/background-blue.png)";

let currentClicked = "Cookie";
let currentClickedPlural = "Cookies";
let currentClickedLowercase = "cookie";
let currentClickedLowercasePlural = "cookies";

// cookies
let cookies = 0;
let cookiesForCounter = Math.floor(cookies);
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
let upgrade3Description = "Multiplys TV production by 2" + "<br>" + "<i>'" + "Better than that CRT junk" + "'</i>";
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

// timer things
const intervalCPSU = setInterval(cookiesPerSecondUpdate, 1000);
const perMillisecondUniversalVar = setInterval(perMillisecondUniversal, 1);

// sounds
const cookieClick = new Audio("sfx/cookie-click.wav");
cookieClick.volume = 0.05;

// set version
document.getElementById("versionNumber").innerHTML = "Version: " +version;
switch (versionBranch) {
    case 0:
        document.getElementById("versionSwitchInfoText").innerHTML = "Clicking this will switch to the beta branch, this will wipe your current progress!";
        break;
    case 1:
        document.getElementById("versionSwitchInfoText").innerHTML = "Clicking this will switch to the main branch, this will wipe your current progress!";
        break;
}

// set default upgrades
document.getElementById("upgrade0").style.backgroundImage = "url(img/upgrades/reinforced-keys.png)";
document.getElementById("upgrade1").style.backgroundImage = "url(img/upgrades/hardwood-walking-stick.png)";
document.getElementById("upgrade2").style.backgroundImage = "url(img/upgrades/ranch-upgrade1.png)";
document.getElementById("upgrade3").style.backgroundImage = "url(img/upgrades/tv-upgrade1.png)";
document.getElementById("upgrade4").style.backgroundImage = "url(img/upgrades/worker-upgrade1.png)";

function perMillisecondUniversal() {
    cookiesForCounter = Math.round(cookies * 10) / 10;
    totalCookiesView = Math.round(totalCookies * 10) / 10;
    keyboardUpgradeCostView = Math.floor(keyboardUpgradeCost);
    reloadCookieCounter();

    // CPS
    cookiesPerSecondView = Math.round(cookiesPerSecond * 10) / 10;
    document.getElementById("cookiesPerSecondCounter").innerHTML = currentClickedPlural + " Per Second: " +cookiesPerSecondView;

    // Upgrade Unlocks (very long) (fixes accepted) (create a github pull request)
        // Keyboards
        if (keyboardsBought == 1 && upgrade0sBought == 0) {
            document.getElementById("upgrade0").style.display = "inline-block";
        }
        if (upgrade0sBought == 1 && keyboardsBought >= 5) {
            createUpgrade("upgrade0","Obsidian Keys","Multiplys keyboard and clicking " + currentClickedLowercasePlural + " by 2","so heavy they're always pressed",500,"img/upgrades/obsidian-keys.png");
        }
        // Grandpas
        if (grandpasBought == 1 && upgrade1sBought == 0) {
            document.getElementById("upgrade1").style.display = "inline-block";
        }
        // Ranches
        if (ranchesBought == 1 && upgrade2sBought == 0) {
            document.getElementById("upgrade2").style.display = "inline-block";
        }
        // TVs
        if (tvsBought == 1 && upgrade3sBought == 0) {
            document.getElementById("upgrade3").style.display = "inline-block";
        }
        // Workers
        if (workersBought == 1 && upgrade4sBought == 0) {
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

    // log to console in case of error
    if (cookies < 0) {
        createSimplePopUp(300,150,"<i>huh, what just happened?</i> <br> An error occured: " + currentClickedPlural + " are in negative!<br>Please report this to the GitHub accessable in the bottom left corner");
    }
    if (upgrade0Identifier == upgrade1Identifier) {
        createSimplePopUp(300,150,"<i>huh, what just happened?</i> <br> An error occured: Multiple of same upgrade or identifier is not set!<br>Please report this to the GitHub accessable in the bottom left corner");
    }
    // stats that need to be updated beforehand
    buildingsOwned = keyboardsBought + grandpasBought + ranchesBought + tvsBought + workersBought + walletsBought + churchesBought;
    
    // set statistic page statistics
    if (statsUp == 1) {
        document.getElementById("cookiesStat").innerHTML = currentClickedPlural + ": " + cookiesForCounter;
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
    cookies = cookies + cookiesPerSecond
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

function popupClicked() {
    destroySimplePopUp();
    if (cookies < 0) {
        cookies = 0;
    }
}
// dev commands
function setCookies(x) {
    if (devMode == 1) {
        cookies = x;
        totalCookies = totalCookies + x;
        reloadCookieCounter();
        document.getElementById("ifCheatedStat").innerHTML = "You have cheated on this playthrough!";
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
function perClickUpgrade() {
    if (cookies >= perClickUpgradeCost) {
        cookies = cookies - perClickUpgradeCost;
        perClickUpgradeCost = perClickUpgradeCost * 4;
        cookiesPerClick = cookiesPerClick * 2;
        reloadCookieCounter();
        document.getElementById("perClickUpgrade").innerHTML = "Per Click x2: " +perClickUpgradeCost;
    }
}

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
            createSimplePopUp(300,150,"<i>huh, what just happened?</i> <br> A fatal error occured: upgrade identifier is invalid!<br>Please report this to the GitHub accessable in the bottom left corner",true);
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
            createSimplePopUp(300,150,"<i>huh, what just happened?</i> <br> A fatal error occured: upgrade identifier is invalid for destroyed upgrade!<br>Please report this to the GitHub accessable in the bottom left corner",true);
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
    document.getElementById("cookieCounter").innerHTML = currentClickedPlural + ": " +cookiesForCounter;
}

function makeUpgradeSound() {
    cookieClick.play(); // needs to be updated to different sfx
}

function createSimplePopUp(x,y,text,buttonNot) {
    document.getElementById("popup").style.display = "block";
    document.getElementById("popupContent").innerHTML = text;
    document.getElementById("popup").style.width = x + "px";
    document.getElementById("popupButtonDiv").style.width = x + "px";
    document.getElementById("popup").style.height = y + "px";
    if (buttonNot == true) {
        document.getElementById("popupButton").style.display = "none";
    }
}

function destroySimplePopUp() {
    document.getElementById("popup").style.display = "none";
    document.getElementById("popupContent").innerHTML = "null";
    document.getElementById("popupButton").style.display = "none";
}

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

function toggleStats() {
    switch (statsUp) {
        case 0:
            if (optionsUp == 0 && infoUp == 0) {
                statsUp = 1;
                document.getElementById("statsMiddleText").style.display = "block";
                document.getElementById("middle").style.background = "black";
            }
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
            if (optionsUp == 0 && statsUp == 0) {
                infoUp = 1;
                document.getElementById("infoMiddleText").style.display = "block";
                document.getElementById("middle").style.background = "black";
            }
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
            if (infoUp == 0 && statsUp == 0) {
                optionsUp = 1;
                document.getElementById("optionsMiddleText").style.display = "block";
                document.getElementById("middle").style.background = "black";
            }
            break;
        case 1:
            optionsUp = 0;
            document.getElementById("optionsMiddleText").style.display = "none";
            document.getElementById("middle").style.background = currentBackground;
    }
}

function consoleLogDev(str) {
    if (devMode == 1) {
        console.log(str);
    }
}

console.log("Everything appears to have run successfully.");
console.log("## Welcome to the console! Developer commands can be found in the Javascript code. If you cant find that, then you aren't developer enough to be here :) ##");
