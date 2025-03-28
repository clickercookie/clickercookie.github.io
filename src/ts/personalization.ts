import { Handler } from "./handler.js";
import { Mod } from "./mods.js";

/**
 * Both `name` and `namePlural` should be capitalized.
*/
interface CurrentlyClickedObject {
    /** Display name for the cc object. Should be capitalized. */
    name: string;
    /** *Plural* display name for the cc object. Should be capitalized. */
    namePlural: string;
    src: string;
    /** should border-radius be 128px? default is true */
    circular?: boolean,
    /** image-rendering auto/pixelated? default is false */
    pixelated?: boolean
}

interface Background {
    /** Display name for the background */
    name: string;
    src: string;
}

class BackgroundHandler extends Handler<Background> {
    /**
     * {@link Handler.register} with modifications to add a new {@link HTMLSelectElement} to the `backgroundSelect`.
     * 
     * @param uid UID for the handler. **Will be {@link HTMLSelectElement.value} for `backgroundSelect`**.
     */
    override register(uid: string, background: Background) {
        super.register(uid, background);

        const option = document.createElement("option");
        option.value = uid;
        option.innerText = background.name;

        (document.getElementById("backgroundSelect") as HTMLSelectElement).add(option);
    }
}

class CurrentlyClickedHandler extends Handler<CurrentlyClickedObject> {
    /**
     * {@link Handler.register} with modifications to add a new {@link HTMLSelectElement} to the `currentlyClickedSelect`.
     * 
     * @param uid UID for the handler. **Will be {@link HTMLSelectElement.value} for `currentlyClickedSelect`**.
     */
    override register(uid: string, object: CurrentlyClickedObject) {
        super.register(uid, object);

        const option = document.createElement("option");
        option.value = uid;
        option.innerText = object.name;

        (document.getElementById("currentlyClickedSelect") as HTMLSelectElement).add(option);
    }
}

export class Personalization {
    static currentlyClicked: CurrentlyClickedObject;

    static currentBackground: Background;

    public static backgroundHandler: BackgroundHandler = new BackgroundHandler();
    public static currentlyClickedHandler: CurrentlyClickedHandler = new CurrentlyClickedHandler();

    // -----------------------
    // Currently Clicked Stuff
    // -----------------------
    /**
     * @returns The currently clicked object name
     */
    static getCurrentlyClicked(): string {
        return this.currentlyClicked.name;
    }

    /**
     * @returns The currently clicked object in its plural form
     */
    static getCurrentlyClickedPlural(): string {
        return this.currentlyClicked.namePlural;
    }

    /**
     * Set the {@link Personalization.currentlyClicked} to whatever item that the provided UID is associated with.
     * 
     * This method kinda sucks but we need it to work this way because of how {@link HTMLSelectElement}s work
     * @param value The UID of whatever {@link Background} we want from {@link currentlyClickedHandler}. Usually `currentlyClickedSelect`'s `value`
     */
    static setCurrentlyClicked(uid: string): void {
        const foundObject = this.currentlyClickedHandler.getFromUID(uid);
        if (foundObject) {
            this.currentlyClicked = foundObject;
        } else {
            console.warn(`There is no registered "${uid}" currently clicked object. Defaulting back to "cookie".`);
            alert(`There is no registered "${uid}" currently clicked object. Defaulting back to "cookie".`);
            this.setCurrentlyClicked("cookie");
            return;
        }

        const cookie = document.getElementById("cookie") as HTMLImageElement;
        try { //! this check doesn't work
            cookie.src = this.currentlyClicked.src;
        } catch {
            console.warn(`Couldn't find image file for cookie. Tried to assign image file: ${uid}.png`);
        }

        cookie.style.borderRadius = "128px";
        cookie.style.imageRendering = "auto"; // cake is 64x64 so it needs to not be blurry, this resets that
        if (this.currentlyClicked.pixelated === true)
            cookie.style.imageRendering = "pixelated"; // cake is 64x64 so it needs to not be blurry, this resets that
        if (this.currentlyClicked.circular === false)
            cookie.style.borderRadius = "0px";

        (document.getElementById("currentlyClickedSelect") as HTMLSelectElement).value = uid; //* if the cc is set by something other than the HTMLSelectElement change event then we need to make sure the correct obj is listed as the value

        Mod.callKooh("personalization");
        console.log(`Currently clicked set to: ${uid}`);
    }

    // -----------------------
    // Background
    // -----------------------
    /**
     * Returns the current background `src` attribute
     * @param includeURL Do you want to wrap the `src` attribute in `url()`? Useful for CSS.
     * @returns The background file src
     */
    static getCurrentBackgroundFile(includeURL: boolean=false) {
        if (includeURL)
            return `url(${this.currentBackground.src})`;
        else
            return this.currentBackground.src;
    }

    //* DRY ↓
    /**
     * Set the {@link Personalization.currentBackground} to whatever item that the provided UID is associated with.
     * 
     * This method kinda sucks but we need it to work this way because of how {@link HTMLSelectElement}s work
     * @param value The UID of whatever {@link Background} we want from {@link backgroundHandler}. Usually `backgroundSelect`'s `value`
     */
    static setBackground(uid: string) {
        const foundObject = this.backgroundHandler.getFromUID(uid);
        if (foundObject) {
            this.currentBackground = foundObject;
        } else {
            console.warn(`There is no registered "${uid}" background. Defaulting back to "blue".`);
            alert(`There is no registered "${uid}" background. Defaulting back to "blue".`);
            this.setBackground("blue");
            return;
        }

        document.getElementById("leftSide").style.background = Personalization.getCurrentBackgroundFile(true);
        document.getElementById("middleButtons").style.background = Personalization.getCurrentBackgroundFile(true);
        document.getElementById("middle").style.background = Personalization.getCurrentBackgroundFile(true);
        document.getElementById("rightSide").style.background = Personalization.getCurrentBackgroundFile(true);

        (document.getElementById("backgroundSelect") as HTMLSelectElement).value = uid; //* if the thing is set by something other than the HTMLSelectElement change event then we need to make sure the correct obj is listed as the value

        Mod.callKooh("personalization");
        console.log(`Background color set to: ${uid}`);
    }
}