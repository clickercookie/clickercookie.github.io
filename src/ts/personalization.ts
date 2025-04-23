/**
 * Both `name` and `namePlural` should be capitalized.
*/
export interface CurrentlyClickedObject {
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

export interface Background {
    /** Display name for the background */
    name: string;
    src: string;
}

//* well boy is this empty