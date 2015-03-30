import { ContainerSettings } from './settings.js';
import SwifftObject from './swifft_object.js';


export default class SwiftContainer {

    constructor({ name, account }) {
        this.name = name;
        this.account = account;
    }


    invoke(options, callback) {
        options.uri = Object.assign({}, { pathname: this.pathname }, options.uri);
        this.account.invoke(options, callback)
    }


    get pathname() {
        return `${this.account.pathname}/${this.name}`;
    }


    readSettings(res) {
        return Object.assign({
            account: this.account.id,
            container: this.name
        }, ContainerSettings.fromHeaders(res.headers));
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

        this.invoke(opts, (err, res, payload) => {
            callback(err, payload, this.readSettings(res));
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

        this.invoke(opts, (err, res, payload) => {
            callback(err, payload, this.readSettings(res));
        });
    }


    delete(callback) {
        this.invoke({ method: 'DELETE' }, (err, res, _) => {
            callback(err, this.readSettings(res));
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
            callback(err, this.readSettings(res));
        });
    }


    updateMetadata(settings, callback) {
        let opts = {
            method: 'POST',
            headers: ContainerSettings.toHeaders(settings)
        };

        this.invoke(opts, (err, res, _) => {
            callback(err, this.readSettings(res));
        });
    }

}