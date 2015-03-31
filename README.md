swifft
======
An OpenStack Swift Client npm module and CLI.

## Basic Usage
#### Programmatic API
```js
import Swifft from 'swifft';

// These are the default env vars used internally by swifft.
// Usage here is for demonstration purposes only.
let options = {
    auth_url =    process.env.OS_AUTH_URL,
    tenant_id =   process.env.OS_TENANT_ID,
    tenant_name = process.env.OS_TENANT_NAME,
    region =      process.env.OS_REGION_NAME,
    username =    process.env.OS_USERNAME,
    password =    process.env.OS_PASSWORD
}


let account = Swifft.create(options);

// List containers
account.list((err, containers) => {
    // Print all container names and size
    for (let { name, bytes } of containers) {
        console.log(`${name}: ${bytes}`);
    }

    // List contents of first container.
    let [ { name: first } ] = container;
    account.container(first).list((err, objects) => {
        for (let { name, bytes } of objects) {
            console.log(`${name}: ${bytes}`);
        }
    });
});
```

#### CLI
```bash
$ source ~/openrc.sh

$ swifft list
[ { count: 1, bytes: 4, name: 'foo' },
  { count: 1, bytes: 4, name: 'bar' } ]

$ swift list foo
[ { hash: '<hash>',
    last_modified: '<date>',
    bytes: 4,
    name: 'foo2.txt',
    content_type: 'text/plain' } ]
```


## API
### Swifft
#### `create([options])`
Returns an Account instance.

### Account

#### `getMetadata(callback)`
Retrieve metadata for the current account.

#### `updateMetadata(metadata, callback)`
Set metadata for the current account.

#### `list([options], callback)`
List containers for the current account.

#### `container(name)`
Get the named container. Returns a Container instance.


### Container
#### `getMetadata(callback)`
Retrieve metadata for the current container.

#### `updateMetadata(metadata, callback)`
Set metadata for the current container.

#### `list([options], callback)`
List objects in the current container.

#### `delete(callback)`
Delete the current container.

#### `object(name)`
Get the named object. returns an Object instance.


### Object
#### `get(callback)`
Get the contents and settings of the current object.

### `getStream()`
Get the contents as a readable stream and settings of the current object.

#### `getMetadata(callback)`
Retrieve metadata for the current object.

#### `updateMetadata(metadata, callback)`
Set metadata for the current object.

#### `copy(dest, callback)`
Copy the current object to the provided destination: { container, object }.

#### `delete(callback)`
Delete the current object.


## CLI Commands
