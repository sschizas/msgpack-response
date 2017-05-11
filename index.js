/*!
 * msgpack-response
 * Copyright(c) 2017 Mobiltron Inc
 * MIT Licensed
 */


/**
 * Module dependencies.
 */
const _ = require('lodash');
const msgpackLite = require('msgpack-lite');


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
    if (shouldMsgPack(req, res)) {
      if (autoDetect) {
        res.json = function(jsObject) {
          res.setHeader('Content-Type', 'application/x-msgpack');
          res.removeHeader('Content-Length');
          var encodedResponse = msgpackLite.encode(jsObject);
          res.setHeader('Content-Length', _.size(encodedResponse));
          res.send(encodedResponse);
        }
      };
    }

    res.msgPack = function(jsObject) {
      res.setHeader('Content-Type', 'application/x-msgpack');
      var encodedResponse = msgpackLite.encode(jsObject);
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
  var acceptType = req.get('accept');

  return !_.isNil(acceptType) && acceptType === 'application/x-msgpack';
}

/**
 * Module exports.
 * @public
 */
module.exports = mgsPackResponse;
