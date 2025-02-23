export class Event {
    constructor(options) {
        this.type = options.type;
        this.target = options.target;
        this.value = options.value;
        this.targetType = options.targetType;
        this.send();
    }

    send() {
        var context = this.target;

        do {
            for (var i in context._.listeners) {
                var listener = context._.listeners[i];

                var isHandler = listener.handler;
                var isType = (listener.type == this.targetType);
                var isTarget = (listener.context == this.target);
                var isBubbling = listener.bubbling;
                if (!isHandler || !isType || !(isTarget || isBubbling)) continue;

                if (listener.final) {
                    clearTimeout(listener.finalTimeoutId);
                    listener.finalTimeoutId = setTimeout(() => {
                        listener.handler.call(listener.context, this, listener);
                    });
                } else {
                    listener.handler.call(listener.context, this, listener);
                }
            }

            context = context.parent;
        } while (context);
    }
}