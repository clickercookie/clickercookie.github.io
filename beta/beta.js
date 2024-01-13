// ------------------------------------
// Variable & Object Definitions
// ------------------------------------
const version = "0.6";
const versionBranch = (location.pathname == "/beta/beta" || location.pathname == "/beta/beta.html") ? 1 : 0; // 0 is main, 1 is beta
const inDevelopment = 0; // toggle if developing actively. This is completely different than the builtin dev mode!
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
    "Hardwood Walking Stick","Rocking Chair","Reading Glasses","Dementia Pills","shotgun", // grandpa
    "Pig Slop","ranch2","ranch3","ranch4","ranch5", // ranch
    "LED Display","television2","television3","television4","television5", // television
    "Medkits","worker2","worker3","worker4","worker5", // worker
    "200 dollar bills","wallet2","wallet3","safe","wallet5", // wallet
    "the pope","church2","church3","church4","church5", // church
];
upgrades.quotes = [
    "press harder","so heavy they're always pressed","that's very heavy","<i><b>efficiency</b></i>","why press when you don't have to?", // keyboard
    "nonna dat softwood junk","newest addition to the porch*","helps with precise chocolate chip placement","what was i doing again?","grandpa's precious*", // grandpa
    "Wait, what have we been feeding them before now?","temp","temp","temp","temp", // ranch
    "World's greatest leap in digital technology*","temp","temp","temp","temp", // television
    "Constant supply of Band-Aids in case of emergency","temp","temp","temp","temp", // worker
    "I'm sure the federal reserve will be okay with this...*","temp","temp","you can keep your cookies even <b>safe</b>r!!","temp", // wallet
    "his holiness will provide many cookies","temp","temp","temp","temp", // church
];
upgrades.descriptions = [`Multiplys Keyboard and clicking ${personalization.currentClicked.toLowerCase()} production by 2`,"Multiplys Grandpa production by 2","Multiplys Ranch production by 2","Multiplys TV production by 2","Multiplys Worker production by 2","Multiplys Wallet production by 2","Multiplys Church production by 2"];
// image notes
// grandpa4 (dementia pills) is extremely bland
// reading glasses look awful
upgrades.img = [
    "reinforced-keys.png","obsidian-keys.png","osmium-keys.png","10-finger-typing.png","macros.png",
    "hardwood-walking-stick.png","rocking-chair.png","reading-glasses.png","dementia-pills.png","shotgun.png",
    "ranch-upgrade1.png",undefined,undefined,undefined,undefined,
    "tv-upgrade1.png",undefined,undefined,undefined,undefined,
    "medkits.png",undefined,undefined,undefined,undefined,
    "200-dollar-bill.png",undefined,undefined,"safe.png",undefined,
    "the-pope.png",undefined,undefined,undefined,undefined,
];

upgrades.upgradesBought = 0;
upgrades.currentlyShown = 0;
upgrades.rowsOfUpgrades = 0;

// buildings
const buildings = {}; // ! i don't think this is used anymore...

// dev variables
const dev = {
    devMode: 0,
    CPSGiven: 0
};

// mods stuff
const mods = {};

mods.numberLoaded = 0;
mods.allMods = [];
let isModded = false;

// middle other occupiers
let statsUp = false;
let infoUp = false;
let optionsUp = false;

