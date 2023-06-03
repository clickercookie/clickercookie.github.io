let availableScreenSpace;

sizeCheck();
const content = document.querySelector(".content");
content.style.height = availableScreenSpace + "px";

function sizeCheck() { // doesn't run if window size changes
    const fullScreenSizeStyle = getComputedStyle(document.getElementById("body"));
    const fullScreenWidth = fullScreenSizeStyle.width.replace("px","")
    const fullScreenHeight = fullScreenSizeStyle.minHeight.replace("px","");
    // Get area but not toolbar
    const navbarStyle = getComputedStyle(document.getElementById("footer"));
    const navbarSize = navbarStyle.height.replace("px","");

    availableScreenSpace = fullScreenHeight - navbarSize;

    // Get width for building content
    const buildingContent = document.querySelector(".building-content");
    const buildingContentWidth = fullScreenWidth - 71;
    
    buildingContent.style.width = buildingContentWidth + "px";

    return "bcw: " + buildingContentWidth;
}

function navbarItemClicked(item) {
    document.getElementById("cookieContent").style.display = "none";
    document.getElementById("storeContent").style.display = "none";
    document.getElementById("statsContent").style.display = "none";
    document.getElementById("optionsContent").style.display = "none";
    const filtered = "linear-gradient(to right, rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(../img/backgrounds/background-blue.png)";
    switch (item) {
        case "Cookie":
            document.getElementById("cookieContent").style.display = "flex";
            content.style.background = "url(../img/backgrounds/background-blue.png)";
            break;
        case "Store":
            document.getElementById("storeContent").style.display = "flex";
            content.style.background = filtered;
            break;
        case "Stats":
            document.getElementById("statsContent").style.display = "flex";
            content.style.background = filtered;
            break;
        case "Options":
            document.getElementById("optionsContent").style.display = "flex";
            content.style.background = filtered;
            break;
        default:
            alert("navbarItemClicked() has an invalid parameter!");
            break;
    }
}