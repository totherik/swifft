import { ObjectSettings } from './settings';


export default class SwiftObject {

    constructor({ name, account, container }) {
        this.name = name;
        this.account = account;
        this.container = container;
    }


    get pathname() {
        return `${this.container.pathname}/${this.name}`;
    }


    readSettings(res) {
        return Object.assign({
            account:   this.account.id,
            container: this.container.name,
            object:    this.name
        }, ObjectSettings.fromHeaders(res.headers));
    }


    invoke(options, callback) {
        options.uri = Object.assign({}, { pathname: this.pathname }, options.uri);
        this.account.invoke(options, callback)
    }

    get(callback) {
        this.invoke({}, (err, res, payload) => {
            if (err) {
                callback(err);
                return;
            }

            callback(err, payload, this.readSettings(res));
        });
    }


    getStream(range, callback) {
        if (typeof range === 'function') {
            callback = range;
            range = undefined;
        }

        let opts = {
            method: 'GET',
            stream: true,
            headers: {}
        };

        if (range) {
            opts.headers.range = range;
        }

        this.invoke(opts, (err, res, _) => {
            if (err) {
                callback(err);
                return;
            }

            callback(err, res, this.readSettings(res));
        });
    }

    getRange(range, callback) {
        let opts = {
            method: 'GET',
            headers: { range }
        };

        this.invoke(opts, (err, res, payload) => {
            if (err) {
                callback(err);
                return;
            }

            callback(err, payload, this.readSettings(res));
        });
    }


    create(content, settings, callback) {
        if (typeof settings === 'function') {
            callback = settings;
            settings = {};
        }

        let opts = {
            method: 'PUT',
            payload: content,
            headers: ObjectSettings.toHeaders(settings)
        };

        this.invoke(opts, (err, res, _) => {
            if (err) {
                callback(err);
                return;
            }

            callback(err, this.readSettings(res));
        });
    }


    copy(destination, callback) {
        let { container = this.container.name,
              object = this.name } = destination;

        let opts = {
            method: 'COPY',
            headers: {
                'Destination': `/${container}/${object}`
            }
        };

        this.invoke(opts, (err, res, _) => {
            if (err) {
                callback(err);
                return;
            }

            callback(err, this.readSettings(res));
        });
    }


    delete(callback) {
        this.invoke({ method: 'DELETE' }, (err, res, _) => {
            if (err) {
                callback(err);
                return;
            }

            callback(err, this.readSettings(res));
        });
    }


    getMetadata(callback) {
        let opts = {
            method: 'HEAD'
        };

        this.invoke(opts, (err, res, _) => {
            if (err) {
                callback(err);
                return;
            }

            callback(err, this.readSettings(res));
        });
    }


    updateMetadata(settings, callback) {
        let opts = {
            method: 'POST',
            headers: ObjectSettings.toHeaders(settings)
        };

        this.invoke(opts, (err, res, _) => {
            if (err) {
                callback(err);
                return;
            }

            callback(err, this.readSettings(res));
        });
    }

}
