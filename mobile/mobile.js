let availableScreenSpace;

const content = document.querySelector(".content");
let filtered = "linear-gradient(to right, rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(" + personalization.currentBackground +")";

window.addEventListener("resize",resizeElements);

function mobileInit() {
    resizeElements();

    document.getElementById("title").innerHTML = "Clicker Cookie Mobile";
}

function resizeElements() {
    const fullScreenSizeStyle = getComputedStyle(document.getElementById("body"));
    const fullScreenWidth = fullScreenSizeStyle.width.replace("px","")
    const fullScreenHeight = fullScreenSizeStyle.minHeight.replace("px","");
    // Get area but not toolbar
    const navbarStyle = getComputedStyle(document.getElementById("footer"));
    const navbarSize = navbarStyle.height.replace("px","");

    availableScreenSpace = fullScreenHeight - navbarSize;

    content.style.height = availableScreenSpace + "px";
    // random things that need specified heights can go here
    document.getElementById("cookieContent").style.height = availableScreenSpace + "px";
    document.getElementById("storeContent").style.height = availableScreenSpace + "px";
    document.getElementById("statsContent").style.height = availableScreenSpace + "px";
    document.getElementById("optionsContent").style.height = availableScreenSpace + "px";

    // Get width for building content
    const buildingContentWidth = fullScreenWidth - 71;
    
    // todo 0.7.1: put this in loop
    document.getElementById("building0Content").style.width = buildingContentWidth + "px";
    document.getElementById("building1Content").style.width = buildingContentWidth + "px";
    document.getElementById("building2Content").style.width = buildingContentWidth + "px";
    document.getElementById("building3Content").style.width = buildingContentWidth + "px";
    document.getElementById("building4Content").style.width = buildingContentWidth + "px";
    document.getElementById("building5Content").style.width = buildingContentWidth + "px";
    document.getElementById("building6Content").style.width = buildingContentWidth + "px";
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
    const buildingContent = document.querySelector(".buildings-content");
    const upgradesContent = document.querySelector(".upgrades-content");
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
            upgradesContent.style.display = "block";
            document.getElementById("upgradesMarker").style.color = "white";
            break;
    }
}

mobileInit();