// misc
let cookieProductionStopped = false;
let hasCheated = false;
let won = 0;
let mobile; // defined in initialization
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
    "core.cookiesPerClick":1,"core.cookieBeenClickedTimes":0,"core.buildingsOwned":0,"hasCheated":false,"won":0,"isModded":false,"versionBranch":versionBranch
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

    if (localStorage.cookies >= 0)
        helper.popup.createSimple(400,200,"You are using the old saving method. You will have issues with saving now that the new one is implimented. Clicking below will reset your save to the new format.",false,"localStorage.clear()","Warning",false,false);

    helper.reloadBuildingPrices();
    if (localStorage.getItem("save") == null) {
        localStorage.setItem("save",JSON.stringify(saves.defaultSavedValues));
        console.log("save was null and was automatically reset, if this is your first time playing this is an intended behavior.");
    }
    if (localStorage.getItem("betaSave") == null) {
        localStorage.setItem("betaSave",JSON.stringify(saves.defaultSavedValues));
        console.log("betaSave was null and was automatically reset, if this is your first time playing this is an intended behavior.");
    }

    saves.loadSave();

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

    if (won)
        // document.getElementById("win").style.display = "block";
    
    if (hasCheated)
        document.getElementById("ifCheatedStat").innerHTML = "You have cheated on this playthrough!";

    upgrades.updateBoughtStatistic();

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

        const mousePos = document.createElement("p");
        mousePos.appendChild(document.createTextNode("Mouse Pos: (?, ?)"));
        mousePos.setAttribute("id","mousePosDevText");
        mousePos.setAttribute("style","margin-bottom:0px;");
        devDiv.appendChild(mousePos);

        const br2 = document.createElement("br");
        devDiv.appendChild(br2);

        const devLoadButton = document.createElement("button");
        devLoadButton.appendChild(document.createTextNode("Force Load Save"));
        devLoadButton.setAttribute("onclick","saves.loadSave()");
        devDiv.appendChild(devLoadButton);

        const br3 = document.createElement("br");
        devDiv.appendChild(br3);

        const mobileOn = document.createElement("button");
        mobileOn.appendChild(document.createTextNode("Goto Mobile Mode"));
        const mobileOnHyperlink = document.createElement("a");
        mobileOnHyperlink.setAttribute("href","../mobile/mobile.html");
        mobileOnHyperlink.appendChild(mobileOn);
        devDiv.appendChild(mobileOnHyperlink);

        const br4 = document.createElement("br");
        devDiv.appendChild(br4);

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

        dev.setDevMode(true);
        document.getElementById("offSelectionDev").innerHTML = "Overwritten";
    }

    // change version branch specific stuff
    if (!versionBranch) {
        // change title
        document.title = "Clicker Cookie";
        // change version displayed
        document.getElementById("versionNumber").innerHTML = `Version: ${version}`;
        document.getElementById("versionSwitchInfoText").innerHTML = "Clicking this will switch to the beta branch";
    } else {
        // change title
        document.title = "Clicker Cookie Beta";
        // change version displayed
        document.getElementById("versionNumber").innerHTML = `Version: ${version} Beta`;
        document.getElementById("versionSwitchInfoText").innerHTML = "Clicking this will switch to the main branch";
        // show the developer mode switch
        document.getElementById("devForm").style.display = "block";
    }
    if (inDevelopment)
        document.title = "Clicker Cookie Dev";

    // Changelog Entries, AKA the messiest place ever.
    createChangelogEntry("0.6",["The long awaited 5 upgrades for every single building. No upgrades are planned beyond this.",
    "A list of bought upgrades in the Statistics menu, hovering over them will show info related to the upgrade.",
    "A gray \"dark noise\" has been added to middle text menus so that blacks will more easily stick out.",
    "Temporary notification in the bottom-left corner when the game saves."],
    ["Upgrades to building and upgrade pixel art. For any artists willing to contribute, .ase files can be found in the /img/ase folder on the GitHub.",
    "All buildings are now apart of a class so mod developers can have an easier time creating them.",
    "The saving system. Yes, 3rd time or something, but this time I GURANTEE it's going to stick.",
    "Grandma has been removed due to addition of upgrades and needing to rebalance when the player \"wins\". Also because i'm scared of copyright issues :)",
    "All changelog entries are now created with Javascript to cut down on the HTML size.",
    "Upgrade viewer and building info are now combined into one tooltip and sizes have been adjusted.",
    "Popups now use dialog boxes, which has an unintended side effect of making their contents look sharper (yay!)",
    "Using the Github button now opens a new tab.",
    "All boolean variables that used numbers (1 and 0) now use actual booleans (true and false).",
    "Most logic based variable assignments now use ternary operators.",
    "All remaining ancient plus sign string concatenation now use template literals.",
    "Changing the document title now uses document.title instead of assigning an ID to the title element."],
    ["Upgrade pixel art images were extremely blurry. Buildings still have this blur, but actually make the image look better, so it will stay for the time being.",
    "Centering of buildings bought was done stupidly, fixed now.",
    "The X button in the middle area was pushing the titles to the left and making it so they weren't centered.",
    "Advanced popups had no filter.",
    "Previously created changelog entries are now grammatically correct.",
    "Accessing the beta version by going to clickercookie.github.io/beta would result in a 404."],"actual upgrades");

    createChangelogEntry("0.5.2",["Mobile Support!",
    "Mods!",
    "Little X button in the middle area."],
    ["Cleaned up CSS.",
    "Saves from the main branch no longer are allowed in beta and vice versa to prevent corrupted saves.",
    "Popups are now a flexbox.",
    "Small gradient on middle text to make it slightly more nice to look at then solid black.",
    "Better middle button function."],
    ["Options middle text said \"Autosave Management\" when it was supposed to save \"Save Management\"."],"hold the phone","June 23rd");

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
    "Initialization is now inside an object method and called at the bottom of main.js."],
    ["Hover infobox not updating when the mouse doesn't move.",
    "Grandma showing in simple popups when she isn't supposed to be.",
    "0.5 header having no date.",
    "upgrade#Identifier is no longer used and has been deleted.",
    "Options middle text was highlightable.",
    "Middle text subtitles weren't lined up with other text.",
    "Cookie was clickable in a box shape outside the actual visible cookie."],"Objects Everywhere","May 24th");

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
    "These list items being highlightable."],undefined,"May 6th");

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
    
    createChangelogEntry("0.1",["Existence."],undefined,undefined,undefined,"March 4th");

    if (navigator.userAgent.match(/Android/i) // stolen from https://www.tutorialspoint.com/How-to-detect-a-mobile-device-with-JavaScript (doesn't always work)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)) {
        mobile = true;
        personalization.currentBackground = "url(../img/backgrounds/background-blue.png)";
        if (location.pathname == "/" || location.pathname == "/beta/beta" || location.pathname == "/beta/beta.html") {
            location.href = (versionBranch) ? "../mobile/mobile.html" : "mobile/mobile.html";
        }
    } else {
        mobile = false;
    }
    
    // this would go after data is loaded, but it requires the mobile variable to be assigned a value
    if (isModded && !mobile) {
        document.getElementById("ifModdedStat").innerHTML = "You have activated mods on this playthrough!";
    }
}

