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
 * Transform response data using msgpack.
 *
 * @return {Function} middleware
 * @public
 */
function mgsPackResponse() {

  return function _mgsPackResponse(req, res, next) {
    if (shouldMsgPack(req, res)) {
      res.json = function(jsonResponse) {
        res.setHeader('Content-Type', 'application/x-msgpack');
        res.removeHeader('Content-Length');
        res.send(msgpackLite.encode(jsonResponse));
      };
    }

    next();
  };
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
 * Module exports.
 * @public
 */
module.exports = mgsPackResponse;
