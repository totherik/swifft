import test from 'tape'
import concat from 'concat-stream';
import Swifft from '../';


test('object', t => {

    let cname = String(Math.random());
    let oname = 'foo.txt';


    t.test('create', t => {

        let account = Swifft.create();
        let container = account.container(cname);
        container.create(function (err) {
            t.error(err);

            container.object(oname).create('foo\n', function (err, data) {
                t.error(err);
                t.ok(data);
                t.end();
            });
        });

    });


    t.test('create w/ settings', t => {

        let account = Swifft.create();
        let container = account.container(cname);
        container.create(function (err) {
            t.error(err);

            container.object(oname).create('foo\n', { metadata: { foo: 'bar' } }, function (err, data) {
                t.error(err);
                t.ok(data);
                t.end();
            });
        });

    });


    t.test('get', t => {

        let account = Swifft.create();
        account.container(cname).object(oname).get(function (err, content, settings) {
            t.error(err);

            t.ok(settings);
            t.equal(settings.metadata.foo, 'bar');

            t.ok(content);
            t.equal(content.toString('utf8'), 'foo\n');

            t.end();
        });

    });



    t.test('getRange', t => {

        let account = Swifft.create();
        account.container(cname).object(oname).getRange('bytes=0-1', function (err, stream, settings) {
            t.error(err);

            t.ok(settings);
            t.equal(settings.metadata.foo, 'bar');

            t.ok(stream);
            t.equal(stream.length, 2);
            t.equal(stream.toString('utf8'), 'fo');
            t.end();

        });

    });


    t.test('getStream', t => {

        let account = Swifft.create();
        account.container(cname).object(oname).getStream(function (err, stream, settings) {
            t.error(err);

            t.ok(settings);
            t.equal(settings.metadata.foo, 'bar');

            t.ok(stream);
            stream.pipe(concat(data => {
                t.equal(data.toString('utf8'), 'foo\n');
                t.end();
            }));
        });

    });


    t.test('getStream with range', t => {

        let account = Swifft.create();
        account.container(cname).object(oname).getStream('bytes=0-1', function (err, stream, settings) {
            t.error(err);

            t.ok(settings);
            t.equal(settings.metadata.foo, 'bar');

            t.ok(stream);
            stream.pipe(concat(data => {
                t.equal(data.toString('utf8'), 'fo');
                t.end();
            }));
        });

    });



    t.test('copy', t => {

        let account = Swifft.create();
        let container = account.container(cname);
        container.object(oname).copy({ object: 'foo2.txt' }, function (err, data) {
            t.error(err);
            t.ok(data);

            container.object('foo2.txt').get(function (err, content, settings) {
                t.error(err);

                t.ok(settings);
                t.equal(settings.metadata.foo, 'bar');

                t.ok(content);
                t.equal(content.toString('utf8'), 'foo\n');

                t.end();
            });
        });

    });


    t.test('getMetadata', t => {

        Swifft.create().container(cname).object(oname).getMetadata(function (err, settings) {
            t.error(err);
            t.ok(settings);
            t.equal(settings.metadata.foo, 'bar');
            t.end();
        });

    });


    t.test('updateMetadata', t => {

        let object = Swifft.create().container(cname).object(oname);
        object.updateMetadata({ metadata: { foo: 'baz' } }, function (err, settings) {
            t.error(err);
            t.ok(settings);

            object.getMetadata(function (err, settings) {
                t.error(err);
                t.ok(settings);
                t.equal(settings.metadata.foo, 'baz');
                t.end();
            });
        });

    });


    t.test('delete', t => {

        let container = Swifft.create().container(cname);
        container.object(oname).delete(function (err, data) {
            t.error(err);
            t.ok(data);
            t.ok(data.transId);
            t.end();
        });

    });


});
