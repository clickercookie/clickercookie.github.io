// ------------------------------------
// Variable & Object Definitions
// ------------------------------------
const version = "0.6";
const versionBranch = (location.pathname == "/beta/beta" || location.pathname == "/beta/beta.html") ? 1 : 0; // 0 is main, 1 is beta
const inDevelopment = (location.hostname === "localhost" || location.hostname === "127.0.0.1") ? 1 : 0; // automatically toggles if hosted on the local machine
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
    "Pig Slop","Needle bale","Tractors","Big baconator","Ranch dressing", // ranch
    "Streaming service","98-inch screen","Surround sound","OLED Display","8K resolution", // television
    "Medkits","Hard hats","Fast fingers*","Weight training","Robot workers", // worker
    "200 dollar bills","Credit cards","Tax refund","safe","Wizard\'s wallet", // wallet
    "the pope","Cookie study","Cookie ritual","Cookie gods","Cible", // church
];
upgrades.quotes = [
    "press harder","so heavy they're always pressed","that's very heavy","<i><b>efficiency</b></i>","why press when you don't have to?", // keyboard
    "nonna dat softwood junk","newest addition to the porch*","helps with precise chocolate chip placement","what was i doing again?","grandpa's precious*", // grandpa
    "Wait, what have we been feeding them before now?","talk about a hay in a needlestack","eliminating manual labor since 1892","think giant pig mech fueled by potatoes","wrong ranch.", // ranch
    "cookie-flix","unnecessarily large is an understatement.","it's all around me!","s*** it burned in...","so many pixels!", // television
    "Constant supply of Band-Aids in case of emergency","Keep those skulls safe!","upmost efficient cookie manufacturing*","firmly attach chocolate chips via brute force","robotic precision", // worker
    "I'm sure the federal reserve will be okay with this...*","cookies but digitized","for when you overbake to the IRS*","you can keep your cookies even <b>safe</b>r!!","<b>infinite</b> storage space*", // wallet
    "his holiness will provide many cookies","learning about our baking lord's best recipes","summon cookies from the underworld","Worship them, lest their power overwhelm your mortal form.","Get it? <b>c</b>ookie-b<b>ible</b>!<br><br>I'll see myself out.", // church
];
upgrades.descriptions = [`Multiplys Keyboard and clicking ${personalization.currentClicked.toLowerCase()} production by 2`,"Multiplys Grandpa production by 2","Multiplys Ranch production by 2","Multiplys TV production by 2","Multiplys Worker production by 2","Multiplys Wallet production by 2","Multiplys Church production by 2"];
// image notes
// grandpa4 (dementia pills) is extremely bland
// reading glasses look awful
upgrades.img = [
    "reinforced-keys.png","obsidian-keys.png","osmium-keys.png","10-finger-typing.png","macros.png",
    "hardwood-walking-stick.png","rocking-chair.png","reading-glasses.png","dementia-pills.png","shotgun.png",
    "pig-slop.png","needle-bale.png","tractors.png","big-baconator.png","ranch-dressing.png",
    "streaming-service.png","98-inch-screen.png","surround-sound.png","oled-display.png","8k-display.png",
    "medkits.png","hard-hats.png","fast-fingers.png","weight-training.png","robot-workers.png",
    "200-dollar-bill.png","credit-cards.png","tax-refund.png","safe.png","wizards-wallet.png",
    "the-pope.png","cookie-study.png","cookie-ritual.png","cookie-gods.png","cible.png",
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

// changelogs
const versionChangelogs = [
    {
        version: "0.1",
        name: undefined,
        added: [
            "Existence."
        ],
        changed: undefined,
        fixed: undefined,
        release: "March 4th, 2023"
    },
    {
        version: "0.1.1",
        name: undefined,
        added: [
            "Ranches! Buyable for 1000 cookies for the time being.",
            "Minor hover effect when hovering over buildings."
        ],
        changed: undefined,
        fixed: ["totalCookies variable is fixed, but still unused (but not for long!)"],
        release: "March 9th, 2023"
    },
    {
        version: "0.2",
        name: undefined,
        added: [
            "A Github page.",
            "Version number."
        ],
        changed: undefined,
        fixed: undefined,
        release: "March 16th"
    },
    {
        version: "0.2.1",
        name: undefined,
        added: [
            "Television!",
            "Laborers!"
        ],
        changed: ["Made CSS better."],
        fixed: undefined,
        release: "March 16th, 2023"
    },
    {
        version: "0.2.2",
        name: undefined,
        added: [
            "Borders to the left and right sides of the screen.",
            "The capability to create a popup for usage later."
        ],
        changed: undefined,
        fixed: undefined,
        release: "March 16th, 2023"
    },
    {
        version: "0.4",
        name: undefined,
        added: [
            "Final major buildings (Wallet & Church).",
            "Upgrades! Only first level upgrades are currently available, excluding the keyboard which has 2 upgrades.",
            "Ability to switch to the beta branch by clicking the version number. The beta branch has code that visually works as expected, but may not have completed pixel art and some incorrect values that skipped me during testing."
        ],
        changed: ["Layout of the body. This may break things so pleases report any issues that occur!"],
        fixed: ["Everything."],
        release: "March 24th, 2023"
    },
    {
        version: "0.4.1",
        name: undefined,
        added: [
            "Color!",
            "Buttons!",
            "Keyboard Upgrade Chain final pixel art!",
            "+ More!"
        ],
        changed: ["Switched to let instead of var."],
        fixed: [
            "Incorrect All Time Cookies & Cookie Clicked variable calculations.",
            "Positioning on some incorrect positions."
        ],
        release: "March 24th, 2023"
    },
    {
        version: "0.5",
        name: undefined,
        added: [
            "AUTO SAVING!!!",
            "EXPORTING & IMPORTING DATA!!!",
            "New temporary cookie!",
            "Hovering over buildings gives a small infobox!",
            "More backgrounds!",
            "A familiar face...",
            "Cursor changes type when hovering over certain elements.",
            "Special development buttons for when in active development.",
            "+ More!"
        ],
        changed: [
            "Prices are now seperated from the building name.",
            "Can now switch between middle button text by pressing another button opposed to pressing the active button and then button you want.",
            "Version number now says if the game is in beta or not.",
            "Extended popup functionality.",
            "Upgrade hovering is more efficient."
        ],
        fixed: [
            "Double-tapping cookie zooming in on mobile devices.",
            "These list items being highlightable."
        ],
        release: "May 6th, 2023"
    },
    {
        version: "0.5.1",
        name: "Objects Everywhere",
        added: [
            "Cookie Wobble!",
            "Can create an advanced popup with pure HTML, contrary to the old way where everything was predetermined.",
            "Credits button under Info."
        ],
        changed: [
            "All variables and functions now are apart of an object.",
            "Cleaned up Javascript in general.",
            "Most numbers now have commas.",
            "All versions from now on have a name and their version number assigned in changelogs.",
            "Removed unused/unnessesary functions.",
            "camelCase onclick attributes (onClick) have all been switched to lowercase (onclick).",
            "Renamed some save-related variables to make more sense.",
            "Initialization is now inside an object method and called at the bottom of main.js."
        ],
        fixed: [
            "Hover infobox not updating when the mouse doesn't move.",
            "Grandma showing in simple popups when she isn't supposed to be.",
            "0.5 header having no date.",
            "upgrade#Identifier is no longer used and has been deleted.",
            "Options middle text was highlightable.",
            "Middle text subtitles weren't lined up with other text.",
            "Cookie was clickable in a box shape outside the actual visible cookie."
        ],
        release: "May 24th, 2023"
    },
    {
        version: "0.5.2",
        name: "hold the phone",
        added: [
            "Mobile Support!",
            "Mods!",
            "Little X button in the middle area."
        ],
        changed: [
            "Cleaned up CSS.",
            "Saves from the main branch no longer are allowed in beta and vice versa to prevent corrupted saves.",
            "Popups are now a flexbox.",
            "Small gradient on middle text to make it slightly more nice to look at then solid black.",
            "Better middle button function."
        ],
        fixed: ["Options middle text said \"Autosave Management\" when it was supposed to save \"Save Management\"."],
        release: "June 23rd, 2023"
    },
    {
        version: "0.5.2.1",
        name: "the first of many",
        added: [
            "It's our 1st birthday! With this, we now have the Clicker Cookie Anniversary event, which currently only activates the new Currently Clicked food, the Cake.",
            "Note: Although 0.1 came out on March 4th, initial public development began on the 3rd, which is why we celebrate today!"
        ],
        changed: undefined,
        fixed: undefined,
        release: "March 3rd, 2024"
    },
    {
        version: "0.6",
        name: "actual upgrades",
        added: [
            "The long awaited 5 upgrades for every single building.",
            "A list of bought upgrades in the Statistics menu, hovering over them will show info related to the upgrade.",
            "A gray \"dark noise\" has been added to middle text menus so that blacks will more easily stick out.",
            "Temporary notification in the bottom-left corner when the game saves."
        ],
        changed: [
            "Upgrades to building and upgrade pixel art. For any artists willing to contribute, .ase files can be found in the /img/ase folder on the GitHub.",
            "All buildings are now apart of a class so mod developers can have an easier time creating them.",
            "The saving system. Yes, 3rd time or something, but this time I GURANTEE it's going to stick. Probably not. It won't.",
            "Grandma has been removed due to addition of upgrades and needing to rebalance when the player \"wins\". Also because i'm scared of copyright issues :)",
            "All changelog entries are now created with Javascript to cut down on the HTML size.",
            "A year has been added to every release date in the changelogs.",
            "Upgrade viewer and building info are now combined into one tooltip and sizes have been adjusted.",
            "Popups now use the dialog element, which has an unintended side effect of making their contents look sharper (yay!)",
            "Using the Github button now opens a new tab.",
            "Renamed perMillisecondUniversal() to gameLoop()",
            "All boolean variables that used numbers (1 and 0) now use actual booleans (true and false).",
            "Most logic-based variable assignments now use ternary operators.",
            "All remaining ancient plus sign string concatenation now use template literals.",
            "The ancient unknown-64-64.png file used for when an upgrade's image cannot be found has had a visual upgrade and has been renamed to unknown-32-32.png since all upgrades are now drawn as 32x32 images.",
            "Changing the document title now uses document.title instead of assigning an ID to the title element.",
            "no-select is now done in a more effective way."
        ],
        fixed: [
            "Upgrade pixel art images were extremely blurry. Buildings still have this blur, but actually make the image look better, so it will stay for the time being.",
            "Centering of buildings bought was done stupidly, fixed now.",
            "The X button in the middle area was pushing the titles to the left and making it so they weren't centered.",
            "Advanced popups had no filter.",
            "Previously created changelog entries are now grammatically correct.",
            "Accessing the beta version by going to clickercookie.github.io/beta would result in a 404."
        ],
        release: "???"
    }
];

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
        console.warn("Cookies were NaN and save was reset.");
    }

    if (localStorage.cookies >= 0)
        helper.popup.createSimple(400,200,"You are using an extremely outdated saving method. You will have issues with saving now that the new one is implimented. Clicking below will reset your save to the new format. Your old save cannot be restored.",false,"localStorage.clear()","Warning",false,false);

    helper.reloadBuildingPrices();
    if (localStorage.getItem("save") == null && versionBranch === 0) {
        localStorage.setItem("save",JSON.stringify(saves.defaultSavedValues));
        console.warn("save was null and was automatically reset, if this is your first time playing this is an intended behavior.");
    }
    if (localStorage.getItem("betaSave") == null && versionBranch === 1) {
        localStorage.setItem("betaSave",JSON.stringify(saves.defaultSavedValues));
        console.warn("betaSave was null and was automatically reset, if this is your first time playing this is an intended behavior.");
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
    }
    // else if (localStorage.save[0] == "[") {
    // TODO 0.6: MUST ADD save SUPPORT HERE BEFORE RELEASE!!!
    // }

    if (localStorage.getItem("betaSaveOld") != null) { // TODO 0.6: remove this check for full release
        helper.popup.createAdvanced(400,220,`<h3 class='simple-popup-title' style='display:block;'>oh no</h3> 
        <p class='popup-content'>so i kinda lied when i said your save is invalid, i can get it back if you want</p> 
        <div style='display:flex;flex-direction:row;height:40px;'> 
        <button onclick='localStorage.removeItem("betaSaveOld")'>i don't want it</button>
        <button onclick='saves.convert05Save(true,true); localStorage.removeItem("betaSaveOld")' id='simplePopupButton' class='popup-button' style='margin-top:20px;width:auto;margin-right:3px'>gimme it back</button> 
        </div>`);
    }
    
    if (hasCheated)
        document.getElementById("ifCheatedStat").innerText = "You have cheated on this playthrough!";

    upgrades.updateBoughtStatistic();

    // change version branch specific stuff
    // change title
    document.title = (versionBranch) ? "Clicker Cookie Beta" : "Clicker Cookie";
    // change version displayed
    document.getElementById("versionNumber").innerText = (versionBranch) ? `Version: ${version} Beta` : `Version: ${version}`;
    document.getElementById("versionSwitchInfoText").innerText = (versionBranch) ? "Clicking this will switch to the beta branch" : "Clicking this will switch to the main branch";
    if (versionBranch) // show the developer mode switch
        document.getElementById("devForm").style.display = "block";
    
    if (inDevelopment)
        document.title = "Clicker Cookie Dev";

    // Changelog Entries, AKA NOT the messiest place ever.
    // this loop goes from big to small because the function needs to be ran from the latest version to the oldest
    for (let entry = versionChangelogs.length - 1; entry >= 0; entry--) {
        createChangelogEntry(versionChangelogs[entry]);
    }

    // detect if the user is on mobile, and if they are re-direct to the mobile version
    checkMobile();
    if (mobile) {
        personalization.currentBackground = "url(../img/backgrounds/background-blue.png)"; // todo: getFile?
        if (location.pathname == "/" || location.pathname == "/beta/beta" || location.pathname == "/beta/beta.html") {
            location.href = (versionBranch) ? "../mobile/mobile.html" : "mobile/mobile.html"; // todo: make this prettier
        }
    }
    
    // this would go after data is loaded, but it requires the mobile variable to be assigned a value
    if (isModded && !mobile) {
        document.getElementById("ifModdedStat").innerHTML = "You have activated mods on this playthrough!";
    }

    // check for development special stuff
    //* needs to be below mobile version check because this statement cannot run if we're on mobile
    if (inDevelopment && !mobile) {
        // quick buttons
        const devDiv = document.createElement("div");
        devDiv.setAttribute("style","padding-left: 3px;");
        
        const devWarning = document.createElement("h4");
        devWarning.appendChild(document.createTextNode("localhost detected, options below"));
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
        toggleSaving.setAttribute("onclick","dev.toggleSaving()");
        toggleSaving.setAttribute("style","margin-bottom:0px;");
        devDiv.appendChild(toggleSaving);
        const currentSavingStatus = document.createElement("p");
        currentSavingStatus.appendChild(document.createTextNode("saving: true"));
        currentSavingStatus.setAttribute("id","currentSavingStatus");
        currentSavingStatus.setAttribute("style","margin-bottom:0px;");
        devDiv.appendChild(currentSavingStatus);

        document.getElementById("leftSide").insertBefore(devDiv, document.getElementById("leftSidePush"));

        dev.setDevMode(true);
        document.getElementById("offSelectionDev").innerHTML = "Overwritten";
    }

    // Holiday Events
    const date = new Date();
    // anniversary
    if (date.getMonth() === 2 && date.getDate() === 3) { // if date is 3/3
        personalization.setCurrentClicked("cake");
        helper.popup.createSimple(350,175,"It's Clicker Cookie's birthday! \nThe cookie has been replaced with a birthday cake, but you can change it back in Options.",false,"default","woo hoo!");
    }
}

