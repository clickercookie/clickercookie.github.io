// hello, welcome to my dumpster fire
// it works but it's really terrible because it's changing like ASAP

import { Game } from "./main.js";
import { destroyAllUpgrades, Upgrade, updateUpgradesBoughtStatistic, showUnlockedUpgrades } from "./upgrades.js";

export const saves = {} as {
    importedData: any,
    allToSave: any[]
    defaultSavedValues: Record<string, any>,

    exportData(game: Game): void,
    importData(game: Game): void,
    loadSave(game: Game): void,
    save(game: Game, data?: object): void,
    resetSave(game: Game): void,
    convert05Save(game: Game, isBeta?: boolean, isBetaSaveOld?: boolean): void
};
saves.allToSave = ["core.cookies", "core.totalCookies", "core.cookiesPerSecond", // List of every variable that should be saved, in no particular order.
    "keyboard.CPSGiven","grandpa.CPSGiven","ranch.CPSGiven","television.CPSGiven","worker.CPSGiven","wallet.CPSGiven","church.CPSGiven",
    "keyboard.bought","grandpa.bought","ranch.bought","television.bought","worker.bought","wallet.bought","church.bought",
    "keyboard.CPSGain","grandpa.CPSGain","ranch.CPSGain","television.CPSGain","worker.CPSGain","wallet.CPSGain","church.CPSGain",
    "keyboard.upgradeCost","grandpa.upgradeCost","ranch.upgradeCost","television.upgradeCost","worker.upgradeCost","wallet.upgradeCost","church.upgradeCost",
    "upgrades.upgradesBought",
    "core.cookiesPerClick","core.cookieBeenClickedTimes","core.buildingsOwned","hasCheated","won","isModded","versionBranch"
];
saves.defaultSavedValues = { // Should be self-explanatory. Doesn't have to be ordered like allToSave, but I would appreciate if it was.
    "core.cookies":0, "core.totalCookies":0, "core.cookiesPerSecond":0,
    "keyboard.CPSGiven":0,"grandpa.CPSGiven":0,"ranch.CPSGiven":0,"television.CPSGiven":0,"worker.CPSGiven":0,"wallet.CPSGiven":0,"church.CPSGiven":0,
    "keyboard.bought":0,"grandpa.bought":0,"ranch.bought":0,"television.bought":0,"worker.bought":0,"wallet.bought":0,"church.bought":0,
    "keyboard.CPSGain":0.1,"grandpa.CPSGain":1,"ranch.CPSGain":8,"television.CPSGain":47,"worker.CPSGain":260,"wallet.CPSGain":1440,"church.CPSGain":7800,
    "keyboard.upgradeCost":15,"grandpa.upgradeCost":100,"ranch.upgradeCost":1100,"television.upgradeCost":12000,"worker.upgradeCost":130000,"wallet.upgradeCost":1400000,"church.upgradeCost":20000000,
    "Upgrade.upgradesBought":0,
    "core.cookiesPerClick":1,"core.cookieBeenClickedTimes":0,"core.buildingsOwned":0,"hasCheated":false,"won":0,"isModded":false,"versionBranch":null
};

