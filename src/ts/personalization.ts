import { Logger, LogManager } from "./helper.js";

/**
 * Both `name` and `namePlural` should be capitalized.
*/
interface CurrentlyClickedObject {
    name: string;
    namePlural: string;
    src: string;
    /** should border-radius be 128px? default is true */
    circular?: boolean,
    /** image-rendering auto/pixelated? default is false */
    pixelated?: boolean
}

interface Background {
    /** {@link HTMLSelectElement.value} will be set to this */
    name: string;
    displayName: string;
    src: string;
}

export class Personalization {
    static currentlyClicked: CurrentlyClickedObject;
    static registeredClickableObjects: CurrentlyClickedObject[] = [];

    static currentBackground: Background;
    static registeredBackgrounds: Background[] = [];

    static logger: Logger = LogManager.getLogger("personalization");

    // -----------------------
    // Currently Clicked Stuff
    // -----------------------
    /**
     * @returns The currently clicked object (CAPITALIZED!!!)
     */
    static getCurrentlyClicked(): string {
        return this.currentlyClicked.name;
    }

    /**
     * @returns The currently clicked object in its plural form (CAPITALIZED!!!)
     */
    static getCurrentlyClickedPlural(): string {
        return this.currentlyClicked.namePlural;
    }

    static registerObject(object: CurrentlyClickedObject) {
        this.registeredClickableObjects.push(object);

        const option = document.createElement("option");
        option.value = object.name.toLowerCase();
        option.innerText = object.name;

        (document.getElementById("currentlyClickedSelect") as HTMLSelectElement).add(option);
    }

    /**
     * Set the {@link Personalization.currentlyClicked} to the `name` of one of the items in {@link Personalization.clickableObjects}.
     * 
     * This method kinda sucks but we need it to work this way because of how {@link HTMLSelectElement}s work
     * @param value Usually `currentlyClickedSelect`'s `value`
     */
    static setCurrentlyClicked(value: string): void {
        const foundObject = this.registeredClickableObjects.find(obj => obj.name.toLowerCase() === value);
        if (foundObject) {
            this.currentlyClicked = foundObject;
        } else {
            console.warn(`There is no registered "${value}" currently clicked object. Defaulting back to "cookie".`);
            alert(`There is no registered "${value}" currently clicked object. Defaulting back to "cookie".`);
            this.setCurrentlyClicked("cookie");
            return;
        }

        const cookie = document.getElementById("cookie") as HTMLImageElement;
        try { // if #28 is done this check may be irrelevent, also this check doesn't work
            cookie.src = this.currentlyClicked.src;
        } catch {
            console.warn(`Couldn't find image file for cookie. Tried to assign image file: ${value}.png`);
        }

        cookie.style.borderRadius = "128px";
        cookie.style.imageRendering = "auto"; // cake is 64x64 so it needs to not be blurry, this resets that
        if (this.currentlyClicked.pixelated === true)
            cookie.style.imageRendering = "pixelated"; // cake is 64x64 so it needs to not be blurry, this resets that
        if (this.currentlyClicked.circular === false)
            cookie.style.borderRadius = "0px";

        (document.getElementById("currentlyClickedSelect") as HTMLSelectElement).value = value; //* if the thing is set by something other than the HTMLSelectElement change event then we need to make sure the correct obj is listed as the value

        //! upgrades.descriptions[0] = `Multiplys Keyboard and clicking ${this.currentClicked} production by 2`;
        this.logger.debug(`Currently clicked set to: ${value}`);
    }

    // -----------------------
    // Background
    // -----------------------
    static getCurrentBackgroundFile(includeURL: boolean=false) {
        if (includeURL)
            return `url(${this.currentBackground.src})`;
        else
            return this.currentBackground.src;
    }

    //* DRY ↓
    /**
     * Set {@link Personalization.currentBackground} to the `name` of one of the items in {@link Personalization.validBackgrounds}.
     * 
     * This method kinda sucks but we need it to work this way because of how {@link HTMLSelectElement}s work
     * @param value Usually `currentlyClickedSelect`'s `value`
     */
    static setBackground(value: string) {
        const foundObject = this.registeredBackgrounds.find(obj => obj.name.toLowerCase() === value);
        if (foundObject) {
            this.currentBackground = foundObject;
        } else {
            this.logger.warn(`There is no registered "${value}" background. Defaulting back to "blue".`);
            alert(`There is no registered "${value}" background. Defaulting back to "blue".`);
            this.setBackground("blue");
            return;
        }

        document.getElementById("leftSide").style.background = Personalization.getCurrentBackgroundFile(true);
        document.getElementById("middleButtons").style.background = Personalization.getCurrentBackgroundFile(true);
        document.getElementById("middle").style.background = Personalization.getCurrentBackgroundFile(true);
        document.getElementById("rightSide").style.background = Personalization.getCurrentBackgroundFile(true);

        (document.getElementById("backgroundSelect") as HTMLSelectElement).value = value; //* if the thing is set by something other than the HTMLSelectElement change event then we need to make sure the correct obj is listed as the value

        this.logger.debug(`Background color set to: ${value}`);
    }

    static registerBackground(background: Background) {
        this.registeredBackgrounds.push(background);

        const option = document.createElement("option");
        option.value = background.name.toLowerCase();
        option.innerText = background.displayName;

        (document.getElementById("backgroundSelect") as HTMLSelectElement).add(option);
    }
}