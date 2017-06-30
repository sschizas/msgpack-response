/*!
 * msgpack-response
 * Copyright(c) 2017-present Mobiltron Inc
 * MIT Licensed
 */


/**
 * Module dependencies.
 */
const _ = require('lodash');
const msgpack = require('msgpack');


/**
 * Transform response data using msgpack.
 *
 * @return {Function} middleware
 * @public
 */
function mgsPackResponse(options) {
  let autoDetect = false;

  if (!_.isUndefined(options)) {
    autoDetect = options.auto_detect || false;
  }

  return function _mgsPackResponse(req, res, next) {
    if (shouldMsgPack(req) && autoDetect) {
      res.json = function(jsObject) {
        var obj = jsObject;
        var encodedResponse = msgpack.pack(obj);
        res.setHeader('Content-Type', 'application/x-msgpack');
        res.removeHeader('Content-Length');
        res.setHeader('Content-Length', _.size(encodedResponse));
        res.send(encodedResponse);
      }
    }

    res.msgPack = function(jsObject) {
      var obj = jsObject;
      var encodedResponse = msgpack.pack(obj);
      res.setHeader('Content-Type', 'application/x-msgpack');
      res.setHeader('Content-Length', _.size(encodedResponse));
      res.send(encodedResponse);      
    };

    next();
  };
}

/**
 * Default filter function.
 * @private
 */
function shouldMsgPack(req) {
  let acceptType = req.get('accept');
  return !_.isNil(acceptType) && acceptType === 'application/x-msgpack';
}

/**
 * Module exports.
 * @public
 */
module.exports = mgsPackResponse;
