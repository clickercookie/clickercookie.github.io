let availableScreenSpace;

const content = document.querySelector(".content");
let filtered = "linear-gradient(to right, rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(" + personalization.currentBackground +")";

window.addEventListener("resize",resizeElements);

function mobileInit() {
    resizeElements();

    document.getElementById("title").innerText = "Clicker Cookie Mobile";

    // set the border-top for the first building to be shown so that it looks correct
    document.getElementById("buildingsWrapper").children[0].style.borderTopWidth = "2px";
}

function resizeElements() {
    const fullScreenSizeStyle = getComputedStyle(document.getElementById("body"));
    const fullScreenWidth = fullScreenSizeStyle.width.replace("px","");
    const fullScreenHeight = fullScreenSizeStyle.minHeight.replace("px","");
    // Get area but not toolbar
    const navbarSize = getComputedStyle(document.getElementById("footer")).height.replace("px","");

    availableScreenSpace = fullScreenHeight - navbarSize;

    content.style.height = availableScreenSpace + "px";
    // random things that need specified heights can go here
    document.getElementById("cookieContent").style.height = availableScreenSpace + "px";
    document.getElementById("storeContent").style.height = availableScreenSpace + "px";
    document.getElementById("statsContent").style.height = availableScreenSpace + "px";
    document.getElementById("optionsContent").style.height = availableScreenSpace + "px";
    document.getElementById("savingIndicator").style.bottom = navbarSize+"px"

    // Get width for building content
    // todo 0.7.1: what is the significance of the number 71 (building icon size??) and how can it be found dynamically
    const buildingContentWidth = fullScreenWidth - 71;
    
    // set building-content's for all the buildings to buildingContentWidth
    // todo 0.7.1: put this in loop
    keyboard.html.children[1].style.width = buildingContentWidth + "px";
    grandpa.html.children[1].style.width = buildingContentWidth + "px";
    ranch.html.children[1].style.width = buildingContentWidth + "px";
    television.html.children[1].style.width = buildingContentWidth + "px";
    worker.html.children[1].style.width = buildingContentWidth + "px";
    wallet.html.children[1].style.width = buildingContentWidth + "px";
    church.html.children[1].style.width = buildingContentWidth + "px";
}

// todo 0.7.1: instead of item being a string, it could be an element maybe
function navbarItemClicked(item) {
    document.getElementById("cookieContent").style.display = "none";
    document.getElementById("storeContent").style.display = "none";
    document.getElementById("statsContent").style.display = "none";
    document.getElementById("optionsContent").style.display = "none";
    filtered = "linear-gradient(to right, rgba(0,0,0,0.2), rgba(0,0,0,0.2)), " + personalization.currentBackground;

    statsUp = 0;
    document.getElementById("cookieFooterItem").style.scale = "100%";
    document.getElementById("storeFooterItem").style.scale = "100%";
    document.getElementById("statsFooterItem").style.scale = "100%";
    document.getElementById("optionsFooterItem").style.scale = "100%";
    switch (item) {
    case "Cookie":
        document.getElementById("cookieContent").style.display = "flex";
        content.style.background = personalization.currentBackground;
        document.getElementById("cookieFooterItem").style.scale = "110%";
        break;
    case "Store":
        document.getElementById("storeContent").style.display = "flex";
        content.style.background = filtered;
        document.getElementById("storeFooterItem").style.scale = "110%";
        switchShopCategory("buildings");
        break;
    case "Stats":
        document.getElementById("statsContent").style.display = "flex";
        content.style.background = filtered;
        document.getElementById("statsFooterItem").style.scale = "110%";
        statsUp = 1;
        break;
    case "Options":
        document.getElementById("optionsContent").style.display = "flex";
        content.style.background = filtered;
        document.getElementById("optionsFooterItem").style.scale = "110%";
        break;
    default:
        alert("navbarItemClicked() has an invalid parameter!");
        break;
    }
}

function switchShopCategory(select) {
    const buildingContent = document.getElementById("buildingsContent");
    const upgradesContent = document.getElementById("upgradesContent");
    buildingContent.style.display = "none";
    upgradesContent.style.display = "none";

    document.getElementById("buildingsMarker").style.color = "gray";
    document.getElementById("upgradesMarker").style.color = "gray";

    switch (select) {
    case "buildings":
        buildingContent.style.display = "grid";
        document.getElementById("buildingsMarker").style.color = "white";
        break;
    case "upgrades":
        upgradesContent.style.display = "grid";
        document.getElementById("upgradesMarker").style.color = "white";
        break;
    }
}

function upgradeInfoButtonClicked(id) {
    helper.popup.createAdvanced(250,375,`<h1 class="simple-popup-title">Upgrade Info</h1>
        <img src="${getFile(`img/upgrades/${upgrades.img[id]}`)}" alt="upgrade image" width="128px" height="128px" style="image-rendering:pixelated;">
        <h2 class="popup-text">${upgrades.names[id]}</h2>
        <p class="popup-text"><i>"${upgrades.quotes[id]}"</i></p>
        <p class="popup-text">${upgrades.descriptions[Math.floor(id/5)]}</p>
        <button onclick="helper.popup.destroyAdvanced()">OK</button>
    `); // TODO 0.6: CHANGE BETA TO MAIN
}

mobileInit();