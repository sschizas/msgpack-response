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
        return false;
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

    res.on = function on(type, listener) {
      if (!listeners || type !== 'drain') {
        return _on.call(this, type, listener)
      }

      if (stream) {
        return stream.on(type, listener)
      }

      // buffer listeners for future stream
      listeners.push([type, listener]);

      return this;
    };

    function noMsgPacking() {
      addListeners(res, _on, listeners);
      listeners = null;
    }

    onHeaders(res, function onResponseHeaders () {
      if (!shouldMsgPack(req, res)) {
        noMsgPacking();
        return;
      }

      // already msg packed
      if (res.get('Content-Type') === 'application/json') {
        noMsgPacking();
        return;
      }

      // head
      if (req.method === 'HEAD') {
        noMsgPacking();
        return;
      }

      stream = msgpackLite.createEncodeStream();

      addListeners(stream, stream.on, listeners);

      res.setHeader('Content-Type', 'application/x-msgpack');
      res.removeHeader('Content-Length');
      
      stream.on('data', function onStreamData (chunk) {
        if (_write.call(res, chunk) === false) {
          stream.pause()
        }
      });
      
      stream.on('end', function onStreamEnd () {
         _end.call(res)
      });
      
      _on.call(res, 'drain', function onResponseDrain () {
        stream.resume();
      });
    });

    next();
  }
}

function chunkLength (chunk, encoding) {
  if (!chunk) {
    return 0
  }

  return !Buffer.isBuffer(chunk)
    ? Buffer.byteLength(chunk, encoding)
    : chunk.length
}

/**
 * Default filter function.
 * @private
 */
function shouldMsgPack(req, res) {
  var acceptType = req.get('accept');
  var type = res.get('Content-Type');

  return _.isNil(acceptType) === false && acceptType === 'application/x-msgpack' && _.isNil(type) === false && type.match(/application\/json/)[0] === 'application/json';
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
