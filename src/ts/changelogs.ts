import { parseGithubIssue } from "./helper.js";

/** 
 * these are all unused except for hotfix
 * 
 * also our versioning scheme looks like this:
 * 
 * `major.minor.patch-hotfix`
 */
type VersionType = "major" | "minor" | "patch" | "hotfix";

interface Changelog {
    type: VersionType;
    version: string;
    name?: string;
    note?: string;
    added?: string[];
    changed?: string[];
    fixed?: string[];
    removed?: string[];
    release?: string; //? could this be a Date or is that silly?
}

export const versionChangelogs: Changelog[] = [
    {
        type: "minor",
        version: "0.1",
        added: [
            "Existence."
        ],
        release: "March 4th, 2023"
    },
    {
        type: "patch",
        version: "0.1.1",
        added: [
            "Ranches! Buyable for 1000 cookies for the time being.",
            "Minor hover effect when hovering over buildings."
        ],
        fixed: ["totalCookies variable is fixed, but still unused (but not for long!)"],
        release: "March 9th, 2023"
    },
    {
        type: "minor",
        version: "0.2",
        added: [
            "A Github page.",
            "Version number."
        ],
        release: "March 16th, 2023"
    },
    {
        type: "patch",
        version: "0.2.1",
        added: [
            "Television!",
            "Laborers!"
        ],
        changed: ["Made CSS better."],
        release: "March 16th, 2023"
    },
    {
        type: "patch",
        version: "0.2.2",
        added: [
            "Borders to the left and right sides of the screen.",
            "The capability to create a popup for usage later."
        ],
        release: "March 16th, 2023"
    },
    {
        type: "minor",
        version: "0.4",
        note: "\"Hey, what happened to 0.3?\" / Well, you see... I made 0.3 while I also had 0.4 content being actively worked on, so I kinda just skipped it because this is a BIG update!",
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
        type: "patch",
        version: "0.4.1",
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
        type: "minor",
        version: "0.5",
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
        type: "patch",
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
        type: "patch",
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
        type: "hotfix", //* this is politically incorrect according to our versioning guidelines but will remain this way for proper coloration in the changelogs
        version: "0.5.2.1",
        name: "the first of many",
        note: "Note: Although 0.1 came out on March 4th, initial public development began on the 3rd, which is why we celebrate today!",
        added: [
            "It's our 1st birthday! With this, we now have the Clicker Cookie Anniversary event, which currently only activates the new Currently Clicked food, the Cake.",
        ],
        release: "March 3rd, 2024"
    },
    {
        type: "minor",
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
        release: "September 22nd, 2024"
    },
    {
        type: "hotfix",
        version: "0.6-1",
        name: "warcrimes",
        fixed: [ "Fixed geneva conventions violation (#52)" ],
        release: "March 13th, 2025"
    },
    {
        type: "minor",
        version: "0.7",
        note: "Hi. It's hard to explain in a simple changelog how much this update has done. See everything you're looking at? I can confidently say that what is happening behind the scenes for what you're looking at is completely overhauled.",
        name: "the boilerplate update",
        added: [
            "\"Cookies Per Click\" statistic.",
            "A button in Options to toggle auto-saving (#29)",
            "GitHub issues in changelogs work as hyperlinks, like this one: #13",
            "A \"removed\" section in changelogs",
            "Advanced popups now have options (#32)",
            "The white background is now visible by default."
        ],
        changed: [
            "Switched to TypeScript.",
            "Introduced the v4 Saving System (#18)",
            "Hotfixes are slightly smaller and colored in gray. (#53)",
            "Loading a save now resets the auto-saving interval (#47)",
            "Eliminated inline event handlers, now are handled in init (#27)",
            "The entire modding system. See the GitHub wiki for more details.",
            "Split main.js into multiple script files.",
            "Reorganized the GitHub repo (#35)",
            "Logs can now have a \"note\" (it's below the version header).",
            "A 404 upgrade or building icon will now send a warning to the console and fallback to unknown."
        ],
        fixed: [
            "Resetting save and importing data does not import data. (#13)",
            "The \"Import Data\" button is using a browser-specific styling workaround. (#39)",
            "Pressing escape on an open advanced popup does not fully close the popup. (#57)",
            "Television description doesn't change with personalization. (#54)",
            "No more HTMLElement.innerHTML where it's not needed, now use innerText. (#43)",
            "Version 0.2 changelog did not have a release year."
        ],
        removed: [
            "Removed the mobile version due to the extreme amount of work required to upkeep it alongside the main version. (#36)",
        ],
        release: "December 29th, 2025"
    }
];

