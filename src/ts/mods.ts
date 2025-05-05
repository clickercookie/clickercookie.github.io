import { SaveProvider } from "./saving.js";
import { ModHandler } from "./handlers.js";

type Kooh = "click" | "cps" | "loop" | "cps" | "personalization";

interface ModMetadata {
    name: string;
    description: string;
    /** currently unused */
    img?: string;
    // todo: maybe add version compatibility here?
}

/**
 * Provides high-level abstractions for mod developers to work with
 */
export class Mod extends SaveProvider {
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

    constructor(namespace: string, metadata: ModMetadata={name: undefined, description: undefined, img: undefined}) { //? should namespace be a param?
        super();

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
}