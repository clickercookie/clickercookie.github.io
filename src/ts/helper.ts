import { Game } from "./main.js";

/**
 * Parses a string and replaces any instances of a hashtag followed by a set of numbers with an `<a>` linking to the corresponding GitHub issue
 * @param input A string of text wherein issues will be replaced
 * @returns A string of text with hyperlinks to GitHub issues where hashtags are
 */
export function parseGithubIssue(input: string): string {
    return input.replace(/(?<!\\)#(\d+)/g, (_, number) => {
        return `<a href="${Game.GITHUB_REPO}/issues/${number}" target="_blank">#${number}</a>`;
    });
}

/**
 * @deprecated use {@link Array.from}
 */
export function convertCollectionToArray(HTMLCollection: HTMLCollection): Element[] {
    const array: Element[] = [];
    for (const item of HTMLCollection) {
        array.push(item);
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

/**
 * Takes an object of type {@link Record<string, string>} and returns a representation of that in stringified HTML. Format is like follows:
 * 
 * ```
 * key: value <br>
 * key2: value2 <br>
 * key3: value3 <br>
 * ```
 * 
 * @param object The object to htmlify
 */
export function object2HTML(object: Record<string, string>): string {
    let newHTML = "";
    for (let i in object) {
        newHTML += `${i}: ${object[i]}<br>`;
    }
    return newHTML;
}