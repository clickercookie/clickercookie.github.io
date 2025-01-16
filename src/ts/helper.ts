import { game } from "./main.js";

export function convertCollectionToArray(HTMLCollection: HTMLCollection): Element[] {
    const array: Element[] = [];
    for (let i = 0; i < HTMLCollection.length; i++) {
        array.push(HTMLCollection[i]);
    }
    return array;
}

/**
 * Clamps a number to a specified minimum/maximum
 * @param value The number you're clamping
 * @param minimum The minimum the number can be
 * @param maximum The maximum the number can be
 * @returns The number clamped to the minimum/maximum
 */
export function clamp(value: number, minimum: number, maximum: number) {
    if (value < minimum)
        value = minimum;
    else if (value > maximum)
        value = maximum;
    return value;
}

/**
 * Capitalizes the first letter of a string.
 * @param str The string to capitalize the first letter of
 * @returns A string with the first letter capitalized
 */
export function capitalize(str: string): string {
    const capitalized =
        str.charAt(0).toUpperCase()
        + str.slice(1);

    return capitalized;
}

/**
 * Returns a string representation of a number with commas placed in for readability.
 * @param toComma The number to "commaify"
 * @returns The "commaified" number
 */
export function commaify(toComma: number): string {
    const commaifyed = toComma.toLocaleString("en-US");
    return commaifyed;
}

/** Oftentimes, because JS is a pain in the butt hole, number such as 128.2 may instead be 128.2000000000013. This is not very friendly to look at. This makes that number better.
 * 
 * Historically, we would use a seperate object for numbers that would be impacted by this that would automatically apply the calculations in this function (variableView), but I prefer this method instead.
 * 
 * @param num The number (ex. 128.2000000000013) that needs to look nicer
 * @returns A nicer looking number
 */
export function makeSlightlyImperfectFloatNice(num: number): string {
    return commaify(Math.round(num * 10) / 10)
}

//** expect a popup.ts file in the future! */
export const popup = {
    simpleHTML: document.getElementById("simplePopup") as HTMLDialogElement,
    advancedHTML: document.getElementById("advancedPopup") as HTMLDialogElement,

    createSimple(x: number, y: number, text: string, noButton: boolean=false, doWhat: string="default", title: string="", backButton: boolean=false, isError: boolean=false) {
        this.simpleHTML.style.display = "flex";
        this.simpleHTML.showModal();
        this.simpleHTML.style.width = `${x}px`;
        this.simpleHTML.style.height = `${y}px`;
        
        document.getElementById("simplePopupContent").innerHTML = text;
        document.getElementById("simplePopupButtonDiv").style.width = `${x}px`;
        
        if (title === "") {
            document.getElementById("simplePopupTitle").style.display = "none";
        } else {
            document.getElementById("simplePopupTitle").style.display = "block";
            document.getElementById("simplePopupTitle").innerHTML = title;
        }

        if (noButton) {
            document.getElementById("simplePopupButton").style.display = "none";
        } else {
            document.getElementById("simplePopupButton").style.display = "inline-block";
        }

        if (backButton) {
            document.getElementById("simplePopupBackButton").style.display = "inline-block";
        } else {
            document.getElementById("simplePopupBackButton").style.display = "none";
        }

        if (isError) {
            this.simpleHTML.style.borderColor = "red";
        } else {
            this.simpleHTML.style.borderColor = "black";
        }

        if (doWhat !== "default") {
            document.getElementById("simplePopupButton").addEventListener("click", () => {this.simpleHTML.simpleClicked(doWhat)})
        } else {
            document.getElementById("simplePopupButton").addEventListener("click", () => {this.simpleHTML.simpleClicked()})
        }
    },

    destroySimple() {
        this.simpleHTML.style.display = "none";
        this.simpleHTML.close();

        document.getElementById("simplePopupContent").innerHTML = "null";
        document.getElementById("simplePopupButton").style.display = "none";
    },

    simpleClicked(doWhat: string="default") {
        switch (doWhat) {
        case "default":
            this.destroySimple();
            break;
        case "resetSave()":
            // game.savinator5000.reset(); // TODO: Savinator doesn't have reset yet
            this.destroySimple();
            break;
        case "localStorage.clear()":
            localStorage.clear();
            this.destroySimple();
            location.reload();
            break;
        case "reset cookies":
            game.clickercookie.cookies = 0; //! bad
            break;
        default:
            alert(`Simple Popup doWhat is invalid, value is: ${doWhat} \nPlease report this to the GitHub accessable in the bottom left corner`);
            this.destroySimple();
        }
    },

    createAdvanced(x: number, y: number, html: string) {
        this.advancedHTML.style.display = "flex";
        this.advancedHTML.showModal();
        this.advancedHTML.style.width = `${x}px`;
        this.advancedHTML.style.height = `${y}px`;

        this.advancedHTML.innerHTML = html;
    },

    destroyAdvanced() {
        this.advancedHTML.close();
        this.advancedHTML.style.display = "none";
    }
};