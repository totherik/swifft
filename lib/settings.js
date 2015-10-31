import { entries } from './iterator.js';


const ACCOUNT_SETTINGS = Object.freeze({
    tempUrlKey:        'X-Account-Meta-Temp-URL-Key',
    tempUrlkey2:       'X-Account-Meta-Temp-URL-Key-2',
    contentType:       'Content-Type',
    detectContentType: 'X-Detect-Content-Type '
});

const ACCOUNT_METADATA = Object.freeze({
    'x-account-object-count':         'objectCount',
    'x-account-container-count':      'containerCount',
    'x-account-bytes-used':           'bytesUsed',
    'x-account-meta-temp-url-key':    'tempUrlKey',
    'x-account-meta-temp-url-key-2 ': 'tempUrlKey2',
    'content-length':                 'contentLength',
    'content-type':                   'contentType',
    'x-trans-id':                     'transId'
});

const CONTAINER_SETTINGS = Object.freeze({
    readACL:           'X-Container-Read',
    writeACL:          'X-Container-Write',
    syncTo:            'X-Container-Sync-To',
    syncKey:           'X-Container-Sync-Key',
    location:          'X-Versions-Location',
    contentType:       'Content-Type',
    detectContentType: 'X-Detect-Content-Type',
    ifNoneMatch:       'If-None-Match'
});

const CONTAINER_METADATA = Object.freeze({
    'x-container-object-count': 'objectCount',
    'x-container-bytes-used':   'bytesUsed',
    'x-container-read':         'readACL',
    'x-container-write':        'writeACL',
    'x-container-sync-to ':     'syncTo',
    'x-container-sync-key ':    'syncKey',
    'x-versions-location':      'location',
    'accept-ranges':            'acceptRanges',
    'content-length':           'contentLength',
    'content-type':             'contentType',
    'x-trans-id':               'transId'
});

const OBJECT_SETTINGS = Object.freeze({
    deleteAt:           'X-Delete-At',
    contentDisposition: 'Content-Disposition',
    contentEncoding:    'Content-Encoding',
    deleteAfter:        'X-Delete-After',
    contentType:        'Content-Type',
    detectContentType:  'X-Detect-Content-Type',
    'range':             'range',
});

const OBJECT_METADATA = Object.freeze({
    'last-modified':         'lastModified',
    'content-length':        'contentLength',
    'content-type':          'contentType',
    'range':                 'range',
    'etag':                  'etag',
    'content-encoding':      'contentEncoding',
    'content-disposition':   'contentDisposition',
    'x-delete-at':           'deleteAt',
    'x-object-manifest':     'objectManifest',
    'x-static-large-object': 'staticLargeObject',
    'x-trans-id':            'transId'
});

function encode(value) {
    let buffer = new Buffer(String(value));
    return encodeURI(buffer.toString('utf8'));
}


// NOTE: A TON of duplication here. Can be cleaned up.
export default {

    AccountSettings: {

        toHeaders(settings = {}) {
            let { metadata = {} } = settings;

            let headers = {};
            for (let [ key, value ] of entries(metadata)) {
                headers[`X-Account-Meta-${key}`] = encode(value);
            }

            for (let [ key, value ] of entries(ACCOUNT_SETTINGS)) {
                if (key in settings) {
                    headers[value] = encode(settings[key]);
                }
            }

            return headers;
        },

        fromHeaders(headers = {}) {
            let settings = { metadata: {} };

            for (let [ key, value ] of entries(headers)) {
                let match = key.match(/^x-account-meta-(.*)/);
                if (match && match.length > 1) {
                    settings.metadata[match[1]] = value;
                }
            }

            for (let [ key, value ] of entries(ACCOUNT_METADATA)) {
                settings[value] = headers[key];
            }

            return settings;
        }

    },

    ContainerSettings: {

        toHeaders(settings = {}) {
            let { metadata = {} } = settings;

            let headers = {};
            for (let [ key, value ] of entries(metadata)) {
                headers[`X-Container-Meta-${key}`] = encode(value);
            }

            for (let [ key, value ] of entries(CONTAINER_SETTINGS)) {
                if (key in settings) {
                    headers[value] = encode(settings[key]);
                }
            }

            return headers;
        },

        fromHeaders(headers = {}) {
            let settings = { metadata: {} };

            for (let [ key, value ] of entries(headers)) {
                let match = key.match(/^x-container-meta-(.*)/);
                if (match && match.length > 1) {
                    settings.metadata[match[1]] = value;
                }
            }

            for (let [ key, value ] of entries(CONTAINER_METADATA)) {
                settings[value] = headers[key];
            }

            return settings;
        }

    },

    ObjectSettings: {

        toHeaders(settings = {}) {
            let { metadata = {} } = settings;

            let headers = {};
            for (let [ key, value ] of entries(metadata)) {
                headers[`X-Object-Meta-${key}`] = encode(value);
            }

            for (let [ key, value ] of entries(OBJECT_SETTINGS)) {
                if (key in settings) {
                    headers[value] = encode(settings[key]);
                }
            }

            return headers;
        },

        fromHeaders(headers = {}) {
            let settings = { metadata: {} };

            for (let [ key, value ] of entries(headers)) {
                let match = key.match(/^x-object-meta-(.*)/);
                if (match && match.length > 1) {
                    settings.metadata[match[1]] = value;
                }
            }

            for (let [ key, value ] of entries(OBJECT_METADATA)) {
                settings[value] = headers[key];
            }

            return settings;
        }

    }

}