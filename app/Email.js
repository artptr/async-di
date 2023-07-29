export default class Email {
    #logger;
    #db;

    constructor({
        'app.Logger': logger,
        'app.Db': db,
    }) {
        this.#logger = logger;
        this.#db = db;
    }

    sendEmail(to, message) {
        this.#logger.log(this, `Email to: ${to} :: ${message}`);
    }

    notifySubscribers(message) {
        const subscribers = this.#db.getSubscribers();
        subscribers.forEach(subscriber => {
            this.sendEmail(subscriber, message);
        });
    }
}