// Events
let mousePos = {x: undefined, y: undefined};
window.addEventListener('mousemove', (event) => {
    mousePos = {
        x: event.clientX,
        y: event.clientY 
    };
    if (inDevelopment == 1)
        document.getElementById("mousePosDevText").textContent = `Mouse Pos: (${mousePos.x}, ${mousePos.y})`;
});

// timer things
setInterval(cookiesPerSecondUpdate, 1000);
setInterval(perMillisecondUniversal, 1);
setInterval(autoSaveIntervalFunc, 60 * 1000);

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
        grandpa.unlocked = true;
        grandpa.setVisibility(true);
    }
    if (core.totalCookies >= 700) {
        ranch.unlocked = true;
        ranch.setVisibility(true);
    }
    if (core.totalCookies >= 8000) {
        television.unlocked = true;
        television.setVisibility(true);
    }
    if (core.totalCookies >= 80000) {
        worker.unlocked = true;
        worker.setVisibility(true);
    }
    if (core.totalCookies >= 700000) {
        wallet.unlocked = true;
        wallet.setVisibility(true);
    }
    if (core.totalCookies >= 15000000) {
        church.unlocked = true;
        church.setVisibility(true);
    }

    // check for stopped cookie production
    if (cookieProductionStopped)
        core.cookies = 0;

    // log to console in case of error
    if (core.cookies < 0) {
        helper.popup.createSimple(300,150,`<i>huh, what just happened?</i> <br> An error occured: ${personalization.currentClickedPlural} are in negative!<br>Please report this to the GitHub accessable in the bottom left corner`,false,"reset cookies","",false,true);
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
    if (!savingAllowed) return false;

    saves.save();
}

// ------------------------------------
// Functions
// ------------------------------------
core.cookieClicked = function() {
    core.cookies += core.cookiesPerClick;
    core.cookieBeenClickedTimes++;
    core.totalCookies += core.cookiesPerClick;
    helper.reloadCookieCounter();
}
// dev commands
dev.setDevMode = function(value) {
    if (value === "on") value = true;
    if (value === "off") value = false;

    if (!value) {
        dev.devMode = false;
        return;
    }

    dev.devMode = true;
    console.log("Developer Mode activated.");
    document.getElementById("devModeSelect").disabled = true;
    document.getElementById("whiteBackground").style.display = "block";
}
dev.setCookies = function(x) {
    if (!dev.devMode) return "You need developer mode ON to run this command.";

    core.cookies = x;
    core.totalCookies = core.totalCookies + x;
    hasCheated = true;
    helper.reloadCookieCounter();
    document.getElementById("ifCheatedStat").innerHTML = "You have cheated on this playthrough!";
}
dev.setCPS = function(x) {
    if (!dev.devMode) return "You need developer mode ON to run this command.";

    dev.CPSGiven = x;
    hasCheated = true;
    variableView.cookiesPerSecondView = Math.round(core.cookiesPerSecond * 10) / 10;
    helper.reloadCPSCounter();
    document.getElementById("ifCheatedStat").innerHTML = "<b>You have cheated on this playthrough!</b>";
}
dev.toggleSaving = function() { // TODO 0.6: this should be a toggle without dev mode
    if (!this.devMode) return "You need developer mode ON to run this command.";

    savingAllowed = !savingAllowed

    if (!inDevelopment) return;
    document.getElementById("currentSavingStatus").innerHTML = `saving: ${savingAllowed}`;
}

