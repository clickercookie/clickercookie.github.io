function navbarItemClicked(item) {
    document.getElementById("cookieContent").style.display = "none";
    document.getElementById("storeContent").style.display = "none";
    document.getElementById("statsContent").style.display = "none";
    document.getElementById("optionsContent").style.display = "none";
    switch (item) {
        case "Cookie":
            document.getElementById("cookieContent").style.display = "flex";
            break;
        case "Store":
            document.getElementById("storeContent").style.display = "flex";
            break;
        case "Stats":
            document.getElementById("statsContent").style.display = "flex";
            break;
        case "Options":
            document.getElementById("optionsContent").style.display = "flex";
            break;
        default:
            alert("navbarItemClicked() has an invalid parameter!");
            break;
    }
}