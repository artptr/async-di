export default class Logger {
    constructor() {}

    log(sender, message) {
        console.log(`${new Date().toISOString()} [${sender?.constructor?.name}]`, message);
    }
}
