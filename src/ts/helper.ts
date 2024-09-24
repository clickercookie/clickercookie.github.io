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