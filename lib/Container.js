import { fiber, wait } from './fiber.js';

/**
 * The `Container` class is responsible for managing dependencies and providing an injector for resolving them.
 */
export class Container {
    #loader;
    #services;

    /**
     * Default dependency loader treated the name of dependency as namespaced name where the namespace and service name
     * are combined to form the relative path to the file containing the service implementation
     *
     * @param serviceName Service name
     * @returns {Promise} Loading dependency
     */
    static loader = serviceName => {
        return import(`../${serviceName.replaceAll('.', '/')}.js`).then(module => module.default);
    };

    /**
     * @param loader The function used to load dependencies asynchronously.
     */
    constructor(loader = Container.loader) {
        this.#loader = loader;
        this.#services = {};
    }

    /**
     * Creates a new container and runs the code in its context
     * @param task
     */
    static run(task) {
        new Container().run(task);
    }

    /**
     * Runs the code in the context of the container
     * @param task
     */
    run(task) {
        fiber(task, this.injector());
    }

    /**
     * Returns a proxy object that acts as an injector for resolving dependencies lazily.
     * @returns {*}
     */
    injector() {
        const loader = this.#loader;
        const injector = new Proxy(this.#services, {
            get: (target, name) => {
                if (!target[name]) {
                    const promise = loader(name).then(Service => {
                        target[name] = new Service(injector);
                    });
                    wait(promise);
                }

                return target[name];
            }
        });
        return injector;
    }
}