// ------------------------------------
// Saving
// ------------------------------------
// ! Hey!
// ! Do not make updates to this code! It will be changing in a later version! Don't waste your time!
// ! See this issue: https://github.com/clickercookie/clickercookie.github.io/issues/18
saves.exportData = function(game: Game) {
    saves.save(game);
    const dataJSON = !game.VERSION_BRANCH ? JSON.stringify(localStorage.save) : JSON.stringify(localStorage.betaSave);

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

saves.importData = function(game: Game) {
    saves.save(game);
    const file = (document.getElementById("importDataInput") as HTMLInputElement).files[0];
    const reader = new FileReader();
    let importedData: Record<string, any>; // because of the scope of reader.onload(), it can't be defined as a constant in that function and still work in reader.onloadend()

    reader.onload = function() {
        importedData = JSON.parse(JSON.parse(reader.result as string)); // todo: for some reason this has to parse twice, look into this later
    }
    reader.onerror = (e) => alert(`something broke, don't expect me to fix it :D \nerror: ${e}`);

    reader.readAsText(file);
    
    reader.onloadend = () => {
        // helper.consoleLogDev("imported data: ");
        // helper.consoleLogDev(importedData.toString());

        const versionBranchToDisplay = !game.VERSION_BRANCH ? "main" : "beta";
        const saveKeys = Object.keys(importedData);
        saveKeys.forEach((element) => { // checks if save's version matches current version
            if (element == "versionBranch" && importedData[element] != game.VERSION_BRANCH) {
                // helper.popup.createSimple(300,150,`This is a save file from another version branch (${versionBranchToDisplay}), which is incompatible with this version. Please use a different file.`,false,"default","Alert",false,true);
                alert("blah blah version branch no good yada yada")
                return false;
            }
        });

        saves.save(game, importedData);
        saves.loadSave(game);
    };
}

saves.loadSave = function(game: Game) {
    const loadedSave = !game.VERSION_BRANCH ? JSON.parse(localStorage.getItem("save")) : JSON.parse(localStorage.getItem("betaSave"));

    game.grandpa.setVisibility(false);
    game.ranch.setVisibility(false);
    game.television.setVisibility(false);
    game.worker.setVisibility(false);
    game.wallet.setVisibility(false);
    game.church.setVisibility(false);

    const saveKeys = Object.keys(loadedSave);
    saveKeys.forEach((variable) => {
        try {
            eval(`${variable} = ${loadedSave[variable]}`); // YES, i know i shouldn't use this. I have no idea how to do this otherwise so yeah probably will stay.

            // helper.consoleLogDev(`loaded variable: ${variable}, value: ${loadedSave[variable]}`);
        } catch {
            // helper.consoleLogDev(`Attempted to load variable: ${variable}, value: ${loadedSave[variable]}. This is either a constant variable or a malformed save item.`);
        }
    });

    game.reloadBuildingPrices();

    destroyAllUpgrades(game);
    showUnlockedUpgrades(game);
    document.getElementById("upgradesBoughtCounter").innerText = Upgrade.upgradesBought.toString();
    updateUpgradesBoughtStatistic();

    // helper.consoleLogDev(`Loaded save with ${game.cookies} cookies.`);
}

saves.save = function(game: Game, data=undefined) {
    const save: Record<string,any> = (data === undefined) ? {} : data; // save will be an empty object if data isn't undefined because it will be filled in the for-loop, if data is defined than save will be that
    
    if (data === undefined) { // todo: don't nest this somehow
        for (let i = 0; i < saves.allToSave.length; i++) { // yes if you are wondering i totally 100% without a doubt wrote this code
            const variable = saves.allToSave[i];
        
            // Get the name of the variable/property
            const name: string = typeof variable === "object" ? variable.name : variable;
        
            // Get the value of the variable/property
            const value: any = typeof variable === "object" ? variable.value : eval(variable); // YES, i know i shouldn't use this. This will be changed once 0.6 enters beta. Maybe. Probably not.
        
            // Add the variable/property to the object
            save[name] = value;
        }
    }
    if (game.VERSION_BRANCH === Game.Versions.MAIN)
        localStorage.setItem("save",JSON.stringify(save));
    else
        localStorage.setItem("betaSave",JSON.stringify(save));
    if (game.IN_DEVELOPMENT) console.log("save object: ", save);

    // Update saving notification
    const indicator = document.getElementById("savingIndicator");
    indicator.classList.add("visible");

    setTimeout(function() {
        indicator.classList.remove("visible");
    }, 1500);
}

saves.resetSave = function(game: Game) {
    if (game.VERSION_BRANCH === Game.Versions.MAIN) {
        localStorage.setItem("save",JSON.stringify(saves.defaultSavedValues));
    } else {
        localStorage.setItem("betaSave",JSON.stringify(saves.defaultSavedValues));
    }
    saves.loadSave(game);
    game.reloadBuildingPrices();
    
    game.grandpa.unlocked = false;
    game.ranch.unlocked = false;
    game.television.unlocked = false;
    game.worker.unlocked = false;
    game.wallet.unlocked = false;
    game.church.unlocked = false;
    document.getElementById("ifCheatedStat").innerHTML = "";
    document.getElementById("ifModdedStat").innerHTML = "";

    destroyAllUpgrades(game);
    document.getElementById("upgradesBoughtCounter").innerHTML = Upgrade.upgradesBought.toString();
    updateUpgradesBoughtStatistic();

    // document.getElementById("win").style.display = "none";

    game.grandpa.setVisibility(false);
    game.ranch.setVisibility(false);
    game.television.setVisibility(false);
    game.worker.setVisibility(false);
    game.wallet.setVisibility(false);
    game.church.setVisibility(false);
}

saves.convert05Save = function(game: Game, isBeta=false, isBetaSaveOld=false) { // ! this is remaining only for the lifespan of 0.6 and will be removed in the next major update or after a certain time gap, that's why this function is a nightmare to understand
    const oldSave = isBeta ? isBetaSaveOld ? JSON.parse(localStorage.getItem("betaSaveOld")) : JSON.parse(localStorage.getItem("betaSave")) : JSON.parse(localStorage.getItem("save"));

    game.cookies = oldSave[0];
    game.totalCookies = oldSave[1];
    game.cookiesPerSecond = oldSave[2];

    game.keyboard.CPSGiven = oldSave[3];
    game.grandpa.CPSGiven = oldSave[4];
    game.ranch.CPSGiven = oldSave[5];
    game.television.CPSGiven = oldSave[6];
    game.worker.CPSGiven = oldSave[7];
    game.wallet.CPSGiven = oldSave[8];
    game.church.CPSGiven = oldSave[9];

    game.keyboard.bought = oldSave[10];
    game.grandpa.bought = oldSave[11];
    game.ranch.bought = oldSave[12];
    game.television.bought = oldSave[13];
    game.worker.bought = oldSave[14];
    game.wallet.bought = oldSave[15];
    game.church.bought = oldSave[16];

    game.keyboard.CPSGain = oldSave[17];
    game.grandpa.CPSGain = oldSave[18];
    game.ranch.CPSGain = oldSave[19];
    game.television.CPSGain = oldSave[20];
    game.worker.CPSGain = oldSave[21];
    game.wallet.CPSGain = oldSave[22];
    game.church.CPSGain = oldSave[23];

    game.keyboard.upgradeCost = oldSave[24];
    game.grandpa.upgradeCost = oldSave[25];
    game.ranch.upgradeCost = oldSave[26];
    game.television.upgradeCost = oldSave[27];
    game.worker.upgradeCost = oldSave[28];
    game.wallet.upgradeCost = oldSave[29];
    game.church.upgradeCost = oldSave[30];

    // no more upgrades bought crap

    game.cookiesPerClick = oldSave[38];
    game.cookieBeenClickedTimes = oldSave[39];
    game.buildingsOwned = oldSave[40];
    // no grandma prompt clicks
    game.hasCheated = oldSave[42];
    // no won
    game.isModded = oldSave[44];
    // obviously no version branch
    
    for (let i in game.upgrades) {
        game.upgrades[i].unlocked = saves.defaultSavedValues["upgrades.unlocked"];
        game.upgrades[i].bought = saves.defaultSavedValues["upgrades.bought"];
    }

    saves.save(game);

    game.grandpa.unlocked = false;
    game.ranch.unlocked = false;
    game.television.unlocked = false;
    game.worker.unlocked = false;
    game.wallet.unlocked = false;
    game.church.unlocked = false;
    document.getElementById("ifCheatedStat").innerHTML = "";
    document.getElementById("ifModdedStat").innerHTML = "";

    destroyAllUpgrades(game);
    game.keyboard.CPSGain = 0.1;
    game.grandpa.CPSGain = 1;
    game.ranch.CPSGain = 8;
    game.television.CPSGain = 47;
    game.worker.CPSGain = 260;
    game.wallet.CPSGain = 1440;
    game.church.CPSGain = 7800;

    // document.getElementById("win").style.display = "none";

    if (oldSave[11] >= 1) {
        game.grandpa.setVisibility(true);
    } else {
        game.grandpa.setVisibility(false);
    }
    if (oldSave[12] >= 1) {
        game.ranch.setVisibility(true);
    } else {
        game.ranch.setVisibility(false);
    }
    if (oldSave[13] >= 1) {
        game.television.setVisibility(true);
    } else {
        game.television.setVisibility(false);
    }
    if (oldSave[14] >= 1) {
        game.worker.setVisibility(true);
    } else {
        game.worker.setVisibility(false);
    }
    if (oldSave[15] >= 1) {
        game.wallet.setVisibility(true);
    } else {
        game.wallet.setVisibility(false);
    }
    if (oldSave[16] >= 1) {
        game.church.setVisibility(true);
    } else {
        game.church.setVisibility(false);
    }
    
    if (localStorage.getItem("devSave") != null) {
        localStorage.removeItem("devSave");
    }
    if (isBetaSaveOld) {
        localStorage.removeItem("betaSaveOld");
    }
    location.reload();
}