class FiberWait extends Error {
    promise;

    constructor(promise) {
        super();
        this.promise = promise;
    }
}

export const fiber = async (task, ...args) => {
    let promise = null;
    do {
        try {
            if (promise) {
                await promise;
                promise = null;
            }
            return task(...args);
        } catch (error) {
            if (error instanceof FiberWait) {
                promise = error.promise;
            } else {
                throw error;
            }
        }
    } while (true);
};

export const wait = promise => {
    throw new FiberWait(promise);
};
