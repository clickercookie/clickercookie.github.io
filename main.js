// Variable definitions
const version = "0.2.2";
// cookies
var cookies = 0;
var cookiesForCounter = Math.floor(cookies);
var cookieBeenClickedTimes = 0;
// upgrades
var perClickUpgradeCost = 200;
// keyboards
var keyboardsBought = 0;
var keyboardUpgradeCost = 15;
// grandpas
var grandpasBought = 0;
var grandpaUpgradeCost = 100;
var grandpaUnlocked = 0;
// ranches
var ranchesBought = 0;
var ranchUpgradeCost = 1000;
var ranchUnlocked = 0;
// televisions
var tvsBought = 0;
var tvUpgradeCost = 5000;
var tvUnlocked = 0;
// laborers
var laborersBought = 0;
var laborerUpgradeCost = 10000;
var laborerUnlocked = 0;

// stats
var cookiesPerClick = 1;
var totalCookies = 0;
var totalCookiesView = Math.round(totalCookies * 10) / 10; // merge totalcookies & totalcookies view later
var cookiesPerSecond = 0;
var cookiesPerSecondView = cookiesPerSecond;

// timer things
const intervalCPSU = setInterval(cookiesPerSecondUpdate, 1000);
const perMillisecondUniversalVar = setInterval(perMillisecondUniversal, 1);

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

    // upgrade unlocks
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
        createSimplePopUp(300,150,"An error occured: Cookies are in negative!<br>Please report this to the GitHub accessable in the bottom left corner", true)
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
        keyboardUpgradeCost = keyboardUpgradeCost * 1.2;
        keyboardUpgradeCost = Math.floor(keyboardUpgradeCost);
        keyboardsBought = keyboardsBought + 1;
        cookiesPerSecond = cookiesPerSecond + 0.1;
        reloadCookieCounter();
        document.getElementById("keyboardUpgrade").innerHTML = "Keyboard: " +keyboardUpgradeCost;
        document.getElementById("keyboardsBought").innerHTML = +keyboardsBought;
    }
}

function grandpaUpgrade() {
    if (cookies >= grandpaUpgradeCost) {
        cookies = cookies - grandpaUpgradeCost;
        grandpaUpgradeCost = grandpaUpgradeCost * 1.15;
        grandpaUpgradeCost = Math.floor(grandpaUpgradeCost)
        grandpasBought = grandpasBought + 1;
        cookiesPerSecond = cookiesPerSecond + 1;
        reloadCookieCounter();
        document.getElementById("grandpaUpgrade").innerHTML = "Grandpa: " +grandpaUpgradeCost;
        document.getElementById("grandpasBought").innerHTML = +grandpasBought;
    }
}

function ranchUpgrade() {
    if (cookies >= ranchUpgradeCost) {
        cookies = cookies - ranchUpgradeCost;
        ranchUpgradeCost = ranchUpgradeCost * 1.25;
        ranchUpgradeCost = Math.floor(ranchUpgradeCost)
        ranchesBought = ranchesBought + 1;
        cookiesPerSecond = cookiesPerSecond + 10; // check if cookie clicker does this price
        reloadCookieCounter();
        document.getElementById("ranchUpgrade").innerHTML = "Ranch: " +ranchUpgradeCost;
        document.getElementById("ranchesBought").innerHTML = +ranchesBought;
    }
}

function tvUpgrade() {
    if (cookies >= tvUpgradeCost) {
        cookies = cookies - tvUpgradeCost;
        tvUpgradeCost = tvUpgradeCost * 1.25;
        tvUpgradeCost = Math.floor(tvUpgradeCost)
        tvsBought = tvsBought + 1;
        cookiesPerSecond = cookiesPerSecond + 100; // update
        reloadCookieCounter();
        document.getElementById("tvUpgrade").innerHTML = "Television: " +tvUpgradeCost;
        document.getElementById("tvsBought").innerHTML = +tvsBought;
    }
}
function laborerUpgrade() {
    if (cookies >= laborerUpgradeCost) {
        cookies = cookies - laborerUpgradeCost;
        laborerUpgradeCost = laborerUpgradeCost * 1.25;
        laborerUpgradeCost = Math.floor(laborerUpgradeCost)
        laborersBought = laborersBought + 1;
        cookiesPerSecond = cookiesPerSecond + 1000; // update
        reloadCookieCounter();
        document.getElementById("laborerUpgrade").innerHTML = "Laborer: " +laborerUpgradeCost;
        document.getElementById("laborersBought").innerHTML = +laborersBought;
    }
}

// helper functions
function reloadCookieCounter() {
    document.getElementById("cookieCounter").innerHTML = "Cookies: " +cookiesForCounter;
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