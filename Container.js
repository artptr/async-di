import { InstanceProxy } from './InstanceProxy.js';

/**
 * The `Container` class is responsible for managing dependencies and providing an injector for resolving them.
 */
export class Container {
    #loader;
    #services;
    #requestedNames = new Set();

    /**
     * @param loader The function used to load ES modules asynchronously.
     * @param parent (optional): A reference to the parent container if this container is nested.
     */
    constructor(loader, parent) {
        this.#loader = loader;
        this.#services = parent?.#services ?? {};
    }

    /**
     * Returns a proxy object that acts as an injector for resolving dependencies lazily.
     * @returns {*}
     */
    injector() {
        const container = this;
        const loader = this.#loader;
        const requestedNames = this.#requestedNames;

        return new Proxy(this.#services, {
            get(target, name) {
                requestedNames.add(name);

                if (!target[name]) {
                    const childContainer = new Container(loader, container);
                    const servicePromise = loader(name)
                        .then(Service => new Service(childContainer.injector()))
                        .then(service => childContainer.ready()
                            .then(() => service));
                    target[name] = new InstanceProxy(servicePromise);
                }

                return target[name];
            }
        });
    }

    /**
     * Returns a promise that resolves when all requested dependencies are ready.
     * This is useful to ensure that all dependencies are loaded before executing your application logic.
     *
     * @returns {Promise}
     */
    ready() {
        return Promise.all(
            Array.from(this.#requestedNames)
                .map(name => this.#services[name])
        ).then(() => {});
    }
}