// ------------------------------------
// Buildings
// ------------------------------------
class Building {
    constructor(name,quote,upgradeCost,CPSGain,id,iconImg="unknown.png",esPlural=false) {
        if (document.getElementById(`building${id}`) != null) {
            helper.popup.createSimple(300,150,`<i>huh, what just happened?</i> <br> An error occured: Tried to create a building that already exists (id ${id}).`,true,"default","Error",false,true);
            return;
        }

        this.name = name; // ! SHOULD BE SAME AS OBJECT INSTANCE NAME, will be changed in 0.7!!!
        this.quote = quote;
        this.upgradeCost = upgradeCost;
        this.CPSGiven = 0;
        this.CPSGain = CPSGain;
        this.id = id

        this.bought = 0;
        this.unlocked = false;
        if (esPlural) { this.plural = "es"; } 
        else { this.plural = "s"; }

        // setup HTML (uses indentation to show structure)
        this.building = document.createElement("div");
        this.building.setAttribute("id",`building${this.id}`);
        this.building.setAttribute("class","building");
        // todo 0.7: update on the whole instance name thing, event listeners can fix this super easy
        this.building.setAttribute("onclick",`${this.name}.buy()`); // this is why names must be the instance name
        this.building.setAttribute("onmousemove",`${this.name}.hovered()`); // this is why names must be the instance name
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
                buildingName.innerHTML = `${capitalize(this.name)}`;
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
            this.bought++;
            this.CPSGiven += this.CPSGain;
            helper.reloadCookieCounter();
            document.getElementById(`${this.name}Cost`).innerHTML = helper.commaify(this.upgradeCost);
            document.getElementById(`${this.name}${this.plural}Bought`).innerHTML = this.bought;
            this.hovered();
        }
    }

    hovered() {
        const tooltip = document.getElementById("tooltip");

        document.getElementById("tooltipDesc").style.display = "none";
        document.getElementById("tooltipProduces").style.display = "block";
        document.getElementById("tooltipProducing").style.display = "block";

        const buildingInfoName = this.name.capitalize();
        const buildingInfoPrice = helper.commaify(this.upgradeCost);
        const buildingInfoQuote = this.quote;
        const buildingInfoProduces = helper.commaify(this.CPSGain);
        const buildingInfoProducing = helper.commaify(Math.round(this.CPSGiven * 10) / 10);

        if (!mobile) {
            tooltip.style.top = `${mousePos.y - 50}px`;  
            tooltip.style.right = "346px";
            tooltip.style.left = "auto"; // when tooltip is a statistic it sets the left property because it won't work correctly with right, this resets that

            tooltip.style.borderRightWidth = "0px";

            document.getElementById("tooltipName").innerHTML = buildingInfoName;
            document.getElementById("tooltipPrice").innerHTML = `Price: ${buildingInfoPrice}`;
            document.getElementById("tooltipQuote").innerHTML = `\"${buildingInfoQuote}\"`;
            document.getElementById("tooltipProduces").innerHTML = `Produces: ${buildingInfoProduces} CPS`;
            document.getElementById("tooltipProducing").innerHTML = `Producing: ${buildingInfoProducing} CPS`;
        }
    
        tooltip.style.display = "block";
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
        document.getElementById(`building${this.id}`).remove();
    }
}

// ------------------------------------
// Upgrades
// ------------------------------------
upgrades.create = function(id,statistic=false) { // statistic is for creating it in the statistics page
    let building = Math.floor(id / 5);

    const upgrade = document.createElement("div");
    upgrade.setAttribute("class","upgrade");
    if (statistic) {
        upgrade.setAttribute("id",`upgrade${id}Stats`);
        upgrade.setAttribute("class","upgrade-stats pointer");
        upgrade.setAttribute("onmousemove",`upgrades.hovered(${id},${building},true)`);
        upgrade.setAttribute("onmouseout","hideTooltip()");
    }

    if (!statistic) {
        upgrade.setAttribute("id",`upgrade${id}`);
        upgrade.setAttribute("onclick",`upgrades.clicked(${id},${building})`);
        upgrade.setAttribute("onmousemove",`upgrades.hovered(${id},${building})`);
        upgrade.setAttribute("onmouseout","hideTooltip()");
    }
    
    const icon = this.img[id];
    if (icon === undefined)
        upgrade.style.backgroundImage = getFile("img/unknown-64-64.png");
    else
        upgrade.style.backgroundImage = getFile(`img/upgrades/${icon}`);

    if (!statistic)
        document.getElementById("upgradesHolder").appendChild(upgrade);
    else
        document.getElementById("upgradesBoughtStatsHolder").appendChild(upgrade);
    
    if (!statistic)
        upgrades.currentlyShown++;
}

