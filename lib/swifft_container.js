import { ContainerSettings } from './settings.js';
import SwifftObject from './swifft_object.js';


export default class SwiftContainer {

    constructor({ name, account }) {
        this.name = name;
        this.account = account;
    }


    get pathname() {
        return `${this.account.pathname}/${this.name}`;
    }


    invoke(options, callback) {
        options.uri = Object.assign({}, { pathname: this.pathname }, options.uri);
        this.account.invoke(options, callback)
    }


    object(name) {
        return new SwifftObject({ name, account: this.account, container: this });
    }


    list(options, callback) {
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }

        let opts = {
            json: true,
            uri: {
                query: Object.assign(options, { format: 'json' })
            }
        };

        this.invoke(opts, (err, _, payload) => {
            callback(err, payload);
        });
    }


    create(settings, callback) {
        if (typeof settings === 'function') {
            callback = settings;
            settings = {};
        }

        let opts = {
            method: 'PUT',
            headers: ContainerSettings.toHeaders(settings)
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
            method: 'HEAD',
            json: true,
            uri: {
                query: {
                    format: 'json'
                }
            }
        };

        this.invoke(opts, (err, res, _) => {
            if (err) {
                callback(err);
                return;
            }

            let settings = Object.assign({
                account: this.account.id,
                container: this.name
            }, ContainerSettings.fromHeaders(res.headers));

            callback(err, settings);
        });
    }


    updateMetadata(settings, callback) {
        let opts = {
            method: 'POST',
            headers: ContainerSettings.toHeaders(settings)
        };

        this.invoke(opts, (err, res, _) => {
            if (err) {
                callback(err);
                return;
            }

            let settings = Object.assign({
                account: this.account.id,
                container: this.name
            }, ContainerSettings.fromHeaders(res.headers));

            callback(err, settings);
        });
    }

}