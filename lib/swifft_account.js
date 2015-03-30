import Url from 'url';
import Wreck from 'wreck';
import { range } from './utils.js';
import { AccountSettings } from './settings.js';
import SwifftContainer from './swifft_container.js';


const ENV = process.env;


export default class SwifftAccount {

    constructor(options = {}) {
        let { os_auth_url =    ENV.OS_AUTH_URL,
              os_tenant_id =   ENV.OS_TENANT_ID,
              os_tenant_name = ENV.OS_TENANT_NAME,
              region =         ENV.OS_REGION_NAME,
              username =       ENV.OS_USERNAME,
              password =       ENV.OS_PASSWORD } = options;

        this.os_auth_url = Url.parse(os_auth_url);
        this.os_tenant_id = os_tenant_id;
        this.os_tenant_name = os_tenant_name;
        this.region = region;

        this.storage_url = {};
        this.id = undefined;

        this.auth = undefined;
        if (username && password) {
            this.authenticate({ username, password });
        }
    }


    invoke(options, callback) {
        this.auth.then(token => {

            options.headers = Object.assign({}, options.headers, {
                'X-Auth-Token': token && token.id
            });

            // Prepend the generated path with the root as provided by
            // the storage url. This is done late (as opposed to in the
            // `pathname` getter because it's not available until after
            // authentication has happened.
            let { pathname: root } = this.storage_url;

            // Use storage url as base, apply (reset) the pathname, and
            // then apply the options uri, finally updating it to use
            // the root storage path. This could probably be cleaned up
            // and made more straightforward, but works for now.
            options.uri = Object.assign({}, this.storage_url, { pathname: this.pathname }, options.uri);
            options.uri.pathname = root + options.uri.pathname;

            this._request(options, callback);

        }, callback);
    }


    get pathname() {
        return '';
    }


    readSettings(res) {
        return Object.assign({
            account: this.id
        }, AccountSettings.fromHeaders(res.headers));
    }


    container(name) {
        return new SwifftContainer({ name, account: this });
    }


    authenticate(credentials = {}) {

        let { username = ENV.OS_USERNAME,
              password = ENV.OS_PASSWORD } = credentials;

        this.auth = new Promise((resolve, reject) => {

            let opts = {
                method: 'POST',
                json: true,
                uri: Object.assign({}, this.os_auth_url, { pathname: '/v2.0/tokens' }),
                headers: {
                    'Content-Type': 'application/json'
                },
                payload: JSON.stringify({
                    auth: {
                        tenantName: this.os_tenant_name,
                        tenantId:   this.os_tenant_id,
                        passwordCredentials: {
                            username,
                            password
                        }
                    }
                })
            };

            this._request(opts, (err, res, payload) => {

                if (err) {
                    reject(err);
                    return;
                }

                let { access: { token, serviceCatalog = [] } } = payload;

                this.id = `KEY_${token.tenant.id}`;

                services: for (let { type, endpoints } of serviceCatalog) {
                    if (type === 'object-store') {
                        for (let endpoint of endpoints) {
                            if (endpoint.region && this.region && endpoint.region.toLowerCase() === this.region.toLowerCase()) {
                                this.storage_url = Url.parse(endpoint.publicURL || endpoint.internalURL);
                                break services;
                            }
                        }

                    }
                }

                resolve(token);
            });

        });

        return this;
    }

    getMetadata(callback) {
        let opts = {
            method: 'HEAD',
            json: true
        };

        this.invoke(opts, (err, res, _) => {
            callback(err, this.readSettings(res));
        });
    }

    updateMetadata(settings, callback) {
        let opts = {
            method: 'POST',
            headers: AccountSettings.toHeaders(settings)
        };

        this.invoke(opts, (err, res, _) => {
            callback(err, this.readSettings(res));
        });
    }

    list(options, callback) {
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }

        let opts = {
            json: true,
            uri: {
                query: Object.assign({ format: 'json' }, options)
            }
        };

        this.invoke(opts, (err, res, payload) => {
            callback(err, payload, this.readSettings(res));
        });
    }


    _request(options, callback) {
        let { method = 'GET' } = options;
        let { json } = options;

        Wreck.request(method, Url.format(options.uri), options, (err, res) => {
            if (err) {
                callback(err);
                return;
            }

            if (options.stream) {
                callback(err, res, null);
                return;
            }

            Wreck.read(res, { json }, (err, payload) => {
                if (err) {
                    callback(err, res, payload);
                    return;
                }

                if (range(res.statusCode) !== 200) {
                    switch (res.statusCode) {
                        case 404:
                            err = new Error('Not found.');
                            break;

                        default:
                            // TODO: This is pretty brute force error handling.
                            if (Buffer.isBuffer(payload)) {
                                err = new Error('Not found');
                                err.detail = payload.toString('utf8');
                            } else {
                                let { error: { title, message, code } } = payload;
                                err = new Error(title);
                                err.detail = message;
                                err.code = code;
                            }
                    }

                    callback(err, res, payload);
                    return;
                }

                callback(err, res, payload);
            });
        });
    }

}