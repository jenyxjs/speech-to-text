self.addEventListener('fetch', event => {
    event.respondWith(new ProxyQuery(event.request).getResponse());
});

class ProxyQuery {
    constructor (request) {
        this.request = request;
    }

    async getResponse () {
        var response = await fetch(this.request);
        return response;
    }
}