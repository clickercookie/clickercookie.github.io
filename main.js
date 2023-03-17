// Variable definitions
const version = "0.2.3";
// cookies
var cookies = 0;
var cookiesForCounter = Math.floor(cookies);
// upgrades
var numberOfUpgrades = 0;

// yes, i know, this is WILDLY INEFFICENT. If you can code better than me, please rewrite this better :D
var upgrade0Name = "null";
var upgrade1Name = "null";
var upgrade2Name = "null";
var upgrade3Name = "null";
var upgrade4Name = "null";
var upgrade0Description = "null";
var upgrade1Description = "null";
var upgrade2Description = "null";
var upgrade3Description = "null";
var upgrade4Description = "null";
var upgrade0Price = 100;
var upgrade1Price = 100;
var upgrade2Price = 100;
var upgrade3Price = 100;
var upgrade4Price = 100;
var upgrade0Identifier = "up0";
var upgrade1Identifier = "up1";
var upgrade2Identifier = "up2";
var upgrade3Identifier = "up3";
var upgrade4Identifier = "up4";

var reinforcedKeysAvaliable = 0; // this is a temporary variable as a solution to an issue until a fix is found

// keyboards
var keyboardsBought = 0;
var keyboardCPSGain = 0.1;
var keyboardUpgradeCost = 15;
// grandpas
var grandpasBought = 0;
var grandpaCPSGain = 1;
var grandpaUpgradeCost = 100;
var grandpaUnlocked = 0;
// ranches
var ranchesBought = 0;
var ranchCPSGain = 8;
var ranchUpgradeCost = 1100;
var ranchUnlocked = 0;
// televisions
var tvsBought = 0;
var tvCPSGain = 47;
var tvUpgradeCost = 12000;
var tvUnlocked = 0;
// laborers
var laborersBought = 0;
var laborerCPSGain = 260;
var laborerUpgradeCost = 130000;
var laborerUnlocked = 0;

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

function perMillisecondUniversal() {
    cookiesForCounter = Math.round(cookies * 10) / 10;
    totalCookiesView = Math.round(totalCookies * 10) / 10;
    keyboardUpgradeCostView = Math.floor(keyboardUpgradeCost);
    reloadCookieCounter();

    // CPS
    cookiesPerSecondView = Math.round(cookiesPerSecond * 10) / 10;
    document.getElementById("cookiesPerSecondCounter").innerHTML = "Cookies Per Second: " +cookiesPerSecondView;

    // building unlocks
    if (totalCookies >= 100) {
        grandpaUnlocked = 1;
    }
    if (totalCookies >= 500) {
        ranchUnlocked = 1;
    }
    if (totalCookies >= 3000) {
        tvUnlocked = 1;
    }
    if (totalCookies >= 7000) {
        laborerUnlocked = 1;
    }

    if (keyboardsBought == 1 && reinforcedKeysAvaliable == 0) {
        reinforcedKeysAvaliable = 1;
        createUpgrade("Reinforced Keys", "press harder", 100, "reinforcedKeys");
    }

    // keep unlocked
    if (grandpaUnlocked == 1) {
        document.getElementById("grandpaUpgrade").style.display = "inline";
        document.getElementById("upgrade1").style.display = "block";
    }
    if (ranchUnlocked == 1) {
        document.getElementById("ranchUpgrade").style.display = "inline";
        document.getElementById("upgrade2").style.display = "block";
    }
    if (tvUnlocked == 1) {
        document.getElementById("tvUpgrade").style.display = "inline";
        document.getElementById("upgrade3").style.display = "block";
    }
    if (laborerUnlocked == 1) {
        document.getElementById("laborerUpgrade").style.display = "inline";
        document.getElementById("upgrade4").style.display = "block";
    }

    // log to console in case of error
    if (cookies < 0) {
        createSimplePopUp(300,150,"An error occured: Cookies are in negative!<br>Please report this to the GitHub accessable in the bottom left corner", true);
    }
    if (upgrade0Identifier == upgrade1Identifier) {
        createSimplePopUp(300,150,"An error occured: Multiple of same upgrade or identifier is not set!<br>Please report this to the GitHub accessable in the bottom left corner", true);
    }

    // set number of bought to bought
    document.getElementById("keyboardsBought").innerHTML = +keyboardsBought;
    document.getElementById("grandpasBought").innerHTML = +grandpasBought;
    document.getElementById("ranchesBought").innerHTML = +ranchesBought;
    document.getElementById("tvsBought").innerHTML = +tvsBought;
    document.getElementById("laborersBought").innerHTML = +laborersBought;
}

