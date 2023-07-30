export default class Logger {
    constructor() {}

    log(sender, message) {
        const text = `${new Date().toISOString()} [${sender?.constructor?.name}] ${message}`;
        if (typeof document !== 'undefined') {
            const el = document.createElement('pre');
            el.innerText = text;
            document.body.appendChild(el);
        } else {
            console.log(text);
        }
    }
}
