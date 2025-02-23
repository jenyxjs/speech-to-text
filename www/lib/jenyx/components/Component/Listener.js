export class Listener {
    constructor(options) {
        this.id = ++Listener.id;
        options.context._.listeners[this.id] = this;
        this.type = options.type;
        this.context = options.context;
        this.handler = options.handler;
        this.bubbling = options.bubbling;
        this.final = options.final;
        this.finalTimeoutId = 0;
        options.run && this.run();
        options.exist && this.exist();
    }

    static id = 0;

    remove() {
        delete this.context._.listeners[this.id];
    }

    run() {
        this.handler.call(this.context);
    }

    exist() {
        if (this.context[this.type]) {
            this.handler.call(this.context);
        }
    }
}