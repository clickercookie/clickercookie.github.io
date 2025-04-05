// iterator junk i don't understand but works
class BaseIterator<T> implements Iterator<T> {
    private index: number;
    private done: boolean;

    constructor(private values: T[]) {
        this.index = 0;
        this.done = false;
    }

    next(): IteratorResult<T, number | undefined> {
        if (this.done) {
            return {
                done: this.done,
                value: undefined
            };
        }

        if (this.index === this.values.length) {
            this.done = true;
            return {
                done: this.done,
                value: this.index
            };
        }

        const value = this.values[this.index];
        this.index += 1;

        return {
            done: false,
            value
        };
    }
}

export class Handler<T> implements Iterable<T> {
    private registered: Record<string, T> = {};
    /** the number of registered items in the handler */
    public get length(): number {
        return Object.keys(this.registered).length;
    }
    
    register(uid: string, object: T) {
        if (this.registered[uid] !== undefined) {
            console.error(`Tried to register object with UID "${uid}" to a Handler, but it already exists!`)
        }

        this.registered[uid] = object;
    }

    getFromUID(uid: string): T | undefined {
        if (this.registered[uid] === undefined) {
            console.warn(`Tried to get object from a Handler with UID "${uid}" that does not exist. Will return %cundefined`, "font-style: italic;");
        }
        return this.registered[uid];
    }

    [Symbol.iterator](): BaseIterator<T> {
        return new BaseIterator(Object.values(this.registered));
    }
}