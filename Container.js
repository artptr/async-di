import { InstanceProxy } from './InstanceProxy.js';

export class Container {
    #loader;
    #services;
    #requestedNames = new Set();

    constructor(loader, parent) {
        this.#loader = loader;
        this.#services = parent?.#services ?? {};
    }

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

    ready() {
        return Promise.all(
            Array.from(this.#requestedNames)
                .map(name => this.#services[name])
        ).then(() => {});
    }
}
