let availableScreenSpace;

const content = document.querySelector(".content");
let filtered = "linear-gradient(to right, rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(" + personalization.currentBackground +")";

function mobileInit() {
    sizeCheck();
    content.style.height = availableScreenSpace + "px";
    // random things that need specified heights can go here
    document.getElementById("cookieContent").style.height = availableScreenSpace + "px";
    document.getElementById("storeContent").style.height = availableScreenSpace + "px";
    document.getElementById("statsContent").style.height = availableScreenSpace + "px";
    document.getElementById("optionsContent").style.height = availableScreenSpace + "px";

    document.getElementById("title").innerHTML = "CC Mobile Testing";
}

function sizeCheck() { // doesn't run if window size changes
    const fullScreenSizeStyle = getComputedStyle(document.getElementById("body"));
    const fullScreenWidth = fullScreenSizeStyle.width.replace("px","")
    const fullScreenHeight = fullScreenSizeStyle.minHeight.replace("px","");
    // Get area but not toolbar
    const navbarStyle = getComputedStyle(document.getElementById("footer"));
    const navbarSize = navbarStyle.height.replace("px","");

    availableScreenSpace = fullScreenHeight - navbarSize;

    // Get width for building content
    const buildingContentWidth = fullScreenWidth - 71;
    
    document.getElementById("building0Content").style.width = buildingContentWidth + "px";
    document.getElementById("building1Content").style.width = buildingContentWidth + "px";
    document.getElementById("building2Content").style.width = buildingContentWidth + "px";
    document.getElementById("building3Content").style.width = buildingContentWidth + "px";
    document.getElementById("building4Content").style.width = buildingContentWidth + "px";
    document.getElementById("building5Content").style.width = buildingContentWidth + "px";
    document.getElementById("building6Content").style.width = buildingContentWidth + "px";

    return "bcw: " + buildingContentWidth;
}

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
    // document.getElementById("cookieFooterText").style.color = "gray";
    // document.getElementById("storeFooterText").style.color = "gray";
    // document.getElementById("statsFooterText").style.color = "gray";
    // document.getElementById("optionsFooterText").style.color = "gray";
    switch (item) {
        case "Cookie":
            document.getElementById("cookieContent").style.display = "flex";
            content.style.background = personalization.currentBackground;
            document.getElementById("cookieFooterItem").style.scale = "110%";
            // document.getElementById("cookieFooterText").style.color = "white";
            break;
        case "Store":
            document.getElementById("storeContent").style.display = "flex";
            content.style.background = filtered;
            document.getElementById("storeFooterItem").style.scale = "110%";
            switchShopCategory("buildings");
            // document.getElementById("storeFooterText").style.color = "white";
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

console.log("THERE WILL BE ERRORS IN THIS CONSOLE!!!!!");
console.log("THERE WILL BE ERRORS IN THIS CONSOLE!!!!!");
console.log("THERE WILL BE ERRORS IN THIS CONSOLE!!!!!");