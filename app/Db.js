export default class Db {
    #logger;

    constructor({
        'app.Logger': logger,
    }) {
        this.#logger = logger;
    }

    savePost(message) {
        this.#logger.log(this, `INSERT INTO posts VALUES ('${message}')`);
    }

    getSubscribers() {
        this.#logger.log(this, 'SELECT * FROM subscribers');

        return [
            'foo@example.com',
            'bar@example.com',
            'quz@example.com',
        ];
    }
}
