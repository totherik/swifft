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
        'os_auth_url':    process.env.OS_AUTH_URL,
        'os_tenant_id':   process.env.OS_TENANT_ID,
        'os_tenant_name': process.env.OS_TENANT_NAME,
        'os_username':    process.env.OS_USERNAME,
        'os_password':    process.env.OS_PASSWORD,
        'region':         process.env.OS_REGION_NAME
    }
});



let swifft = Swifft.create(argv);
swifft.authenticate();
swifft.container('npmjs').object('foo.txt').getMetadata(function (err, data) {
    if (err) {
        console.error(err);
        return;
    }
    console.log(data);
});

//swifft.authenticate((err, ...args) => {
//    console.log(err);
//    if (args.length) {
//        console.log(args[0].access);
//    }
//
//    let opts = {
//        container: 'npmjs',
//        object: 'swifft-1.0.0.tgz',
//        payload: Fs.createReadStream('./swifft-1.0.0.tgz')
//    };
//
//    swifft.account().getMetadata(fn);
//    swifft.account().updateMetadata({}, fn);
//    swifft.account().listContainers({}, fn);
//
//
//    swifft.container('npmjs').create({}, fn);
//    swifft.container('npmjs').delete(fn);
//    swifft.container('npmjs').getMetadata(fn);
//    swifft.container('npmjs').updateMetadata({}, fn);
//    swifft.container('npmjs').listObjects({}, fn);
//
//
//    swifft.container('npmjs').object('name').getContent({}, fn);
//    swifft.container('npmjs').object('name').getContentStream({}, fn);
//    swifft.container('npmjs').object('name').getMetadata(fn);
//    swifft.container('npmjs').object('name').updateMetadata({}, fn);
//    swifft.container('npmjs').object('name').create({}, fn);
//    swifft.container('npmjs').object('name').copy({}. fn);
//    swifft.container('npmjs').object('name').delete(fn);
//
//
//    swifft.listObjects({ container: 'npmjs' }, (err, data) => {
//        if (err) {
//            console.error(err);
//            return;
//        }
//        console.log(data);
//    });
//
//    //swifft.createObject(opts, (err, res) => {
//    //    if (err) {
//    //        console.error(err);
//    //        return;
//    //    }
//    //    console.log(res);
//    //});
//
//    //swifft.getAccountMetadata((err, data) => {
//    //    if (err) {
//    //        console.error(err);
//    //        return;
//    //    }
//    //    console.log(data);
//    //});
//
//    //swifft.listContainers(null, (err, data) => {
//    //    if (err) {
//    //        console.error(err);
//    //        return;
//    //    }
//    //    console.log(data);
//    //});
//
//    //swifft.getContainerMetadata({ container: 'npmjs' }, (err, data) => {
//    //    if (err) {
//    //        console.error(err);
//    //        return;
//    //    }
//    //    console.log(data);
//    //});
//
//    //swifft.copyObject({ container: 'npmjs', object: 'test.txt' }, { object: 'foo.txt' }, (err, payload) => {
//    //    if (err) {
//    //        console.error(err);
//    //        return;
//    //    }
//    //    console.log(payload);
//    //    //readable.pipe(Fs.createWriteStream('./test.txt'));
//    //});
//
//
//    //swifft.deleteObject({ container: 'npmjs', object: 'baz.txt' }, (err, payload) => {
//    //    if (err) {
//    //        console.error(err);
//    //        return;
//    //    }
//    //    console.log(payload);
//    //});
//});
