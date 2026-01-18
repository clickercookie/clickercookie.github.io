import { StringifiedIdentifier } from "./helper.js";

/**
 * Handlers are the core feature for all content in the game. They store and manage different types of objects, such as buildings, upgrades, mods, and more.
 *
 * Each handler uses {@link Identifier}s to uniquely identify and retrieve objects (with the exception of {@link UniqueKeyHandler}s).
 *
 * Globally accessible handlers are stored in the {@link Handlers} class. These handlers are treated specially throughout the codebase to manage their respective content types. Generally, you will not create your own handlers if you are making a mod that does not drastically modify the game's core systems.
 *
 * Handlers can also be iterated over like so:
 * ```ts
 * for (const obj of handler) {
 *     console.log(obj);
 * }
 * ```
 */
export class Handler<T> implements Iterable<T> {
    /** This stores the stringified Identifier as the key and then the values is obviously T. We store the identifier stringified because objects are never equal so we can't `get()` from the Map without using the same obj reference. */
    protected registered: Map<StringifiedIdentifier, T>;
    /** the number of registered items in the handler */
    public get length(): number {
        return this.registered.size;
    }

    constructor() {
        this.registered = new Map();
    }
    
    register(identifier: Identifier, object: T) {
        const stringifiedIdentifier: StringifiedIdentifier = identifier.toString();
        if (this.registered.has(stringifiedIdentifier) !== false) {
            console.error(`Tried to register object with Identifier "${identifier.toString()}" to a Handler, but it already exists!`);
            // todo ASAP: should this return?
        }
        this.registered.set(stringifiedIdentifier, object);
    }

    /**
     * If a {@link T} is registered with the given ID than return it, if it's not then return undefined
     * @param stringIdentifier The identifier to get from
     */
    getFromIdentifier(identifier: Identifier): T | undefined {
        if (identifier === undefined) {
            console.warn("Tried to get object from a Handler but identifier was undefined. Will return %cundefined%c.", "font-style: italic;", "font-style: default;");
            return undefined;
        }
        const stringifiedIdentifier: StringifiedIdentifier = identifier.toString();
        if (this.registered.has(stringifiedIdentifier) === false) {
            console.warn(`Tried to get object from a Handler with Identifier "${identifier}" that does not exist. Will return %cundefined%c.`, "font-style: italic;", "font-style: default;");
        }
        return this.registered.get(stringifiedIdentifier);
    }

    /**
     * Returns a list of {@link T} of a given namespace
     * @param namespace The namespace to get the {@link T}s of.
     */
    getValuesFromNamespace(namespace: string): T[] {
        return Array.from(this.registered.entries())
            .filter(([key]) => Identifier.fromString(key).namespace === namespace)
            .map(([, value]) => value);
    }

    /**
     * Gets a stringified identifier from a given registered value
     * @param value The value to get the key of
     * @returns The value's key
     */
    getIdentifierFromValue(value: T): StringifiedIdentifier | undefined {
        for (const [key, val] of this.registered.entries()) {
            if (val === value) {
                return key;
            }
        }
        return undefined;
    }

    [Symbol.iterator](): MapIterator<T> {
        return this.registered.values();
    }
}

/**
 * This handler does not use {@link Identifier}s and instead uses unique strings.
 */
export class UniqueKeyHandler<T> implements Iterable<T> {
    protected registered: Map<string, T>;
    /** the number of registered items in the handler */
    public get length(): number {
        return this.registered.size;
    }

    constructor() {
        this.registered = new Map();
    }
    
    register(key: string, object: T) {
        if (this.registered.has(key) !== false) {
            console.error(`Tried to register object with key "${key}" to a UniqueKeyHandler, but it already exists!`);
            // todo ASAP: should this return?
        }
        this.registered.set(key, object);
    }

    /**
     * If a {@link T} is registered with the given ID than return it, if it's not then return undefined
     * @param key The key to get from
     */
    getFromKey(key: string): T | undefined {
        if (key === undefined) {
            console.warn("Tried to get object from a UniqueKeyHandler but key was undefined. Will return %cundefined%c.", "font-style: italic;", "font-style: default;");
            return undefined;
        }
        if (this.registered.has(key) === false) {
            console.warn(`Tried to get object from a UniqueKeyHandler with key "${key}" that does not exist. Will return %cundefined%c.`, "font-style: italic;", "font-style: default;");
        }

        return this.registered.get(key);
    }

    /**
     * Gets a stringified key from a given registered value
     * @param value The value to get the key of
     * @returns The value's key
     */
    getKeyFromValue(value: T): StringifiedIdentifier | undefined {
        for (const [key, val] of this.registered.entries()) {
            if (val === value) {
                return key;
            }
        }
        return undefined;
    }

    [Symbol.iterator](): MapIterator<T> {
        return this.registered.values();
    }
}

/**
 * A unique identifier, usually for objects registered to {@link Handler}s.
 *
 * Identifiers are core to avoiding name collisions. If two mods were to register a building with the name `farm` then they would conflict with each other. The solution is to add a "namespace" such that these identifiers become `mod1:farm` and `mod2:farm`.
 *
 * If you are familiar with Minecraft mods these are functionally identical to how they are implemented there.
 */
export class Identifier {
    /**
     * Constructs a new {@link Identifier} from a stringified Identifier (from {@link Identifier.toString()}). If the string is not valid then a warning will be logged and `undefined` will be returned.
     * @param stringified The stringified Identifier
     * @returns A new {@link Identifier}
     */
    static fromString(stringified: StringifiedIdentifier): Identifier | undefined {
        const regex = /\w+:\w+/;
        if (!regex.test(stringified)) {
            console.warn(`Cannot construct a new Identifier from invalid string "${stringified}". Returning %cundefined%c.`, "font-style: italic;", "font-style: default;");
            return undefined;
        }

        const split = stringified.split(":");
        return new Identifier(split[0], split[1]);
    }

    public readonly namespace: string;
    public readonly uid: string;

    constructor(namespace: string, uid: string) {
        this.namespace = namespace;
        this.uid = uid;
    }

    /**
     * @returns Format: `namespace:uid`
     */
    toString(): StringifiedIdentifier {
        return `${this.namespace}:${this.uid}`;
    }

    /**
     * Since objects are never equal even if their contents are the same, this method must be used for comparison.
     * @param identifier 
     */
    equals(identifier: Identifier) {
        if (identifier.namespace === this.namespace && identifier.uid === this.uid)
            return true;
        else
            return false;
    }
}