/**
 * The `InstanceProxy` class is a wrapper for an instance of a service,
 * watching for the loader's promise and storing the instance once resolved.
 */
export class InstanceProxy {
    constructor(instancePromise) {
        const storage = {};

        instancePromise.then(instance => {
            storage.instance = instance;
        });

        return new Proxy({}, {
            get(target, prop) {
                if (prop === 'then') {
                    return instancePromise.then.bind(instancePromise);
                }

                const value = storage.instance[prop];

                if (typeof value === 'function') {
                    return value.bind(storage.instance);
                }

                return value;
            }
        });
    }
}