// Events
let mousePos = {x: undefined, y: undefined};
window.addEventListener("mousemove", (event) => {
    mousePos = {
        x: event.clientX,
        y: event.clientY 
    };
    if (inDevelopment && !mobile)
        document.getElementById("mousePosDevText").innerText = `Mouse Pos: (${mousePos.x}, ${mousePos.y})`;
});
function resizeEventHandler() { // ? is the term "event handler" right?
    // change middle text heights
    const middleTexts = convertCollectionToArray(document.querySelectorAll(".middle-main"));
    for (let element in middleTexts) {
        middleTexts[element].style.height = window.innerHeight-document.getElementById("middleButtons").offsetHeight+"px";
    }
}
resizeEventHandler(); // since we do need certain elements like the middle text to have the correct size without having to resize the window, we call this now
window.addEventListener("resize",resizeEventHandler);

// timer things
setInterval(cookiesPerSecondUpdate, 1000);
setInterval(gameLoop, 1);
setInterval(() => { // auto-saving
    if (!savingAllowed) return false;

    saves.save();
}, 60 * 1000); // 60s

function gameLoop() {
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

    core.cookiesPerSecond = keyboard.CPSGiven+grandpa.CPSGiven+ranch.CPSGiven+television.CPSGiven+worker.CPSGiven+wallet.CPSGiven+church.CPSGiven+dev.CPSGiven;
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

    savingAllowed = !savingAllowed;

    if (!inDevelopment) return;
    document.getElementById("currentSavingStatus").innerHTML = `saving: ${savingAllowed}`;
}

