#!/usr/bin/env node
import Fs from 'fs';
import minimist from 'minimist';
import Swifft from '../index.js';


const argv = minimist(process.argv.slice(2), {
    alias: {
        'os_auth_url':    'a',
        'os_tenant_id':   'i',
        'os_tenant_name': 'n',
        'os_username':    'u',
        'os_password':    'p',
        'region':         'r'
    },
    default: {
        /*
         // These defaults live in the lib/swifft_account.js implementation.
         'os_auth_url':    process.env.OS_AUTH_URL,
         'os_tenant_id':   process.env.OS_TENANT_ID,
         'os_tenant_name': process.env.OS_TENANT_NAME,
         'os_username':    process.env.OS_USERNAME,
         'os_password':    process.env.OS_PASSWORD,
         'region':         process.env.OS_REGION_NAME
         */
    }
});


const COMMANDS = {

    stat(target) {
        return function stat() {
            // Superfluous command arguments are a noop.
            if (arguments.length) {
                return stat;
            }

            target.getMetadata(function (err, result) {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log(result);
            });
        }
    },

    list(target) {
        return function list() {
            // Superfluous command arguments are a noop.
            if (arguments.length) {
                return list;
            }

            target.list(function (err, result) {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(result);
            });
        }
    },

    download(target) {
        return function download() {
            // Superfluous command arguments are a noop.
            if (arguments.length) {
                return download;
            }

            target.getStream(function (err, stream, settings) {
                if (err) {
                    console.error(err);
                    return;
                }

                if (settings.contentType === 'text/plain') {
                    stream.setEncoding('utf8');
                }

                stream.pipe(process.stdout);
            });
        }
    },

    post: function (arg) {

    },

    delete: function (arg) {

    }

};



let swifft = Swifft.create(argv);

let command = function (cmd) {

    switch (cmd) {
        case 'list':
            return function (container) {
                let operation = COMMANDS.list(swifft);

                if (container) {
                    swifft = swifft.container(container);
                    operation = COMMANDS.list(swifft);
                    return operation;
                }

                operation();
            };

        case 'stat':
            return function (container) {
                let operation = COMMANDS.stat(swifft);

                if (container) {
                    swifft = swifft.container(container);
                    operation = COMMANDS.stat(swifft);

                    return function (object) {
                        if (object) {
                            swifft = swifft.object(object);
                            operation = COMMANDS.stat(swifft);
                            return operation;
                        }

                        operation();
                    };
                }

                operation();
            };

        case 'download':
            return function (container) {
                swifft = swifft.container(container);

                return function (object) {
                    swifft = swifft.object(object);
                    return COMMANDS.download(swifft);
                };
            };

        default:
            console.log('Usage...');
    }
};


for (let current of argv._) {
    command = command(current);
}

command();