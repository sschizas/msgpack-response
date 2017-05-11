# msgpack-response
[![Build Status](https://travis-ci.org/MobiltronInc/msgpack-response.svg?branch=master)](https://travis-ci.org/MobiltronInc/msgpack-response)
[![Dependency Status](https://david-dm.org/MobiltronInc/msgpack-response.svg)](https://github.com/MobiltronInc/msgpack-response)

An implementation of [Message Pack](http://msgpack.org/) middleware for [ExpressJS](https://expressjs.com/).

__Features__

* Automatic Message Pack detection (from the HTTP headers) and encoding of all JSON messages to Message Pack.
* Extension of the current ExpressJS API; Introducing the `Response.msgPack(jsObject)` method on the standard [ExpressJS Response](https://expressjs.com/en/4x/api.html#res) object.

## Getting Started
With auto-detection and transformation enabled, the middleware detects automatically the HTTP header `Accept: application/x-msgpack` and piggybacks the `Response.json()` method of the ExpressJS API, to encode the JSON response as Message Pack. This method is usefull, when you have existing applications that need use the middleware, without changing the codebase very much.

```javascript
const msgpackResponse = require('msgpack-response');

app.use(msgpackResponse({auto_detect: true}));

app.get('/test_json', (req, res) {
	res.status(200).json({'messsage': 'a true test'});
})
```

> Note: Remember the add the header `Accept: application/x-msgpack` in the request.

Also it can have auto detection and transformation disabled. The middleware extends the `Response` object of the ExpressJS framework, by adding the `msgPack()` method to it. Then to return an encoded response, you just use the `Response.msgPack()` method that accepts the Javascript object as parameter. For example,

```javascript
const msgpackResponse = require('msgpack-response');

app.use(msgpackResponse({auto_detect: false}));
//or
app.use(msgpackResponse());

app.get('/test_msgpack', (req, res) {
	res.status(200).msgPack({'messsage': 'a true test'});
});
```

> Note: Intialize the middleware before the actual routes in the middleware chain to properly extend the `Response` Object.

## Requirements
Node.js >= 6.0

## Installation

With [npm](https://www.npmjs.com/) do:

```bash
npm install msgpack-response -save
```

## About
[<img src="https://github.com/mobiltroninc/Foundation/blob/master/ASSETS/mobiltron_square.png?raw=true" width="70" />](http://mobiltron.com/)

This project is funded and maintained by [Mobiltron, Inc.](http://mobiltron.com). We :heart: open source software!

Check out our other [open source projects](https://github.com/mobiltroninc/) or say :wave: on twitter [@mobiltron](https://twitter.com/mobiltron).

## Contribute

Contributions are welcome :metal: We encourage developers like you to help us improve the projects we've shared with the community. Please see the [Contributing Guide](https://github.com/mobiltroninc/Foundation/blob/master/CONTRIBUTING.md) and the [Code of Conduct](https://github.com/mobiltroninc/Foundation/blob/master/CONDUCT.md).

## Authors

* **Stavros Schizas** - *Initial work* - [Mobiltron, Inc.](http://mobiltron.com)
* **Vassilios Karakoidas** - *Initial work* - [Mobiltron, Inc.](http://mobiltron.com)

See also the list of [contributors](https://github.com/MobiltronInc/msgpack-response/contributors) who participated in this project.

## License

msgpack-response is available under the MIT license. See the [LICENSE](LICENSE.md) file for more info.
