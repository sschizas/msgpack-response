# msgpack-response
[![Build Status](https://travis-ci.org/sschizas/msgpack-response.svg?branch=master)](https://travis-ci.org/sschizas/msgpack-response)
[![Dependency Status](https://david-dm.org/sschizas/msgpack-response.svg)](https://github.com/sschizas/msgpack-response)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)](CODE_OF_CONDUCT.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An implementation of [Message Pack](http://msgpack.org/) middleware for [ExpressJS](https://expressjs.com/).

__Features__

* Automatic Message Pack detection (from the HTTP headers) and encoding of all JSON messages to Message Pack.
* Extension of the current ExpressJS API; Introducing the `Response.msgPack(jsObject)` method on the standard [ExpressJS Response](https://expressjs.com/en/4x/api.html#res) object.

## Getting Started
With auto-detection and transformation enabled, the middleware detects automatically the HTTP header `Accept: application/x-msgpack` and piggybacks the `Response.json()` method of the ExpressJS API, to encode the JSON response as Message Pack. This method is useful when you have existing applications that need to use the middleware, without changing the codebase very much.

```javascript
const msgpackResponse = require('msgpack-response');

app.use(msgpackResponse({auto_detect: true}));

app.get('/test_json', (req, res) => {
	res.status(200).json({'message': 'a true test'});
})
```

> Note: Remember to add the header `Accept: application/x-msgpack` in the request.

Also, it can have auto-detection and transformation disabled. The middleware extends the `Response` object of the ExpressJS framework, by adding the `msgPack()` method to it. Then to return an encoded response, you just use the `Response.msgPack()` method that accepts the Javascript object as a parameter. For example,

```javascript
const msgpackResponse = require('msgpack-response');

app.use(msgpackResponse({auto_detect: false}));
//or
app.use(msgpackResponse());

app.get('/test_msgpack', (req, res) => {
	res.status(200).msgPack({'message': 'a true test'});
});
```

> Note: Initialize the middleware before the actual routes in the middleware chain to properly extend the `Response` Object.

## Requirements
Node.js >= 6.0

## Installation

With [npm](https://www.npmjs.com/) do:

```bash
npm install msgpack-response -save
```

## About
I :heart: open source software!

Check out my other [open source projects](https://github.com/sschizas) or say :wave: on [twitter](https://twitter.com/StavrosSchizas).

## Contribute

Contributions are welcome :metal:. Please see the [Contributing Guide](https://github.com/sschizas/msgpack-response/blob/master/CONTRIBUTING.md) and the [Code of Conduct](https://github.com/sschizas/msgpack-response/blob/master/CODE_OF_CONDUCT.md).

## Authors

* **Stavros Schizas** - *Initial work & Maintainer*
* **Vassilios Karakoidas** - *Initial work* - [Wizhut](http://bkarak.wizhut.com)

See also the list of [contributors](https://github.com/sschizas/msgpack-response/graphs/contributors) who participated in this project.

## License

msgpack-response is available under the MIT license. See the [LICENSE](LICENSE.md) file for more info.