upgrades.clicked = function(id,building) { // yes it's messy, dont judge me
    if (core.cookies < upgrades.prices[id]) return;

    core.cookies -= upgrades.prices[id];
    upgrades.bought[id] = 1;
    if (!mobile) {
        upgrades.hovered(id,building);
    }
    upgrades.destroy(id);
    upgrades.upgradesBought++;
    upgrades.currentlyShown--;

    switch (building) {
    case 0:
        keyboard.CPSGiven *= 2;
        keyboard.CPSGain *= 2;
        core.cookiesPerClick *= 2;
        break;
    case 1:
        grandpa.CPSGiven *= 2;
        grandpa.CPSGain *= 2;
        break;
    case 2:
        ranch.CPSGiven *= 2;
        ranch.CPSGain *= 2;
        break;
    case 3:
        television.CPSGiven *= 2;
        television.CPSGain *= 2;
        break;
    case 4:
        worker.CPSGiven *= 2;
        worker.CPSGain *= 2;
        break;
    case 5:
        wallet.CPSGiven *= 2;
        wallet.CPSGain *= 2;
        break;
    case 6:
        church.CPSGiven *= 2;
        church.CPSGain *= 2;
        break;
    }
    upgrades.expandUpgradesHolder(); // sometimes the upgrade holder has one too many rows because of weird onmousemove behavior, this prevents that
    
    document.getElementById("upgradesBoughtCounter").innerHTML = `Bought: ${upgrades.upgradesBought}/${upgrades.unlocked.length}`;

    this.updateBoughtStatistic();
}
upgrades.destroy = function(id) {
    document.getElementById(`upgrade${id}`).remove();
    if (!mobile) hideTooltip();
}
upgrades.destroyAll = function(statistic=false) {
    let idToGet;
    for (i = 0; i < upgrades.unlocked.length; i++) {
        idToGet = (!statistic) ? `upgrade${i}` : `upgrade${i}Stats` // this eliminates some unnessesary nesting
        try { // since the element may not exist, this just ignores the error that occurs when it can't find it
            document.getElementById(idToGet).remove();
        } catch {
            continue;
        }
    }
    if (!statistic)
        upgrades.currentlyShown = 0;
}
upgrades.hovered = function(id,building,statistic=false) {
    const tooltip = document.getElementById("tooltip");

    document.getElementById("tooltipProduces").style.display = "none";
    document.getElementById("tooltipProducing").style.display = "none";
    document.getElementById("tooltipDesc").style.display = "block";

    document.getElementById("tooltipName").innerHTML = upgrades.names[id];
    document.getElementById("tooltipPrice").innerHTML = `Price: ${helper.commaify(upgrades.prices[id])}`;
    document.getElementById("tooltipDesc").innerHTML = `${upgrades.descriptions[building]}`;
    document.getElementById("tooltipQuote").innerHTML = `<i>\"${upgrades.quotes[id]}\"</i>`;

    tooltip.style.display = "block";
    if (statistic === true) {
        tooltip.style.left = `${mousePos.x}px`;
        tooltip.style.top = `${mousePos.y - 113}px`; // it's minus 113 because the size of the tooltip is 110 with a 3px border and we don't want the cursor touching the tooltip
        tooltip.style.borderRightWidth = "3px";
    } else {
        tooltip.style.right = "346px";
        tooltip.style.left = "auto"; // when tooltip is a statistic it sets the left property because it won't work correctly with right, this resets that
        tooltip.style.top = `${mousePos.y - 50}px`; 
        tooltip.style.borderRightWidth = "0px";
    }
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
        if (upgrades.unlocked[i] == 1 && upgrades.bought[i] != 1) upgrades.create(i);
    }
}
upgrades.updateBoughtStatistic = function() {
    this.destroyAll(true); // would create duplicates of the same upgrade without this
    for (i = 0; i < upgrades.bought.length; i++) {
        if (upgrades.bought[i] != 1) continue;

        upgrades.create(i,true);
    }
}

upgrades.checkUpgradeAvailability = function() {
    let runThroughTimes = 0; // buildings.building.bought needs for boughtUnlockRequirements indicies
    const boughtUnlockRequirements = [ // number of buildings bought required to unlock an upgrade in chronological order
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
    if (dev.devMode) console.log(str);
}
helper.commaify = function(toComma) {
    let commaifyed = toComma.toLocaleString("en-US");
    return commaifyed;
}
function hideTooltip() {
    document.getElementById("tooltip").style.display = "none";
}
function capitalize(str) {
    if (!str) str = this;

    const capitalized =
        str.charAt(0).toUpperCase()
        + str.slice(1);

    return capitalized;
}
String.prototype.capitalize = capitalize; // this can probably be removed

// Popups
helper.popup = {};
helper.popup.createSimple = function(x,y,text,noButton=false,doWhat="default",title="",backButton=false,isError=false) {
    const popup = document.getElementById("simplePopup");

    popup.style.display = "flex";
    popup.showModal();
    popup.style.width = `${x}px`;
    popup.style.height = `${y}px`;

    document.getElementById("simplePopupContent").innerHTML = text;
    document.getElementById("simplePopupButtonDiv").style.width = `${x}px`;
    
    if (title === "") {
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
        popup.style.borderColor = "red";
    } else {
        popup.style.borderColor = "black";
    }

    if (doWhat !== "default") {
        document.getElementById("simplePopupButton").setAttribute("onclick",`helper.popup.simpleClicked(\"${doWhat}\")`);
    } else {
        document.getElementById("simplePopupButton").setAttribute("onclick","helper.popup.simpleClicked()");
    }
}
helper.popup.destroySimple = function() {
    const popup = document.getElementById("simplePopup");
    popup.style.display = "none";
    popup.close();

    document.getElementById("simplePopupContent").innerHTML = "null";
    document.getElementById("simplePopupButton").style.display = "none";
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
    case "reset cookies":
        core.cookies = 0;
        break;
    default:
        alert(`Simple Popup doWhat is invalid, value is: ${doWhat} \nPlease report this to the GitHub accessable in the bottom left corner`);
        this.destroySimple();
    }
}
helper.popup.createAdvanced = function(x,y,html) { // TODO anytime: reimpliment filter toggling, just in case (defo not high priority)
    const advancedPopup = document.getElementById("advancedPopup");

    advancedPopup.style.display = "flex";
    advancedPopup.showModal();
    advancedPopup.style.width = `${x}px`;
    advancedPopup.style.height = `${y}px`;

    advancedPopup.innerHTML = html;
}
helper.popup.destroyAdvanced = function() {
    document.getElementById("advancedPopup").close();
    document.getElementById("advancedPopup").style.display = "none";
}