// ------------------------------------
// Buildings
// ------------------------------------
class Building {
    static UPGRADECOST_MULTIPLIER = 1.15;
    constructor(name,quote,upgradeCost,CPSGain,iconImg="unknown.png",esPlural=false) {
        this.name = name; // ! SHOULD BE SAME AS OBJECT INSTANCE NAME, will be changed in 0.7!!!
        this.quote = quote;
        this.upgradeCost = upgradeCost;
        this.CPSGiven = 0;
        this.CPSGain = CPSGain;

        this.bought = 0;
        this.unlocked = false;
        if (esPlural) this.plural = "es";
        else this.plural = "s";

        // setup HTML (uses indentation to show structure)
        this.html = document.createElement("div");
        this.html.setAttribute("class","building");
        // todo 0.7: update on the whole instance name thing, event listeners can fix this super easy
        this.html.setAttribute("onclick",`${this.name}.buy()`); // this is why names must be the instance name
        this.html.setAttribute("onmousemove",`${this.name}.hovered()`); // for some reason, the element needs onmousemove AND onmouseover so it doesn't flicker, see #24
        this.html.setAttribute("onmouseover",`${this.name}.hovered()`); // ^
        this.html.setAttribute("onmouseout","hideTooltip()");
            const icon = document.createElement("img");
            icon.setAttribute("class","building-icon");
            icon.setAttribute("src",getFile(`img/${iconImg}`));
            icon.setAttribute("alt",`${this.name} icon`);
            this.html.appendChild(icon);

            const buildingContent = document.createElement("div");
            buildingContent.setAttribute("class","building-content");
                const namePriceDiv = document.createElement("div");
                    const buildingName = document.createElement("p");
                    buildingName.setAttribute("class","building-name");
                    buildingName.innerHTML = `${capitalize(this.name)}`;
                    namePriceDiv.appendChild(buildingName);

                    const buildingPrice = document.createElement("p");
                    buildingPrice.setAttribute("class","building-price");
                    buildingPrice.setAttribute("id",`${this.name}Cost`);
                    buildingPrice.innerHTML = this.upgradeCost;
                    namePriceDiv.appendChild(buildingPrice);
                buildingContent.appendChild(namePriceDiv);

                const buildingsBoughtWrapper = document.createElement("div");
                buildingsBoughtWrapper.setAttribute("class","buildings-bought-wrapper");
                    const buildingsBought = document.createElement("p");
                    buildingsBought.setAttribute("class","buildings-bought");
                    buildingsBought.setAttribute("id",`${this.name}${this.plural}Bought`);
                    buildingsBought.innerHTML = "0";
                    buildingsBoughtWrapper.appendChild(buildingsBought);
                buildingContent.appendChild(buildingsBoughtWrapper);
            this.html.appendChild(buildingContent);

        document.getElementById("buildingsWrapper").appendChild(this.html);
        // end setup HTML
    }

