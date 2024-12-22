/**
 * Both `name` and `namePlural` should be capitalized.
*/
interface CurrentlyClickedObject {
    name: string;
    namePlural: string;
    filename: string;
    /** should border-radius be 128px? default is true */
    circular?: boolean,
    /** image-rendering auto/pixelated? default is false */
    pixelated?: boolean
}

interface Background {
    /** {@link HTMLSelectElement.value} will be set to this */
    name: string;
    displayName: string;
    filename: string;
}

export class Personalization {
    // -----------------------
    // Currently Clicked Stuff
    // -----------------------
    static currentlyClicked: CurrentlyClickedObject;
    static clickableObjects: CurrentlyClickedObject[] = [];

    static currentBackground: Background;
    static validBackgrounds: Background[] = [];

    static validBackgroundColors: string[] = [
        ""
    ]

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
        this.clickableObjects.push(object);

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
        console.log(this.clickableObjects)
        console.log("HELLO")

        const foundObject = this.clickableObjects.find(obj => obj.name.toLowerCase() === value);
        if (foundObject) {
            this.currentlyClicked = foundObject;
        } else {
            throw new Error(`There is no registered "${value}" currently clicked object.`)
        }

        const cookie = document.getElementById("cookie") as HTMLImageElement;
        try { // if #28 is done this check may be irrelevent, also this check doesn't work
            cookie.src = this.currentlyClicked.filename;
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
        console.log(`Currently clicked set to: ${value}`);
    }

    // -----------------------
    // Background
    // -----------------------
    static getCurrentBackgroundFile(includeURL: boolean=false) {
        if (includeURL)
            return `url(${this.currentBackground.filename})`;
        else
            return this.currentBackground.filename;
    }

    //* DRY ↓
    /**
     * Set {@link Personalization.currentBackground} to the `name` of one of the items in {@link Personalization.validBackgrounds}.
     * 
     * This method kinda sucks but we need it to work this way because of how {@link HTMLSelectElement}s work
     * @param value Usually `currentlyClickedSelect`'s `value`
     */
    static setBackground(value: string) {
        const foundObject = this.validBackgrounds.find(obj => obj.name.toLowerCase() === value);
        if (foundObject) {
            this.currentBackground = foundObject;
        } else {
            throw new Error(`There is no registered "${value}" background.`)
        }

        document.getElementById("leftSide").style.background = Personalization.getCurrentBackgroundFile(true);
        document.getElementById("middleButtons").style.background = Personalization.getCurrentBackgroundFile(true);
        document.getElementById("middle").style.background = Personalization.getCurrentBackgroundFile(true);
        document.getElementById("rightSide").style.background = Personalization.getCurrentBackgroundFile(true);

        (document.getElementById("backgroundSelect") as HTMLSelectElement).value = value; //* if the thing is set by something other than the HTMLSelectElement change event then we need to make sure the correct obj is listed as the value

        console.log(`Background color set to: ${value}`);
    }

    static registerBackground(background: Background) {
        this.validBackgrounds.push(background);

        const option = document.createElement("option");
        option.value = background.name.toLowerCase();
        option.innerText = background.displayName;

        (document.getElementById("backgroundSelect") as HTMLSelectElement).add(option);
    }
}