export function createChangelogEntry(logs: Changelog) { // todo 0.7: try to make this look nicer, but lets be honest it's gonna stay this way
    const changelog = document.querySelector(".changelog-wrapper");

    const newChangelogEntry = document.createElement("div");
    newChangelogEntry.setAttribute("class","changelog");
    if (logs.type === "hotfix")
        newChangelogEntry.setAttribute("style", "font-size: 0.85em; color: #9f9f9f");

    const versionHeader = document.createElement("h2");
    versionHeader.setAttribute("class", "version-heading");

    const releaseDate = (logs.release === undefined) ? "???" : logs.release;
    if (logs.name === undefined)
        versionHeader.appendChild(document.createTextNode(`Version ${logs.version} - ${releaseDate}`));
    else
        versionHeader.appendChild(document.createTextNode(`Version ${logs.version}: ${logs.name} - ${releaseDate}`));
    newChangelogEntry.appendChild(versionHeader);
    
    if (logs.note !== undefined) {
        const note = document.createElement("p");
        note.setAttribute("class", "middle-text note");
        note.innerText = logs.note;
        newChangelogEntry.appendChild(note);
    }
    
    if (logs.added !== undefined) {
        const addedHeader = document.createElement("h3");
        addedHeader.setAttribute("class","middle-text subheading");
        addedHeader.innerText = "Added:";
        newChangelogEntry.appendChild(addedHeader);

        const addedList = document.createElement("ul");
        addedList.setAttribute("class","middle-ul");
        newChangelogEntry.appendChild(addedList);

        for (const item of logs.added) {
            const addedListItem = document.createElement("li");
            addedListItem.innerHTML = parseGithubIssue(item);
            addedList.appendChild(addedListItem);
        }
    }
    if (logs.changed !== undefined) {
        const changedHeader = document.createElement("h3");
        changedHeader.setAttribute("class","middle-text subheading");
        changedHeader.innerText = "Changed:";
        newChangelogEntry.appendChild(changedHeader);

        const changedList = document.createElement("ul");
        changedList.setAttribute("class","middle-ul");
        newChangelogEntry.appendChild(changedList);

        for (const item of logs.changed) {
            const changedListItem = document.createElement("li");
            changedListItem.innerHTML = parseGithubIssue(item);
            changedList.appendChild(changedListItem);
        }
    }
    if (logs.fixed !== undefined) {
        const fixedHeader = document.createElement("h3");
        fixedHeader.setAttribute("class","middle-text subheading");
        fixedHeader.innerText = "Fixed:";
        newChangelogEntry.appendChild(fixedHeader);

        const fixedList = document.createElement("ul");
        fixedList.setAttribute("class","middle-ul");
        newChangelogEntry.appendChild(fixedList);

        for (const item of logs.fixed) {
            const fixedListItem = document.createElement("li");
            fixedListItem.innerHTML = parseGithubIssue(item);
            fixedList.appendChild(fixedListItem);
        }
    }
    if (logs.removed !== undefined) {
        const removedHeader = document.createElement("h3");
        removedHeader.setAttribute("class","middle-text");
        removedHeader.setAttribute("style","font-size: 16px;");
        removedHeader.innerText = "Removed:";
        newChangelogEntry.appendChild(removedHeader);

        const removedList = document.createElement("ul");
        removedList.setAttribute("class","middle-ul");
        newChangelogEntry.appendChild(removedList);

        for (const item of logs.removed) {
            const fixedListItem = document.createElement("li");
            fixedListItem.innerHTML = parseGithubIssue(item);
            removedList.appendChild(fixedListItem);
        }
    }

    changelog.appendChild(newChangelogEntry);
}