    buy() {
        if (core.cookies >= this.upgradeCost) {
            core.cookies -= this.upgradeCost;
            this.upgradeCost *= Building.UPGRADECOST_MULTIPLIER;
            this.upgradeCost = Math.floor(this.upgradeCost);
            this.bought++;
            this.CPSGiven += this.CPSGain;
            helper.reloadCookieCounter();
            document.getElementById(`${this.name}Cost`).innerHTML = helper.commaify(this.upgradeCost);
            document.getElementById(`${this.name}${this.plural}Bought`).innerHTML = this.bought;
            this.hovered();
            this.reloadPrice();
        }
    }

    hovered() {
        const tooltip = document.getElementById("tooltip");

        document.getElementById("tooltipDesc").style.display = "none";
        document.getElementById("tooltipProduces").style.display = "block";
        document.getElementById("tooltipProducing").style.display = "block";

        const buildingInfoName = capitalize(this.name);
        const buildingInfoPrice = helper.commaify(this.upgradeCost);
        const buildingInfoQuote = this.quote;
        const buildingInfoProduces = helper.commaify(this.CPSGain);
        const buildingInfoProducing = helper.commaify(Math.round(this.CPSGiven * 10) / 10);

        if (!mobile) {
            // clamping allows between 0 and the height of the window minus the height of the box. also add one from the height of the box because it doesn't work correctly normally, idk why
            tooltip.style.top = clamp(mousePos.y - tooltip.offsetHeight/2,0,window.innerHeight-(tooltip.offsetHeight + 1))+"px";
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
        this.html.style.display = bool ? "block" : "none";
    }

    reloadPrice() {
        document.getElementById(`${this.name}Cost`).innerHTML = helper.commaify(this.upgradeCost);
    }

    destroy() {
        this.html.remove();
    }
}

// ------------------------------------
// Upgrades
// ------------------------------------
upgrades.create = function(id,statistic=false) { // statistic is for creating it in the statistics page
    let building = Math.floor(id / 5);

    const icon = this.img[id]; //? does this need to exist?
    const UPGRADE_ICON_PATH = (icon === undefined || icon === null) ? getFile("img/unknown-32-32.png") : getFile(`img/upgrades/${icon}`);
    if (icon === undefined || icon === null) { // todo 0.7: add check if a 404 is returned for the upgrade icon, might require async/await shenanigans but whatevs
        console.warn(`An image file for upgrade with ID: ${id} was not defined. Falling back to "unknown" image.`);
    }

    const upgrade = document.createElement("div");
    upgrade.setAttribute("class","upgrade");
    if (statistic && !mobile) {
        upgrade.setAttribute("id",`upgrade${id}Stats`);
        upgrade.setAttribute("class","upgrade-stats pointer");
        upgrade.setAttribute("onmouseover",`upgrades.hovered(${id},${building},true)`); // for some reason, the element needs onmousemove AND onmouseover so it doesn't flicker, see #24
        upgrade.setAttribute("onmousemove",`upgrades.hovered(${id},${building},true)`); // ^
        upgrade.setAttribute("onmouseout","hideTooltip()");
        upgrade.style.backgroundImage = `url(${UPGRADE_ICON_PATH})`;
    } else if (!statistic && !mobile) {
        upgrade.setAttribute("id",`upgrade${id}`);
        upgrade.setAttribute("onclick",`upgrades.clicked(${id},${building})`);
        upgrade.setAttribute("onmouseover",`upgrades.hovered(${id},${building})`);  // for some reason, the element needs onmousemove AND onmouseover so it doesn't flicker, see #24
        upgrade.setAttribute("onmousemove",`upgrades.hovered(${id},${building})`);
        upgrade.setAttribute("onmouseout","hideTooltip()");
        upgrade.style.backgroundImage = `url(${UPGRADE_ICON_PATH})`;
    }

    // setup stuff for the mobile version
    if (statistic && mobile) {
        upgrade.setAttribute("id",`upgrade${id}Stats`);
        upgrade.setAttribute("class","upgrade-stats");
        console.warn("Statistics are not yet implimented.");
    } else if (!statistic && mobile) {
        upgrade.setAttribute("id",`upgrade${id}`);
        upgrade.addEventListener("click", () => {
            upgrades.clicked(id,building);
        });

        // todo 0.7: this is why we need a class for upgrades :rolling_eyes:
        // we can make an UpgradeMobile class that inherits from Upgrade or something like that
        const upgradeIcon = document.createElement("img");
        upgradeIcon.setAttribute("class","upgrade-icon");
        upgradeIcon.src = UPGRADE_ICON_PATH;
        upgradeIcon.alt = "upgrade"+id;
        upgradeIcon.width = "64"; //? when i use 64px, it sets these to 0 instead of 64px. why?
        upgradeIcon.height = "64";
        upgrade.appendChild(upgradeIcon);

        const upgradeContent = document.createElement("div");
        upgradeContent.setAttribute("class","upgrade-content");
            const namePriceDiv = document.createElement("div");
                const upgradeName = document.createElement("p");
                upgradeName.setAttribute("class","upgrade-name");
                upgradeName.innerText = upgrades.names[id];
                namePriceDiv.appendChild(upgradeName);

                const upgradePrice = document.createElement("p");
                upgradePrice.setAttribute("class","upgrade-price");
                upgradePrice.innerText = helper.commaify(upgrades.prices[id]);
                namePriceDiv.appendChild(upgradePrice);
            upgradeContent.appendChild(namePriceDiv);

            const infoWrapper = document.createElement("div");
            infoWrapper.setAttribute("class","buildings-bought-wrapper");
                const upgradeInfo = document.createElement("div");
                upgradeInfo.setAttribute("class","upgrade-info");
                    const upgradeInfoText = document.createElement("p");
                    upgradeInfoText.setAttribute("class","upgrade-info-text");
                    upgradeInfoText.innerText = "Info";
                    upgradeInfo.appendChild(upgradeInfoText);
                infoWrapper.appendChild(upgradeInfo);
            upgradeContent.appendChild(infoWrapper);
        upgrade.appendChild(upgradeContent);
    }
    
    if (!statistic)
        document.getElementById("upgradesHolder").appendChild(upgrade);
    else
        document.getElementById("upgradesBoughtStatsHolder").appendChild(upgrade);
    
    if (!statistic)
        upgrades.currentlyShown++;
}

upgrades.clicked = function(id,building) {
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
    upgrades.expandUpgradesHolder(); // sometimes the upgrade holder has one too many rows because of weird onmouseover & onmousemove behavior, this prevents that
    
    document.getElementById("upgradesBoughtCounter").innerHTML = `Bought: ${upgrades.upgradesBought}/${upgrades.unlocked.length}`;

    this.updateBoughtStatistic();
}
upgrades.destroy = function(id) {
    document.getElementById(`upgrade${id}`).remove();
    if (!mobile) hideTooltip();
}
upgrades.destroyAll = function(statistic=false) {
    const upgradesHolderChildren = (statistic) ? convertCollectionToArray(document.getElementById("upgradesBoughtStatsHolder").children) : convertCollectionToArray(document.getElementById("upgradesHolder").children);
    for (let i = 0; i < upgradesHolderChildren.length; i++) {
        upgradesHolderChildren[i].remove();
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
    document.getElementById("tooltipDesc").innerHTML = upgrades.descriptions[building];
    document.getElementById("tooltipQuote").innerHTML = `<i>\"${upgrades.quotes[id]}\"</i>`;

    tooltip.style.display = "block";
    if (statistic === true) { // todo: make the tooltip clamp here
        tooltip.style.left = `${mousePos.x}px`;
        tooltip.style.top = `${mousePos.y - tooltip.offsetHeight}px`;  // it's minus offsetHeight because we don't want the cursor touching the tooltip
        tooltip.style.borderRightWidth = "3px";
    } else {
        tooltip.style.right = "346px";
        // clamping allows between 0 and the height of the window minus the height of the box. also add one from the height of the box because it doesn't work correctly normally, idk why
        tooltip.style.top = clamp(mousePos.y - tooltip.offsetHeight/2,0,window.innerHeight-(tooltip.offsetHeight + 1))+"px";
        tooltip.style.left = "auto"; // when tooltip is a statistic it sets the left property because it won't work correctly with right, this resets that
        tooltip.style.borderRightWidth = "0px";
    }
}

upgrades.expandUpgradesHolder = function(retract=false) {
    const rowsOfUpgrades = Math.ceil(upgrades.currentlyShown / 5);

    const holder = document.getElementById("upgradesHolder");
    const holderHeight = 67.6; // this is the height of the upgrade holder set in style.css, i would figure out how to get the height directly from the element but the height is constantly changing when it's hovered so it's more trouble then it's worth
    if (retract) {
        holder.style.height = holderHeight+"px";
        return;
    }
    const size = (rowsOfUpgrades === 0) ? holderHeight : holderHeight * rowsOfUpgrades;
    holder.style.height = `${size}px`;
}

upgrades.showUnlocked = function() {
    for (let i = 0; i < upgrades.unlocked.length; i++) {
        if (upgrades.unlocked[i] == 1 && upgrades.bought[i] != 1) upgrades.create(i);
    }
}
upgrades.updateBoughtStatistic = function() {
    this.destroyAll(true); // would create duplicates of the same upgrade without this
    for (let i = 0; i < upgrades.bought.length; i++) {
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
    for (let i = 0; i <= 5; i++) {
        if (keyboard.bought >= boughtUnlockRequirements[runThroughTimes] && upgrades.unlocked[i] == 0) {
            upgrades.unlocked[i] = 1;
            upgrades.create(i);
        }
        runThroughTimes++;
    }
    // Grandpas
    runThroughTimes = 0;
    for (let i = 5; i <= 9; i++) {
        if (grandpa.bought >= boughtUnlockRequirements[runThroughTimes] && upgrades.unlocked[i] == 0) {
            upgrades.unlocked[i] = 1;
            upgrades.create(i);
        }
        runThroughTimes++;
    }
    // Ranches
    runThroughTimes = 0;
    for (let i = 10; i <= 14; i++) {
        if (ranch.bought >= boughtUnlockRequirements[runThroughTimes] && upgrades.unlocked[i] == 0) {
            upgrades.unlocked[i] = 1;
            upgrades.create(i);
        }
        runThroughTimes++;
    }
    // TVs
    runThroughTimes = 0;
    for (let i = 15; i <= 19; i++) {
        if (television.bought >= boughtUnlockRequirements[runThroughTimes] && upgrades.unlocked[i] == 0) {
            upgrades.unlocked[i] = 1;
            upgrades.create(i);
        }
        runThroughTimes++;
    }
    // Workers
    runThroughTimes = 0;
    for (let i = 20; i <= 24; i++) {
        if (worker.bought >= boughtUnlockRequirements[runThroughTimes] && upgrades.unlocked[i] == 0) {
            upgrades.unlocked[i] = 1;
            upgrades.create(i);
        }
        runThroughTimes++;
    }
    // Wallets
    runThroughTimes = 0;
    for (let i = 25; i <= 29; i++) {
        if (wallet.bought >= boughtUnlockRequirements[runThroughTimes] && upgrades.unlocked[i] == 0) {
            upgrades.unlocked[i] = 1;
            upgrades.create(i);
        }
        runThroughTimes++;
    }
    // Churches
    runThroughTimes = 0;
    for (let i = 30; i <= 34; i++) {
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
// todo 0.7: my gut says we can do this without running this in the game loop
helper.reloadBuildingPrices = function() { // doesn't account for modded buildings, figuring that out is the mod developer's job :)
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
function checkMobile() {
    if (navigator.userAgent.match(/Android/i) // stolen from https://www.tutorialspoint.com/How-to-detect-a-mobile-device-with-JavaScript (doesn't always work)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)) {
        mobile = true;
        return true;
    } else {
        mobile = false;
        return false;
    }
}
function capitalize(str) {
    if (!str) str = this;

    const capitalized =
        str.charAt(0).toUpperCase()
        + str.slice(1);

    return capitalized;
}
// because of the difference in file locations on the mobile version, this is the new way that files should be accessed in other locations
//* so DON'T USE STATIC FILE PATHS when making new HTML!!! Use this!!!
function getFile(location) {
    checkMobile(); // we run checkMobile() here because in Building getFile() is used, but buildings are created before core.init(), where checkMobile() is normally run. As a bandaid, we just run it here, as well.
    if (mobile || desktop)
        return `../beta/${location}`; //TODO 0.6: MUST REMOVE THE BETA BEFORE RELEASE!!!
    if (!mobile)
        return location;
}
function convertCollectionToArray(HTMLCollection) {
    const array = [];
    for (let i = 0; i < HTMLCollection.length; i++) {
        array.push(HTMLCollection[i]);
    }
    return array;
}
function clamp(value, minimum, maximum) {
    if (value < minimum)
        value = minimum;
    else if (value > maximum)
        value = maximum;
    return value;
}

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
    personalization.currentBackground = `url(${getFile(`img/backgrounds/background-${color}.png`)})`;
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
    const cookie = document.getElementById("cookie");
    try {
        document.getElementById("cookie").src = getFile(`img/${value}.png`);
    } catch {
        console.warn(`Couldn't find image file for cookie. Tried to assign image file: ${value}.png`);
    }
    personalization.currentClicked = capitalize(value);
    // since some words have a plural "es" at the end of their name and I don't want to make a function to detect that, this
    // function will still have a switch in it for each value, but at a later time this should be changed.
    cookie.style.borderRadius = "128px";
    cookie.style.imageRendering = "auto"; // cake is 64x64 so it needs to not be blurry, this resets that
    switch (value) {
    case "cookie":
        personalization.currentClickedPlural = "Cookies";
        break;
    case "potato":
        personalization.currentClickedPlural = "Potatoes";
        break;
    case "strawberry":
        personalization.currentClickedPlural = "Strawberries";
        break;
    case "cake":
        personalization.currentClickedPlural = "Cakes";
        cookie.style.borderRadius = "0px";
        cookie.style.imageRendering = "pixelated";
        document.getElementById("currentClickedSelect").value = "cake"; // ? why is this here (3/3 event?)
        break;
    default:
        personalization.currentClickedPlural = `${value}s`;
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
    if (!undo)
        document.getElementById("versionSwitchInfo").style.display = "block";
    else
        document.getElementById("versionSwitchInfo").style.display = "none";
}
function versionSwitch() {
    window.location.href = (versionBranch) ? "/" : "/beta/beta.html";
}

// ------------------------------------
// Saving
// ------------------------------------
// ! Hey!
// ! Do not make updates to this code! It will be changing in a later version! Don't waste your time!
// ! See this issue: https://github.com/clickercookie/clickercookie.github.io/issues/18
saves.exportData = function() {
    saves.save();
    const dataJSON = !versionBranch ? JSON.stringify(localStorage.save) : JSON.stringify(localStorage.betaSave);

    const textToBLOB = new Blob([dataJSON], { type: "text/plain" });

    let newLink = document.createElement("a");
    newLink.download = "save.ccsave";

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

            helper.consoleLogDev(`loaded variable: ${variable}, value: ${loadedSave[variable]}`);
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
            const name = typeof variable === "object" ? variable.name : variable;
        
            // Get the value of the variable/property
            const value = typeof variable === "object" ? variable.value : eval(variable); // YES, i know i shouldn't use this. This will be changed once 0.6 enters beta. Maybe. Probably not.
        
            // Add the variable/property to the object
            save[name] = value;
        }
    }
    if (!versionBranch)
        localStorage.setItem("save",JSON.stringify(save));
    else
        localStorage.setItem("betaSave",JSON.stringify(save));
    if (inDevelopment) console.log("save object: ", save);

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
    television.CPSGiven = oldSave[6];
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
    const httpCheck = url.slice(0,4);
    if (httpCheck !== "http") { // we want it to be a url, and this works decently well for detecting it, even if it's not foolproof
        helper.popup.createSimple(350,175,"This mod's URL is not valid. Please make sure to include \"http://\" or \"https://\" in the URL, if it was not present already.",false,"default","Error",false,true);
        return false;
    } 

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

    for (let i = 0; i < numberToList; i++) {
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
        <input type='file' id='addModFile' accept='.js' onchange='mods.loadFile(this.value)' class='popup-content' style='width:86px;'>
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

// Changelog Entries
function createChangelogEntry(logs) { // todo 0.7: try to make this look nicer, but lets be honest it's gonna stay this way
    const changelog = document.querySelector(".changelog-wrapper");

    const newChangelogEntry = document.createElement("div");
    newChangelogEntry.setAttribute("class","changelog");

    const versionHeader = document.createElement("h2");
    versionHeader.setAttribute("class","changelog-version-heading");
    if (logs.name === undefined)
        versionHeader.appendChild(document.createTextNode(`Version ${logs.version} - ${logs.release}`));
    else
        versionHeader.appendChild(document.createTextNode(`Version ${logs.version}: ${logs.name} - ${logs.release}`));
    newChangelogEntry.appendChild(versionHeader);

    if (logs.added !== undefined) {
        const addedHeader = document.createElement("h3");
        addedHeader.setAttribute("class","middle-text");
        addedHeader.setAttribute("style","font-size: 16px;"); // todo: make this a part of a css class maybe probably not
        addedHeader.innerText = "Added:";
        // addedHeader.appendChild(document.createTextNode("Added:"));
        newChangelogEntry.appendChild(addedHeader);

        const addedList = document.createElement("ul");
        addedList.setAttribute("class","middle-ul");
        newChangelogEntry.appendChild(addedList);

        for (let i = 0; i < logs.added.length; i++) {
            const addedListItem = document.createElement("li");
            addedListItem.innerText = logs.added[i];
            addedList.appendChild(addedListItem);
        }
    }
    if (logs.changed !== undefined) {
        const changedHeader = document.createElement("h3");
        changedHeader.setAttribute("class","middle-text");
        changedHeader.setAttribute("style","font-size: 16px;");
        changedHeader.innerText = "Changed:";
        newChangelogEntry.appendChild(changedHeader);

        const changedList = document.createElement("ul");
        changedList.setAttribute("class","middle-ul");
        newChangelogEntry.appendChild(changedList);

        for (let i = 0; i < logs.changed.length; i++) {
            const changedListItem = document.createElement("li");
            changedListItem.innerText = logs.changed[i];
            changedList.appendChild(changedListItem);
        }
    }
    if (logs.fixed !== undefined) {
        const fixedHeader = document.createElement("h3");
        fixedHeader.setAttribute("class","middle-text");
        fixedHeader.setAttribute("style","font-size: 16px;");
        fixedHeader.innerText = "Fixed:";
        newChangelogEntry.appendChild(fixedHeader);

        const fixedList = document.createElement("ul");
        fixedList.setAttribute("class","middle-ul");
        newChangelogEntry.appendChild(fixedList);

        for (let i = 0; i < logs.fixed.length; i++) {
            const fixedListItem = document.createElement("li");
            fixedListItem.innerText = logs.fixed[i];
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
const keyboard = new Building("keyboard","type in cookies",15,0.1,"keyboard.png");
keyboard.unlocked = true;
const grandpa = new Building("grandpa","as long as gramps gets a cut",100,1,"grandpa.png");
grandpa.setVisibility(false);
const ranch = new Building("ranch","not the dressing kind",1100,8,"ranch.png",true);
ranch.setVisibility(false);
const television = new Building("television","hold infomercials on your cookies",12000,47,"tv.png");
television.setVisibility(false);
const worker = new Building("worker","cookies via manual labor",130000,260,"worker.png");
worker.setVisibility(false);
const wallet = new Building("wallet","more storage space for your vast amount of cookie income",1400000,1440,"wallet.png");
wallet.setVisibility(false);
const church = new Building("church","pray to the almighty cookie gods",20000000,7800,"church.png",true);
church.setVisibility(false);

core.initialization();