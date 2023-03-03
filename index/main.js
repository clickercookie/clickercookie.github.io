var cookies = 0;
var cookiesForCounter = Math.floor(cookies);
var totalCookies = 0;
var cookieBeenClickedTimes = 0;
// upgrades
var perClickUpgradeCost = 200;
var clickerOneUpgradeCost = 20;
var clickerOneUpgradeCostView = Math.floor(clickerOneUpgradeCost);
var clickerTwoUpgradeCost = 50;
var clickerTwoUpgradeCostView = Math.floor(clickerTwoUpgradeCost);
var clickerTwoUnlocked = 0;
// stats
var cookiesPerClick = 1;
var cookiesPerSecond = 0;
var cookiesPerSecondView = cookiesPerSecond;

// timer things
const intervalCPSU = setInterval(cookiesPerSecondUpdate, 1000);
const perMillisecondUniversalVar = setInterval(perMillisecondUniversal, 1);

function perMillisecondUniversal() {
    cookiesForCounter = Math.round(cookies * 10) / 10;
    clickerOneUpgradeCostView = Math.floor(clickerOneUpgradeCost);
    reloadCookieCounter();

    // CPS
    cookiesPerSecondView = Math.round(cookiesPerSecond * 10) / 10;
    document.getElementById("cookiesPerSecondCounter").innerHTML = "Cookies Per Second: " +cookiesPerSecondView;

    totalCookies =  cookieBeenClickedTimes * cookiesPerClick;

    // upgrade unlocks
    if (cookies >= 200) {
        clickerTwoUnlocked = 1;
    }

    // keep unlocked
    if (clickerTwoUnlocked == 1) {
        document.getElementById("clickerTwoUpgrade").style.visibility = "visible";
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

function clickerOneUpgrade() {
    if (cookies >= clickerOneUpgradeCost) {
        cookies = cookies - clickerOneUpgradeCost;
        clickerOneUpgradeCost = clickerOneUpgradeCost * 1.25; // needs balancing
        cookiesPerSecond = cookiesPerSecond + 0.1;
        reloadCookieCounter();
        clickerOneUpgradeCostView = Math.floor(clickerOneUpgradeCost);
        document.getElementById("clickerOneUpgrade").innerHTML = "Clicker 1: " +clickerOneUpgradeCostView;
    }
}

function clickerTwoUpgrade() {
    if (cookies >= clickerTwoUpgradeCost) {
        cookies = cookies - clickerTwoUpgradeCost;
        clickerTwoUpgradeCost = clickerTwoUpgradeCost * 1.25;
        cookiesPerSecond = cookiesPerSecond + 1;
        reloadCookieCounter();
        clickerOneUpgradeCostView = Math.floor(clickerTwoUpgradeCost);
        document.getElementById("clickerTwoUpgrade").innerHTML = "Clicker 2: " +clickerTwoUpgradeCostView; // something not updating the viewed price tag
    }
}

// helping things
function reloadCookieCounter() {
    document.getElementById("cookieCounter").innerHTML = "Cookies: " +cookiesForCounter;
}