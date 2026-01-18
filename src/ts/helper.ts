import { Game, VersionBranch } from "./main.js";

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

/**
 * Oftentimes, because CPUs are annoying, number such as 128.2 may instead be 128.2000000000013. This is not very friendly to look at. This makes that number better.
 * 
 * Historically, we would use a seperate object for numbers that would be impacted by this that would automatically apply the calculations in this function (variableView), but I prefer this method instead.
 * 
 * @param num The number (ex. 128.2000000000013) that needs to look nicer
 * @returns A nicer looking number
 */
export function makeSlightlyImperfectFloatNice(num: number): string {
    return commaify(Math.round(num * 10) / 10);
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
    for (const key in object) {
        newHTML += `${key}: ${object[key]}<br>`;
    }
    return newHTML;
}

/**
 * Simple function takes a string and wraps it like so: `url(<str>)` so when setting CSS we don't have to use ugly template literals
 * 
 * @param str The string to wrap `url()` around
 */
export function url(str: string): string {
    return `url(${str})`;
}

/**
 * Modified from this StackOverflow answer: https://stackoverflow.com/a/8126515
 */
export class Interval {
    private interval: number;

    handler: () => void;
    timeout: number;
    constructor(handler: () => void, timeout: number = 0) {
        this.interval = setInterval(handler, timeout);

        this.handler = handler;
        this.timeout = timeout;
    }

    start() {
        if (!this.interval) {
            this.stop();
            this.interval = setInterval(this.handler, this.timeout);
        }
        return this;
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        return this;
    }

    reset(newTimeout: number = this.timeout) {
        this.timeout = newTimeout;
        return this.stop().start();
    }
}

/**
 * Serves as a replacement for a large switch/ternary statement for returning a value based on the current {@link VersionBranch}.
 * @param main The value to return if the current version branch is main
 * @param beta Value if beta
 * @param develop Value if develop
 * @returns One of the three given parameters depending on the current version branch.
 */
export function branchQuickSwitch(main: unknown, beta: unknown, develop: unknown): unknown {
    switch (Game.VERSION_BRANCH) {
        case VersionBranch.MAIN:
            return main;
        case VersionBranch.BETA:
            return beta;
        case VersionBranch.DEVELOP:
            return develop;
    }
}

/**
 * Counts the number of visible children (`display` CSS property is not equal to `none`) in a given element
 * @param element The element to count the visible children of
 * @returns The number of visible children
 */
export function countVisibleChildren(element: HTMLElement): number {
    let count = 0;
    for (const child of element.children) {
        const style = window.getComputedStyle(child);
        if (style.display !== "none") {
            count++;
        }
    }
    return count;
}

/**
 * Checks if a value is an object
 * @param value The value to check
 * @returns Boolean based on if the parameter is an object
 */
export function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

/** An alias for a `string` that exists to make typing more clear to the user whenever a stringified identifier is involved, as there are obviously requirements expected in that case that need to be clearly shown to the user to avoid errors. */
export type StringifiedIdentifier = string;