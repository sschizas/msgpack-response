/*!
 * msgpack-response
 * Copyright(c) 2017 Mobiltron Inc
 * MIT Licensed
 */


/**
 * Module dependencies.
 */
const _ = require('lodash');
const onHeaders = require('on-headers')
const msgpackLite = require('msgpack-lite');

/**
 * Module variables.
 * @private
 */
var cacheControlNoTransformRegExp = /(?:^|,)\s*?no-transform\s*?(?:,|$)/;


/**
 * Transform response data using msgpack.
 *
 * @param {Object} [options]
 * @return {Function} middleware
 * @public
 */
function mgsPackResponse (options) {
  var opts = options || {};
  var filter = shouldMsgPack;

  return function _mgsPackResponse(req, res, next) {
    var ended = false;
    var length;
    var listeners = [];
    var stream;
    var _end = res.end;
    var _on = res.on;
    var _write = res.write;

    // flush
    res.flush = function flush () {
      if (stream) {
        stream.flush()
      }
    };

    // proxy
    res.write = function write (chunk, encoding) {
      if (ended) {
        return false
      }

      if (!this._header) {
        this._implicitHeader()
      }
      return stream
        ? stream.write(new Buffer(chunk, encoding))
        : _write.call(this, chunk, encoding)
    };

    //end
    res.end = function end (chunk, encoding) {
      if (ended) {
        return false
      }

      if (!this._header) {
        // estimate the length
        if (!this.getHeader('Content-Length')) {
          length = chunkLength(chunk, encoding)
        }

        this._implicitHeader()
      }

      if (!stream) {
        return _end.call(this, chunk, encoding)
      }

      // mark ended
      ended = true;

      // write Buffer for Node.js 0.8
      return chunk
        ? stream.end(new Buffer(chunk, encoding))
        : stream.end()
    };

    res.on = function on (type, listener) {
      if (!listeners || type !== 'drain') {
        return _on.call(this, type, listener)
      }

      if (stream) {
        return stream.on(type, listener)
      }

      // buffer listeners for future stream
      listeners.push([type, listener]);

      return this
    };

    function noMsgPacking() {
      addListeners(res, _on, listeners);
      listeners = null
    }

    onHeaders(res, function onResponseHeaders () {
      // determine if request is filtered
      if (!filter(req, res)) {
        noMsgPacking();
        return
      }

      // determine if the entity should be transformed
      if (!shouldTransform(req, res)) {
        noMsgPacking();
        return
      }

      // already msg packed
      if (res.get('Content-Type') === 'application/x-msgpack') {
        noMsgPacking();
        return
      }

      // head
      if (req.method === 'HEAD') {
        noMsgPacking();
        return
      }

      // // msgpackLite stream
      // stream = msgpackLite.createEncodeStream();
      //
      // // add buffered listeners to stream
      // addListeners(stream, stream.on, listeners)
      //
      // // header fields
      // res.setHeader('Content-Encoding', method)
      // res.removeHeader('Content-Length')
      //
      // // compression
      // stream.on('data', function onStreamData (chunk) {
      //   if (_write.call(res, chunk) === false) {
      //     stream.pause()
      //   }
      // });
      //
      // stream.on('end', function onStreamEnd () {
      //   _end.call(res)
      // });
      //
      // _on.call(res, 'drain', function onResponseDrain () {
      //   stream.resume()
      // })

    });

    next()
  }
}


/**
 * Default filter function.
 * @private
 */
function shouldMsgPack(req, res) {
  return isMgsPackSupported(req) === true && isJSON(res) === true;
}


/**
 * Determine if the response is JSON.
 * @private
 */
function isJSON(res) {
  var type = res.get('Content-Type');
  return _.isNil(type) === false && type === 'application/json';
}


/**
 * Determine if the request supports msgpack.
 * @private
 */
function isMgsPackSupported (req) {
  var acceptType = req.get('accept');
  return _.isNil(acceptType) === false && acceptType === 'application/x-msgpack'
}


/**
 * Determine if the entity should be transformed.
 * @private
 */
function shouldTransform (res) {
  var cacheControl = res.get['cache-control'];

  // Don't compress for Cache-Control: no-transform
  // https://tools.ietf.org/html/rfc7234#section-5.2.2.4
  return _.isNil(cacheControl) === false || !cacheControlNoTransformRegExp.test(cacheControl);
}

/**
 * Add bufferred listeners to stream
 * @private
 */

function addListeners (stream, on, listeners) {
  for (var i = 0; i < listeners.length; i++) {
    on.apply(stream, listeners[i])
  }
}

/**
 * Module exports.
 * @public
 */

module.exports = mgsPackResponse;
