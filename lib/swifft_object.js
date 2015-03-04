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

            let settings = Object.assign({
                account: this.account.id,
                container: this.container.name,
                object: this.name
            }, ObjectSettings.fromHeaders(res.headers));

            callback(err, payload, settings);
        });
    }


    getStream(callback) {
        this.invoke({ stream: true }, (err, res, _) => {

            if (err) {
                callback(err);
                return;
            }

            let settings = Object.assign({
                account: this.account.id,
                container: this.container.name,
                object: this.name
            }, ObjectSettings.fromHeaders(res.headers));

            callback(err, res, settings);
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

        this.invoke(opts, (err, _, payload) => {
            callback(err, payload);
        });
    }


    copy(destination, callback) {
        let { container = this.container.name,
              object = this.name } = destination;

        let opts = {
            method: 'COPY',
            headers: {
                'Destination': `${container}/${object}`
            }
        };

        this.invoke(opts, (err, _, payload) => {
            callback(err, payload);
        });
    }


    delete(callback) {
        this.invoke({ method: 'DELETE' }, (err, res, _) => {
            callback(err, { 'transId': res.headers['x-trans-id'] });
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

            let settings = Object.assign({
                account: this.account.id,
                container: this.container.name,
                object: this.name
            }, ObjectSettings.fromHeaders(res.headers));

            callback(err, settings);
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

            let settings = Object.assign({
                account: this.account.id,
                container: this.container.name,
                object: this.name
            }, ObjectSettings.fromHeaders(res.headers));

            callback(err, settings);
        });
    }

}