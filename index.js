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
function mgsPackResponse() {

  return function _mgsPackResponse(req, res, next) {
    if (shouldMsgPack(req)) {
      console.log(res.json);

      res.json = function(jsonResponse) {
        console.log(jsonResponse);
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
function shouldMsgPack(req) {
  var acceptType = req.get('accept');

  return !_.isNil(acceptType) && acceptType === 'application/x-msgpack';
}

/**
 * Module exports.
 * @public
 */
module.exports = mgsPackResponse;
