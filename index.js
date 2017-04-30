/*!
 * msgpack-response
 * Copyright(c) 2017 Mobiltron Inc
 * MIT Licensed
 */


/**
 * Module dependencies.
 */
const _ = require('lodash');
const typeis = require('type-is');
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
  //Check for cache-control
  if (shouldTransform(req, res) === false) {
    return body;
  }

  //Check if msgpack is supported by client
  if (isMgsPackSupported(req, res) === false) {
    return body;
  }


}


/**
 * Determine if the request supports msgpack.
 * @private
 */
function isMgsPackSupported (req, res) {
  return _.isNil(req.headers['accept']) === false && req.headers['accept'] === 'application/x-msgpack'
}


/**
 * Determine if the entity should be transformed.
 * @private
 */
function shouldTransform (req, res) {
  var cacheControl = res.headers['Cache-Control'];

  // Don't compress for Cache-Control: no-transform
  // https://tools.ietf.org/html/rfc7234#section-5.2.2.4
  return _.isNil(cacheControl) === false || !cacheControlNoTransformRegExp.test(cacheControl);
}


/**
 * Module exports.
 */

module.exports = mung.jsonAsync(msgpack);
