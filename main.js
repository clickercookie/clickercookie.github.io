// Variable definitions
const version = "0.4";
// cookies
var cookies = 0;
var cookiesForCounter = Math.floor(cookies);
// upgrades
var upgrade0sBought = 0;
var upgrade1sBought = 0;
var upgrade2sBought = 0;
var upgrade3sBought = 0;
var upgrade4sBought = 0;
var upgrade5sBought = 0;
var upgrade6sBought = 0;

// yes, i know, this is WILDLY INEFFICENT. If you can code better than me, please rewrite this better :D
var upgrade0Name = "Reinforced Keys";
var upgrade1Name = "null";
var upgrade2Name = "null";
var upgrade3Name = "null";
var upgrade4Name = "null";
var upgrade5Name = "null";
var upgrade6Name = "null";
var upgrade0Description = "Multiplys keyboard and clicking cookie production by 2" + "<br>" + "<i>'" + "press harder" + "'</i>";
var upgrade1Description = "null";
var upgrade2Description = "null";
var upgrade3Description = "null";
var upgrade4Description = "null";
var upgrade5Description = "null";
var upgrade6Description = "null";
var upgrade0Price = 100;
var upgrade1Price = 100;
var upgrade2Price = 100;
var upgrade3Price = 100;
var upgrade4Price = 100;
var upgrade5Price = 100;
var upgrade6Price = 100;
var upgrade0Identifier = "up0";
var upgrade1Identifier = "up1";
var upgrade2Identifier = "up2";
var upgrade3Identifier = "up3";
var upgrade4Identifier = "up4";
var upgrade5Identifier = "up4";
var upgrade6Identifier = "up4";

// keyboards
var keyboardsBought = 0;
var keyboardCPSGain = 0.1;
var keyboardCPSGiven = 0;
var keyboardUpgradeCost = 15;
// grandpas
var grandpasBought = 0;
var grandpaCPSGain = 1;
var grandpaCPSGiven = 0;
var grandpaUpgradeCost = 100;
var grandpaUnlocked = 0;
// ranches
var ranchesBought = 0;
var ranchCPSGain = 8;
var ranchCPSGiven = 0;
var ranchUpgradeCost = 1100;
var ranchUnlocked = 0;
// televisions
var tvsBought = 0;
var tvCPSGain = 47;
var tvCPSGiven = 0;
var tvUpgradeCost = 12000;
var tvUnlocked = 0;
// laborers
var laborersBought = 0;
var laborerCPSGain = 260;
var laborerCPSGiven = 0;
var laborerUpgradeCost = 130000;
var laborerUnlocked = 0;
// wallets
var walletsBought = 0;
var walletCPSGain = 1440;
var walletCPSGiven = 0;
var walletUpgradeCost = 1400000;
var walletUnlocked = 0;
// churches
var churchesBought = 0;
var churchCPSGain = 7800;
var churchCPSGiven = 0;
var churchUpgradeCost = 20000000;
var churchUnlocked = 0;

// stats
var cookiesPerClick = 1;
var cookieBeenClickedTimes = 0;
var totalCookies = 0;
var totalCookiesView = Math.round(totalCookies * 10) / 10; // merge totalcookies & totalcookies view later
var cookiesPerSecond = 0;
var cookiesPerSecondView = cookiesPerSecond;

// timer things
const intervalCPSU = setInterval(cookiesPerSecondUpdate, 1000);
const perMillisecondUniversalVar = setInterval(perMillisecondUniversal, 1);

// sounds
const cookieClick = new Audio("sfx/cookie-click.wav");
cookieClick.volume = 0.05;

// set version
document.getElementById("versionNumber").innerHTML = "Version: " +version;

// set default upgrades
document.getElementById("upgrade0").style.backgroundImage = "url(img/upgrades/reinforced-keys.png)";


