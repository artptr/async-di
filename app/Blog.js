export default class Blog {
    #logger;
    #db;
    #email;

    constructor({
        'app.Logger': logger,
        'app.Db': db,
        'app.Email': email,
    }) {
        this.#logger = logger;
        this.#db = db;
        this.#email = email;
    }

    post(message) {
        this.#logger.log(this, `Posting message :: ${message}`);
        this.#db.savePost(message);
        this.#email.notifySubscribers(message);
    }
}