// set areas to different things
personalization.setBackground = function(color) {
    personalization.currentBackground = getFile(`img/backgrounds/background-${color}.png`);
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
function toggleMiddle(param) { // TODO 0.6: eliminate unnessesary switch statements and general code, ternary statements might work nice but i'm spitballing here
    const statsMT = document.getElementById("statsMiddleText");
    const infoMT = document.getElementById("infoMiddleText");
    const optionsMT = document.getElementById("optionsMiddleText");
    const middle = document.getElementById("middle");
    statsMT.style.display = "none";
    infoMT.style.display = "none";
    optionsMT.style.display = "none";
    if (param == "stats") {
        switch (statsUp) { // this should be changed
        case false:
            optionsUp = false;
            infoUp = false;
            statsUp = true;
            statsMT.style.display = "block";
            break;
        case true:
            statsUp = false;
            optionsMT.style.display = "none";
            middle.style = personalization.currentBackground;
            break;
        }
    }
    if (param == "info") {
        switch (infoUp) {
        case false:
            statsUp = false;
            optionsUp = false;
            infoUp = true;
            infoMT.style.display = "block";
            break;
        case true:
            infoUp = false;
            infoMT.style.display = "none";
            middle.style.background = personalization.currentBackground;
            break;
        }
    }
    if (param == "options") {
        switch (optionsUp) {
        case false:
            statsUp = false;
            infoUp = false;
            optionsUp = true;
            optionsMT.style.display = "block";
            break;
        case true:
            optionsUp = false;
            optionsMT.style.display = "none";
            middle.style.background = personalization.currentBackground;
            break;
        }
    }
}
function closeMiddle() {
    optionsUp = false;
    infoUp = false;
    statsUp = false;

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
    window.location.href = (versionBranch) ? "/" : "/beta/beta.html";
}

// ------------------------------------
// Saving
// ------------------------------------
saves.exportData = function() {
    saves.save();
    const dataJSON = !versionBranch ? JSON.stringify(localStorage.save) : JSON.stringify(localStorage.betaSave);

    const textToBLOB = new Blob([dataJSON], { type: 'text/plain' });
    const sFileName = 'save.ccsave';

    let newLink = document.createElement("a");
    newLink.download = sFileName;

    if (window.webkitURL != null) {
        newLink.href = window.webkitURL.createObjectURL(textToBLOB);
    } else {
        newLink.href = window.URL.createObjectURL(textToBLOB);
        newLink.style.display = "none";
        document.body.appendChild(newLink);
    }

    newLink.click(); 
}

saves.importData = function() {
    saves.save();
    const file = document.getElementById("importDataInput").files[0];
    const reader = new FileReader();
    let importedData; // because of the scope of reader.onload(), it can't be defined as a constant in that function and still work in reader.onloadend()

    reader.onload = function() {
        importedData = JSON.parse(JSON.parse(reader.result)); // todo: for some reason this has to parse twice, look into this later
    }
    reader.onerror = (e) => alert(`something broke, don't expect me to fix it :D \nerror: ${e}`);

    reader.readAsText(file);
    
    reader.onloadend = () => {
        helper.consoleLogDev("imported data: ");
        helper.consoleLogDev(importedData);

        const versionBranchToDisplay = !versionBranch ? "main" : "beta";
        const saveKeys = Object.keys(importedData);
        saveKeys.forEach((element) => { // checks if save's version matches current version
            if (element == "versionBranch" && importedData[element] != versionBranch) {
                helper.popup.createSimple(300,150,`This is a save file from another version branch (${versionBranchToDisplay}), which is incompatible with this version. Please use a different file.`,false,"default","Alert",false,true);
                return false;
            }
        });

        saves.save(importedData);
        saves.loadSave();
    };
}

saves.loadSave = function() {
    const loadedSave = !versionBranch ? JSON.parse(localStorage.getItem("save")) : JSON.parse(localStorage.getItem("betaSave"));

    grandpa.setVisibility(false);
    ranch.setVisibility(false);
    television.setVisibility(false);
    worker.setVisibility(false);
    wallet.setVisibility(false);
    church.setVisibility(false);

    const saveKeys = Object.keys(loadedSave);
    saveKeys.forEach((variable) => {
        try {
            eval(`${variable} = ${loadedSave[variable]}`); // YES, i know i shouldn't use this. I have no idea how to do this otherwise so yeah probably will stay.

            if (variable === "upgrades.unlocked") { // arrays don't work with eval
                upgrades.unlocked = loadedSave["upgrades.unlocked"];
            }
            if (variable === "upgrades.bought") {
                upgrades.bought = loadedSave["upgrades.bought"];
            }

            if (!inDevelopment) return;
            console.log(`loaded variable: ${variable}`);
            console.log(`loaded value: ${loadedSave[variable]}`);
        } catch {
            helper.consoleLogDev(`Attempted to load variable: ${variable}, value: ${loadedSave[variable]}. This is either a constant variable or a malformed save item.`);
        }
    });

    helper.reloadBuildingPrices();

    upgrades.destroyAll();
    upgrades.showUnlocked();
    document.getElementById("upgradesBoughtCounter").innerHTML = `Bought: ${upgrades.upgradesBought}/${upgrades.unlocked.length}`;
    upgrades.updateBoughtStatistic();

    helper.consoleLogDev(`Loaded save with ${core.cookies} cookies.`);
}

saves.save = function(data=undefined) {
    const save = (data === undefined) ? {} : data; // save will be an empty object if data isn't undefined because it will be filled in the for-loop, if data is defined than save will be that
    
    if (data === undefined) { // todo: don't nest this somehow
        for (let i = 0; i < this.allToSave.length; i++) { // yes if you are wondering i totally 100% without a doubt wrote this code
            const variable = this.allToSave[i];
        
            // Get the name of the variable/property
            const name = typeof variable === 'object' ? variable.name : variable;
        
            // Get the value of the variable/property
            const value = typeof variable === 'object' ? variable.value : eval(variable); // YES, i know i shouldn't use this. This will be changed once 0.6 enters beta. Maybe. Probably not.
        
            // Add the variable/property to the object
            save[name] = value;
        }
    }
    if (!versionBranch) {
        localStorage.setItem("save",JSON.stringify(save));
    } else {
        localStorage.setItem("betaSave",JSON.stringify(save));
    }
    if (inDevelopment) { console.log("save object: "); console.log(save); }

    // Update saving notification
    const indicator = document.getElementById("savingIndicator");
    indicator.classList.add("visible");

    setTimeout(function() {
        indicator.classList.remove("visible");
    }, 1500);
}

saves.resetSave = function() {
    if (!versionBranch) {
        localStorage.setItem("save",JSON.stringify(saves.defaultSavedValues));
    } else {
        localStorage.setItem("betaSave",JSON.stringify(saves.defaultSavedValues));
    }
    saves.loadSave();
    helper.reloadBuildingPrices();
    
    grandpa.unlocked = false;
    ranch.unlocked = false;
    television.unlocked = false;
    worker.unlocked = false;
    wallet.unlocked = false;
    church.unlocked = false;
    document.getElementById("ifCheatedStat").innerHTML = "";
    document.getElementById("ifModdedStat").innerHTML = "";

    upgrades.destroyAll();
    document.getElementById("upgradesBoughtCounter").innerHTML = `Bought: ${upgrades.upgradesBought}/${upgrades.unlocked.length}`;
    upgrades.updateBoughtStatistic();

    // document.getElementById("win").style.display = "none";

    grandpa.setVisibility(false);
    ranch.setVisibility(false);
    television.setVisibility(false);
    worker.setVisibility(false);
    wallet.setVisibility(false);
    church.setVisibility(false);

    if (mobile)
        navbarItemClicked("Cookie");
}

saves.convert05Save = function(isBeta=false, isBetaSaveOld=false) { // ! this is remaining only for the lifespan of 0.6 and will be removed in the next major update or after a certain time gap, that's why this function is a nightmare to understand
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

    saves.save();

    grandpa.unlocked = false;
    ranch.unlocked = false;
    television.unlocked = false;
    worker.unlocked = false;
    wallet.unlocked = false;
    church.unlocked = false;
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
        grandpa.setVisibility(true);
    } else {
        grandpa.setVisibility(false);
    }
    if (oldSave[12] >= 1) {
        ranch.setVisibility(true);
    } else {
        ranch.setVisibility(false);
    }
    if (oldSave[13] >= 1) {
        television.setVisibility(true);
    } else {
        television.setVisibility(false);
    }
    if (oldSave[14] >= 1) {
        worker.setVisibility(true);
    } else {
        worker.setVisibility(false);
    }
    if (oldSave[15] >= 1) {
        wallet.setVisibility(true);
    } else {
        wallet.setVisibility(false);
    }
    if (oldSave[16] >= 1) {
        church.setVisibility(true);
    } else {
        church.setVisibility(false);
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

    mods.numberLoaded++;
    isModded = true;
    document.getElementById("ifModdedStat").innerHTML = "You have activated mods on this playthrough!";
    mods.reloadModsLoadedText();
}
mods.loadFile = function() { // add check if mod is valid
    const file = document.getElementById("addModFile").files[0];
    const reader = new FileReader();

    reader.onerror = (e) => alert(`something broke, don't expect me to fix it :D \nerror: ${e}`);

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

        mods.numberLoaded++;
        isModded = true;
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

    if (numberToList === 0) document.getElementById("noModsMessage").style.display = "block";
    if (numberToList > 0) document.getElementById("removeModsMessage").style.display = "block";
}

mods.addModData = function(id,data) { // yes i basically stole and renamed this entire function from cookie clicker's Game.registerMod orteil did it better okay i might seem smart but i'm really not.
    // READ THE DOCS!
    if (mods.allMods.includes(id)) {
        helper.popup.createAdvanced(400,200,"<h3 class='simple-popup-title' style='display:block;'>Error</h3> \
        <p class='popup-content'>This mod's ID is already present!</p> \
        <button onclick='helper.popup.destroyAdvanced()' id='simplePopupButton' class='popup-button' style='margin-top:20px;'>OK</button>");
        mods.numberLoaded--;
        mods.reloadModsLoadedText();
        return false;
    }
    mods.allMods.push(id);
    document.getElementById("ifModdedStat").innerHTML = "You have activated mods on this playthrough!";
    isModded = true;
    data.initialization();
    console.log(`Loaded mod ${id}`);
}

mods.addClicked = function() {
    helper.popup.createAdvanced(500,350,`<h3 class='simple-popup-title' style='display:block;'>Add Mod</h3>
    <h5 class='popup-content' style='color:red; margin-bottom:3px; margin-top:5px;'>WARNING!</h5>
    <h5 class='popup-content' style='color:red; margin-top:0px; margin-bottom:0px;'>Adding mods without verifying their legitimacy can result in unintended side effects! We are not responsible for any damages that may be caused by mods!</h5>
    <h5 class='popup-content' style='margin-top:5px; margin-bottom:0px;'>For information regarding mods, <a onclick='saves.save()' href='https://github.com/clickercookie/clickercookie.github.io/wiki/Modding' class='blue' target="_blank">read the documentation</a>.</h5>
    <form onsubmit='return false;' id='addModURLForm' style='margin-top:22px;'>
        <label for='addModURL' class='popup-content'>From URL: </label>
        <input id='addModURL' onchange='mods.loadURL(this.value)'>
    </form>
    <form>
        <label for='addModFile' class='popup-content' style='margin-right:0px;'>From File: </label>
        <input type='file' id='addModFile' onchange='mods.loadFile(this.value)' class='popup-content' style='width:86px;'>
    </form>
    <p class='popup-content no-display' id='importedMessage' style='font-size:13px; margin-top:7px; margin-bottom:0px;'>Imported!</p>
    <button onclick='helper.popup.destroyAdvanced()' id='simplePopupButton' class='popup-button' style='margin-top:20px;'>OK</button>`);
}
mods.listClicked = function() {
    helper.popup.createAdvanced(300,350,`<h3 class='simple-popup-title' style='display:block;'>All Mods</h3>
    <p class='popup-content no-display' id='noModsMessage' style='font-size:13px; margin-top:7px; margin-bottom:0px;'>You have no mods installed!</p>
    <div id='modsList' class='mods-list'></div>
    <small class='popup-content no-display' id='removeModsMessage' style='margin-top:3px;'>To remove mods, refresh your page. (make sure to save!)</small>
    <button onclick='helper.popup.destroyAdvanced()' id='simplePopupButton' class='popup-button' style='margin-top:20px;'>OK</button>`);

    mods.list();
}

mods.reloadModsLoadedText = function() {
    document.getElementById("modsNumberLoaded").innerHTML = `You have ${mods.numberLoaded} mods loaded!`;
}

function print() {
    helper.popup.createSimple(250,150,"it's console.log",false,"default","dum dum",false,true);
}

// because of the difference in file locations on the mobile version, this is the new way that files should be accessed in other locations
// so DON'T USE url() when making new HTML!!! Use this!!!
function getFile(location) {
    if (mobile || desktop)
        return `url(../${location})`;
    if (!mobile)
        return `url(${location})`;
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
    newChangelogEntry.appendChild(versionHeader);

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

    changelog.appendChild(newChangelogEntry);
}

//
// Tooltip stuffs
//
const tooltip = {
    html: document.getElementById("tooltip")
};

tooltip.create = function(x,y,content) {
    return "this isn't used yet, but 0.6.1 has plans to upgrade the tooltip system, and this will hopefully have functionality";
}

console.log("you seem smart, how 'bout you contribute to the project? https://github.com/clickercookie/clickercookie.github.io");

// buildings have to be made here instead of init because of scope
const keyboard = new Building("keyboard","type in cookies",15,0.1,0,"keyboard.png");
keyboard.unlocked = true;
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