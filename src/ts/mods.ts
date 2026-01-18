import { SaveProvider } from "./saving.js";

/**
 * Koohs ("hooks" spelled backwards) serve as events that mods can register functions to be called on. Register functions using {@link Mod.registerKooh}.
 *
 * These will all automatically be called by {@link Game} at the appropriate times. Usually, you should not need to call these manually.
 *
 * | Kooh            | When is it called? |
 * | --------------- | ------------- |
 * | click           | When the cookie is clicked ({@link Game.cookieClicked()}) |
 * | cps             | When CPS is given ({@link Game.cookiesPerSecondUpdate()}) |
 * | loop            | Called in game loop ({@link Game.gameLoop()}) |
 * | personalization | Whenever a personalization option is changed ({@link BackgroundHandler.setBackground()}, {@link CurrentlyClickedHandler.setCurrentlyClicked()}) |
 */
type Kooh = "click" | "cps" | "loop" | "personalization";

interface ModMetadata {
    name: string;
    description: string;
    /** currently unused */
    img?: string;
    // todo: maybe add version compatibility here?
}

/**
 * Provides high-level abstractions for mod developers to work with. [Read the docs.](https://github.com/clickercookie/clickercookie.github.io/wiki/Modding)
 */
export class Mod<T> implements SaveProvider<T> {
    // ------------------
    // Koohs
    // ------------------
    static koohs: Record<Kooh, Array<() => void>> = {
        "click": [],
        "cps": [],
        "loop": [],
        "personalization": []
    }

    static registerKooh(id: Kooh, func: () => void) {
        this.koohs[id].push(func);
    }

    static callKooh(id: Kooh) {
        for (const kooh of this.koohs[id]) {
            kooh();
        }
    }

    // -------------------
    // Actual mod stuff
    // -------------------
    /** See #61 for how this will be used */
    public readonly METADATA: ModMetadata;

    /** Mod namespace used for saving */
    public readonly NAMESPACE: string;

    constructor(namespace: string, metadata: ModMetadata={name: undefined, description: undefined, img: undefined}) {
        this.NAMESPACE = namespace;

        this.METADATA = {
            name: metadata.name,
            description: metadata.description,
            img: metadata.img
        };
    }

    /** 
     * Do any non-property-declaration here, such as registering to Handlers. This will be run when registering to the {@link ModHandler}.
     * 
     * Do **NOT** do init in your constructor. It may work, but will cause issues down the line.
     */
    init() {

    }

    /* we need these two to correctly impliment SaveProvider but they still are only used when overriden */
    getSaveData(): T {
        return undefined;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    loadSaveData(saveData: T): void {}
}