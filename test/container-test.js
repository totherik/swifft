import test from 'tape'
import Swifft from '../';


test('container', t => {

    let name = String(Math.random());

    t.test('create', t => {
        let container = Swifft.create().container(name);
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
        container.listObjects(function (err, data) {
            t.error(err);
            t.ok(Array.isArray(data));
            t.end();
        });

    });


    t.test('listObjects w/ criteria', t => {

        let container = Swifft.create().container(name);
        container.listObjects({ limit: 1 }, function (err, data) {
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