function cookiesPerSecondUpdate() {
    cookies = cookies + cookiesPerSecond;
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
        cookiesPerSecond = cookiesPerSecond + keyboardCPSGain;
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
        cookiesPerSecond = cookiesPerSecond + grandpaCPSGain;
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
        cookiesPerSecond = cookiesPerSecond + ranchCPSGain;
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
        cookiesPerSecond = cookiesPerSecond + tvCPSGain;
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
        cookiesPerSecond = cookiesPerSecond + laborerCPSGain;
        reloadCookieCounter();
        document.getElementById("laborerUpgrade").innerHTML = "Laborer: " +laborerUpgradeCost;
        document.getElementById("laborersBought").innerHTML = +laborersBought;
        makeUpgradeSound();
    }
}

// managing upgrades
function createUpgrade(name,description,price,identifier) {
    const newUpgrade = document.createElement("div");
    switch (numberOfUpgrades) {
        case 0:
            numberOfUpgrades = 1;
            newUpgrade.id = "upgrade0";
            newUpgrade.onclick = "upgrade0Clicked()";
            upgrade0Name = name;
            upgrade0Description = description;
            upgrade0Price = price;
            upgrade0Identifier = identifier;
            break;
        case 1:
            numberOfUpgrades = 2;
            newUpgrade.id = "upgrade1";
            newUpgrade.onClick = "upgrade1Clicked()";
            upgrade1Name = name;
            upgrade1Description = description;
            upgrade1Price = price;
            upgrade1Identifier = identifier;
            break;
        case 2:
            numberOfUpgrades = 3;
            newUpgrade.id = "upgrade2";
            newUpgrade.onClick = "upgrade2Clicked()";
            upgrade2Name = name;
            upgrade2Description = description;
            upgrade2Price = price;
            upgrade2Identifier = identifier;
            break;
        case 3:
            numberOfUpgrades = 4;
            newUpgrade.id = "upgrade3";
            newUpgrade.onClick = "upgrade3Clicked()";
            upgrade3Name = name;
            upgrade3Description = description;
            upgrade3Price = price;
            upgrade3Identifier = identifier;
            break;
        case 4:
            numberOfUpgrades = 5;
            newUpgrade.id = "upgrade4";
            newUpgrade.onClick = "upgrade4Clicked()";
            upgrade4Name = name;
            upgrade4Description = description;
            upgrade4Price = price;
            upgrade4Identifier = identifier;
            break;
        // continue
    }
    newUpgrade.className = "upgrade";
    

    document.getElementById("upgradesHolder").appendChild(newUpgrade);
}
 // yes i know, this is WILDLY INEFFECIENT. If you are better at coding that me, it would be great if you could rewrite this better :D
function upgrade0Clicked() {
    switch (upgrade0Identifier) {
        case "reinforcedKeys":
            if (cookies >= upgrade0Price) {
                keyboardCPSGain = keyboardCPSGain * 2;
                cookiesPerClick = cookiesPerClick * 2;
                cookiesPerSecond = cookiesPerSecond + keyboardsBought * 0.2
            }
    }
}
function upgrade1Clicked() {
    
}
function upgrade2Clicked() {
    
}
function upgrade3Clicked() {
    
}
function upgrade4Clicked() {
    
}

// helper functions
function reloadCookieCounter() {
    document.getElementById("cookieCounter").innerHTML = "Cookies: " +cookiesForCounter;
}

function makeUpgradeSound() {
    cookieClick.play(); // needs to be updated to different sfx
}

function createSimplePopUp(x,y,text,button) {
    document.getElementById("popup").style.display = "block";
    document.getElementById("popupContent").innerHTML = text;
    document.getElementById("popup").style.width = x + "px";
    document.getElementById("popupButtonDiv").style.width = x + "px";
    document.getElementById("popup").style.height = y + "px";
    if (button == true) {
        document.getElementById("popupButton").style.display = "block";
    }
}

function destroySimplePopUp() {
    document.getElementById("popup").style.display = "none";
    document.getElementById("popupContent").innerHTML = "null";
    document.getElementById("popupButton").style.display = "none";
}

console.log("Everything appears to have run successfully.")