import test from 'tape'
import Swifft from '../';


test('account', t => {

    t.test('create', t => {

        let account = Swifft.create();
        t.equal(typeof account, 'object');
        t.equal(typeof account.authenticate, 'function');
        t.equal(typeof account.getMetadata, 'function');
        t.equal(typeof account.updateMetadata, 'function');
        t.equal(typeof account.listContainers, 'function');
        t.end();

    });


    t.test('authenticate', t => {

        let account = Swifft.create({ username: null, password: null });
        account.authenticate();
        account.auth.then(function (token) {
            t.ok(token);
            t.ok(token.id);
            t.end();
        }, t.error);

    });


    t.test('getMetadata', t => {

        let account = Swifft.create();
        account.getMetadata(function (err, metadata) {
            t.error(err);
            t.equal(typeof metadata, 'object');
            t.notEqual(metadata, null);
            t.end();
        });

    });


    t.test('updateMetadata', t => {

        let account = Swifft.create();
        let value = Math.random();

        account.updateMetadata({ metadata: { 'test': value } }, function (err, data) {
            t.error(err);
            t.ok(data);

            account.getMetadata(function (err, data) {
                t.error(err);
                t.ok(data);
                t.ok(data.metadata);
                t.equal(data.metadata.test, String(value));
                t.end();
            });
        });

    });


    t.test('listContainers', t => {

        let account = Swifft.create();
        account.listContainers(function (err, containers) {
            t.error(err);
            t.ok(containers);
            t.ok(Array.isArray(containers));
            t.end();
        });

    });

});