var cookies = 0;
var cookiesForCounter = Math.floor(cookies);
var totalCookies = 0;
var cookieBeenClickedTimes = 0;
// upgrades
var perClickUpgradeCost = 200;
var keyboardUpgradeCost = 20;
var keyboardUpgradeCostView = Math.floor(keyboardUpgradeCost);
var grandpaUpgradeCost = 50;
var grandpaUpgradeCostView = Math.floor(grandpaUpgradeCost);
var grandpaUnlocked = 0;
// stats
var cookiesPerClick = 1;
var cookiesPerSecond = 0;
var cookiesPerSecondView = cookiesPerSecond;

// timer things
const intervalCPSU = setInterval(cookiesPerSecondUpdate, 1000);
const perMillisecondUniversalVar = setInterval(perMillisecondUniversal, 1);

function perMillisecondUniversal() {
    cookiesForCounter = Math.round(cookies * 10) / 10;
    keyboardUpgradeCostView = Math.floor(keyboardUpgradeCost);
    reloadCookieCounter();

    // CPS
    cookiesPerSecondView = Math.round(cookiesPerSecond * 10) / 10;
    document.getElementById("cookiesPerSecondCounter").innerHTML = "Cookies Per Second: " +cookiesPerSecondView;

    totalCookies =  cookieBeenClickedTimes * cookiesPerClick;

    // upgrade unlocks
    if (cookies >= 200) {
        grandpaUnlocked = 1;
    }

    // keep unlocked
    if (grandpaUnlocked == 1) {
        document.getElementById("grandpaUpgrade").style.visibility = "visible";
    }
}

function cookiesPerSecondUpdate() {
    cookies = cookies + cookiesPerSecond;
    totalCookies = totalCookies + cookiesPerSecond;
    reloadCookieCounter();
}

function cookieClicked() {
    cookies = cookies + cookiesPerClick;
    cookieBeenClickedTimes = cookieBeenClickedTimes + 1; // not working
    reloadCookieCounter();
}

// dev commands
function setCookies(x) {
    cookies = x;
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
        keyboardUpgradeCost = keyboardUpgradeCost * 1.2; // needs balancing
        cookiesPerSecond = cookiesPerSecond + 0.1;
        reloadCookieCounter();
        keyboardUpgradeCostView = Math.floor(keyboardUpgradeCost);
        document.getElementById("keyboardUpgrade").innerHTML = "Keyboard: " +keyboardUpgradeCostView;
    }
}

function grandpaUpgrade() {
    if (cookies >= grandpaUpgradeCost) {
        cookies = cookies - grandpaUpgradeCost;
        grandpaUpgradeCost = grandpaUpgradeCost * 1.25;
        cookiesPerSecond = cookiesPerSecond + 1;
        reloadCookieCounter();
        grandpaUpgradeCostView = Math.floor(grandpaUpgradeCost);
        document.getElementById("grandpaUpgrade").innerHTML = "Grandpa: " +grandpaUpgradeCostView; // something not updating the viewed price tag
    }
}

// helping things
function reloadCookieCounter() {
    document.getElementById("cookieCounter").innerHTML = "Cookies: " +cookiesForCounter;
}