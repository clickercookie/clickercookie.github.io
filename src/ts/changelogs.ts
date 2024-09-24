interface Changelog {
    version: string;
    name: undefined | string;
    added: string[] | undefined;
    changed: string[] | undefined;
    fixed: string[] | undefined;
    release: string; //? could this be a Date or is that silly?
}

export const versionChangelogs: Changelog[] = [
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

export function createChangelogEntry(logs: Changelog) { // todo 0.7: try to make this look nicer, but lets be honest it's gonna stay this way
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