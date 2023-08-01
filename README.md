# async-di

async-di is a simple asynchronous JavaScript dependency injection container.
It allows creating and resolving dependencies asynchronously in modern browser and Node.js environments.

## Running

To run in Node.js just execute `index.js`:

```
npm start
```

To run in browser install dependencies and run the server:

```
npm i
npm run server
```

Then open http://127.0.0.1:8080 (or a different port if specified).

## How Does It Work

### Dependency Declaration in Constructors

The syntax of the dependency declaration in constructors uses object destructuring with property renaming to specify
the required dependencies for a service. The constructor parameter is an object that contains key-value pairs,
where the keys represent the names of the dependencies, and the values are the instances of the corresponding services.
For example:

```
constructor({
    'app.Logger': logger,
    'app.Db': db,
    'app.Email': email,
}) {
    this.#logger = logger;
    this.#db = db;
    this.#email = email;
}
```

The renaming of properties in the destructuring syntax allows meaningful names for the dependency instances within
the constructor's scope, making the code more readable and maintainable.

### Service Name Resolution to File

The approach assumes a specific naming convention for services, where the namespace and service name are combined to form
the relative path to the file containing the service implementation. For example, a service with the name `app.Logger`
is expected to be located at the file path `./app/Logger.js`, and a service named `app.Db` is located at `./app/Db.js`.

When the loader function is called with a service name, it dynamically constructs the correct file path by replacing
the `.` character in the service name with `/`. The constructed path is then passed to the `import()` function,
which loads the corresponding module asynchronously and returns a `Promise` that resolves with the default export from
the module (i.e., the service class).

### Dependency Loading and Initialization

The approach treats each service as a singleton. Each service is loaded only once and acts as a shared instance
throughout the application.

The DI container creates a hierarchy of containers for each service and its dependencies. For each dependency, starting
from the first one (e.g., `blog`), a new `Container` object is created, inheriting the parent container's loaded services.
This new container represents the dependency and its sub-dependencies.

The container reports that it is "ready" when all of its dependencies have been loaded and initialized. The `ready()` method
returns a `Promise` that resolves when all requested dependencies are ready. This ensures that all asynchronous dependencies
are resolved correctly before any services are executed.

If a dependency fails to load, the corresponding `Promise` will be rejected, causing the failure to propagate up
the dependency chain. This ensures that the application does not run with missing or improperly loaded dependencies.

### Dependency Injection and `InstanceProxy`

To handle the asynchronous nature of dependencies, the solution wraps the actual service instance in an `InstanceProxy`.
The `InstanceProxy` waits for the `Promise` to resolve and stores the instance of the service. This proxy allows both
the chaining of then method for `Promise` and direct access to the service's properties and methods.

By passing an object-container representing the dependency to the service constructor, the solution defers the actual
initialization of the dependencies. When the service is used, the actual instance of the dependency is set in the service,
ensuring that all dependencies are ready for use.

The approach of using an `InstanceProxy` allows the library to avoid the lack of asynchronous constructors in JavaScript.
It ensures that all dependencies are loaded before the actual initialization of the services.

**TODO:** To avoid calling dependencies in constructors, a separate method like `init()` should be introduced for deferred initialization.
