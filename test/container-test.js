import test from 'tape'
import Swifft from '../';


test('container', t => {

    let name = String(Math.random());

    t.test('create', t => {
        let container = Swifft.create().container(name);

        t.ok(container);
        t.equal(typeof container.list, 'function');
        t.equal(typeof container.create, 'function');
        t.equal(typeof container.delete, 'function');
        t.equal(typeof container.getMetadata, 'function');
        t.equal(typeof container.updateMetadata, 'function');

        container.create(function (err, data) {
            t.error(err);
            t.ok(data);
            t.end();
        });
    });


    t.test('create w/ settings', t => {

        let container = Swifft.create().container(name);
        container.create({ readACL: '.r:*' }, function (err, data) {
            t.error(err);
            t.ok(data);
            t.end();
        });

    });


    t.test('listObjects', t => {

        let container = Swifft.create().container(name);
        container.list(function (err, data) {
            t.error(err);
            t.ok(Array.isArray(data));
            t.end();
        });

    });


    t.test('listObjects w/ criteria', t => {

        let container = Swifft.create().container(name);
        container.list({ limit: 1 }, function (err, data) {
            t.error(err);
            t.ok(Array.isArray(data));
            t.end();
        });

    });


    t.test('getMetadata', t => {

        let container = Swifft.create().container(name);
        container.getMetadata(function (err, settings) {
            t.error(err);
            t.ok(settings);
            t.equal(settings.readACL, '.r:*');
            t.end();
        });

    });


    t.test('updateMetadata', t => {

        let container = Swifft.create().container(name);
        container.updateMetadata({ readACL: '' }, function (err, settings) {
            t.error(err);
            t.ok(settings);

            container.getMetadata(function (err, settings) {
                t.error(err);
                t.ok(settings);
                t.equal(settings.readACL, undefined);
                t.end();
            });
        });

    });


    t.test('delete', t => {

        let container = Swifft.create().container(name);
        container.delete(function (err, data) {
            t.error(err);
            t.ok(data);
            t.ok(data.transId);
            t.end();
        });

    });

});