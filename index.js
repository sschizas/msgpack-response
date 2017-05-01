/*!
 * msgpack-response
 * Copyright(c) 2017 Mobiltron Inc
 * MIT Licensed
 */


/**
 * Module dependencies.
 */
const _ = require('lodash');
const mung = require('express-mung');
const msgpackLite = require('msgpack-lite');

/**
 * Module variables.
 * @private
 */
var cacheControlNoTransformRegExp = /(?:^|,)\s*?no-transform\s*?(?:,|$)/;


/**
 * Transform response data using msgpack.
 *
 * @return {Function} middleware
 * @public
 */
function msgpack (body, req, res) {
  //Check if it is JSON otherwise don't bother to msgpack it.
  if (isJSON(body) === false) {
    return body;
  }

  //Check for cache-control.
  if (shouldTransform(res) === false) {
    return body;
  }

  //Check if msgpack is supported by client.
  if (isMgsPackSupported(req) === false) {
    return body;
  }

  //Msgpack body
  var encodedBody = msgpackLite.encode(body);

  // header fields
  res.removeHeader('Content-Length');
  res.set('Content-Type', 'application/x-msgpack');
  return encodedBody.data;
}


function isJSON(obj) {
  if(obj instanceof Array || obj instanceof Object) {
    return true
  }
  return false
}

/**
 * Determine if the request supports msgpack.
 * @private
 */
function isMgsPackSupported (req) {
  var acceptType = req.header('accept');
  return _.isNil(acceptType) === false && acceptType === 'application/x-msgpack'
}


/**
 * Determine if the entity should be transformed.
 * @private
 */
function shouldTransform (res) {
  var cacheControl = res.header['cache-control'];

  // Don't compress for Cache-Control: no-transform
  // https://tools.ietf.org/html/rfc7234#section-5.2.2.4
  return _.isNil(cacheControl) === false || !cacheControlNoTransformRegExp.test(cacheControl);
}


/**
 * Module exports.
 */

module.exports = mung.json(msgpack);