function perMillisecondUniversal() {
    cookiesForCounter = Math.round(cookies * 10) / 10;
    totalCookiesView = Math.round(totalCookies * 10) / 10;
    keyboardUpgradeCostView = Math.floor(keyboardUpgradeCost);
    reloadCookieCounter();

    // CPS
    cookiesPerSecondView = Math.round(cookiesPerSecond * 10) / 10;
    document.getElementById("cookiesPerSecondCounter").innerHTML = "Cookies Per Second: " +cookiesPerSecondView;

    // upgrade unlocks  |  yes, more inefficent code. expect an upgrade in the future, or fix it yourself and create a pull request
    if (keyboardsBought >= 1) {
        document.getElementById("upgrade0").style.display = "inline-block";
        document.getElementById("upgradeViewer").style.display = "block";
        document.getElementById("upgradeViewer").style.float = "right";
    }
    if (upgrade0sBought == 1) {
        createUpgrade("upgrade0","Obsidian Keys","Multiplys keyboard and clicking cookies by 2","so heavy they're always pressed",1000,"img/unknown-64-64.png")
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
    if (totalCookies >= 50000) {
        laborerUnlocked = 1;
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
    if (laborerUnlocked == 1) {
        document.getElementById("laborerUpgrade").style.display = "inline";
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
        createSimplePopUp(300,150,"<i>huh, what just happened?</i> <br> An error occured: Cookies are in negative!<br>Please report this to the GitHub accessable in the bottom left corner");
    }
    if (upgrade0Identifier == upgrade1Identifier) {
        createSimplePopUp(300,150,"<i>huh, what just happened?</i> <br> An error occured: Multiple of same upgrade or identifier is not set!<br>Please report this to the GitHub accessable in the bottom left corner");
    }

    // set number of bought to bought (not required unless number of bought is set in console)
    document.getElementById("keyboardsBought").innerHTML = +keyboardsBought;
    document.getElementById("grandpasBought").innerHTML = +grandpasBought;
    document.getElementById("ranchesBought").innerHTML = +ranchesBought;
    document.getElementById("tvsBought").innerHTML = +tvsBought;
    document.getElementById("laborersBought").innerHTML = +laborersBought;
    document.getElementById("walletsBought").innerHTML = +walletsBought;
    document.getElementById("churchesBought").innerHTML = +churchesBought;

    cookiesPerSecond = keyboardCPSGiven+grandpaCPSGiven+ranchCPSGiven+tvCPSGiven+laborerCPSGiven+walletCPSGiven+churchCPSGiven;
}

function cookiesPerSecondUpdate() {

    cookies = cookies + cookiesPerSecond
    totalCookies = totalCookies + cookiesPerSecond;

    reloadCookieCounter();
}

function cookieClicked() {
    cookies = cookies + cookiesPerClick;
    cookieBeenClickedTimes = cookieBeenClickedTimes + 1;
    totalCookies = totalCookies + 1;
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
    cookies = x;
    totalCookies = totalCookies + x;
    reloadCookieCounter();
}

function setCPS(x) {
    cookiesPerSecond = x;
    cookiesPerSecondView = Math.round(cookiesPerSecond * 10) / 10;
    document.getElementById("cookiesPerSecondCounter").innerHTML = "Cookies Per Second: " +cookiesPerSecondView;
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
        grandpaUpgradeCost = Math.floor(grandpaUpgradeCost)
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
        ranchUpgradeCost = Math.floor(ranchUpgradeCost)
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
        tvUpgradeCost = Math.floor(tvUpgradeCost)
        tvsBought = tvsBought + 1;
        tvCPSGiven = tvCPSGiven + tvCPSGain;
        reloadCookieCounter();
        document.getElementById("tvUpgrade").innerHTML = "Television: " +tvUpgradeCost;
        document.getElementById("tvsBought").innerHTML = +tvsBought;
        makeUpgradeSound();
    }
}
function laborerUpgrade() {
    if (cookies >= laborerUpgradeCost) {
        cookies = cookies - laborerUpgradeCost;
        laborerUpgradeCost = laborerUpgradeCost * 1.15;
        laborerUpgradeCost = Math.floor(laborerUpgradeCost)
        laborersBought = laborersBought + 1;
        laborerCPSGiven = laborerCPSGiven + laborerCPSGain;
        reloadCookieCounter();
        document.getElementById("laborerUpgrade").innerHTML = "Laborer: " +laborerUpgradeCost;
        document.getElementById("laborersBought").innerHTML = +laborersBought;
        makeUpgradeSound();
    }
}
function walletUpgrade() {
    if (cookies >= walletUpgradeCost) {
        cookies = cookies - walletUpgradeCost;
        walletUpgradeCost = walletUpgradeCost * 1.15;
        walletUpgradeCost = Math.floor(walletUpgradeCost)
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
        churchUpgradeCost = Math.floor(churchUpgradeCost)
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
            createSimplePopUp(300,150,"<i>huh, what just happened?</i> <br> An error occured: upgrade identifier is invalid!<br>Please report this to the GitHub accessable in the bottom left corner");
            break;
    }
}

function upgrade0Clicked() {
    if (cookies >= upgrade0Price) {
        keyboardCPSGiven = keyboardCPSGiven * 2;
        keyboardCPSGain = keyboardCPSGain * 2;
        cookiesPerClick = cookiesPerClick * 2;
        upgrade0sBought = upgrade0sBought + 1;
    }
}
function upgrade1Clicked() {
    if (cookies >= upgrade1Price) {
        grandpaCPSGiven = grandpaCPSGiven * 2;
        grandpaCPSGain = grandpaCPSGain * 2;
        upgrade1sBought =+ 1;
    }
}
function upgrade2Clicked() {
    ranchCPSGiven = ranchCPSGiven * 2;
    ranchCPSGain = ranchCPSGain * 2;
    upgrade2sBought =+ 1;
}
function upgrade3Clicked() {
    // continue
}
function upgrade4Clicked() {
    
}
function upgrade5Clicked() {
    
}
function upgrade6Clicked() {
    
}

function upgrade0Hovered() {
    document.getElementById("upgradeName").innerHTML = "Name: " + upgrade0Name;
    document.getElementById("upgradePrice").innerHTML = "Price: " + upgrade0Price;
    document.getElementById("upgradeDesc").innerHTML = "Description: " + upgrade0Description;
}
function upgrade1Hovered() {
    document.getElementById("upgradeName").innerHTML = "Name: " + upgrade1Name;
    document.getElementById("upgradePrice").innerHTML = "Price: " + upgrade1Price;
    document.getElementById("upgradeDesc").innerHTML = "Description: " + upgrade1Description;
}
function upgrade2Hovered() {
    document.getElementById("upgradeName").innerHTML = "Name: " + upgrade2Name;
    document.getElementById("upgradePrice").innerHTML = "Price: " + upgrade2Price;
    document.getElementById("upgradeDesc").innerHTML = "Description: " + upgrade2Description;
}
function upgrade3Hovered() {
    document.getElementById("upgradeName").innerHTML = "Name: " + upgrade3Name;
    document.getElementById("upgradePrice").innerHTML = "Price: " + upgrade3Price;
    document.getElementById("upgradeDesc").innerHTML = "Description: " + upgrade3Description;
}
function upgrade4Hovered() {
    document.getElementById("upgradeName").innerHTML = "Name: " + upgrade4Name;
    document.getElementById("upgradePrice").innerHTML = "Price: " + upgrade4Price;
    document.getElementById("upgradeDesc").innerHTML = "Description: " + upgrade5Description;
}
function upgrade5Hovered() {
    document.getElementById("upgradeName").innerHTML = "Name: " + upgrade5Name;
    document.getElementById("upgradePrice").innerHTML = "Price: " + upgrade5Price;
    document.getElementById("upgradeDesc").innerHTML = "Description: " + upgrade5Description;
}
function upgrade6Hovered() {
    document.getElementById("upgradeName").innerHTML = "Name: " + upgrade6Name;
    document.getElementById("upgradePrice").innerHTML = "Price: " + upgrade6Price;
    document.getElementById("upgradeDesc").innerHTML = "Description: " + upgrade6Description;
}

// helper functions
function reloadCookieCounter() {
    document.getElementById("cookieCounter").innerHTML = "Cookies: " +cookiesForCounter;
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

console.log("Everything appears to have run successfully.");
console.log("## Welcome to the console! Developer commands can be found in the Javascript code. If you cant find that, then you aren't developer enough to be here :) ##");