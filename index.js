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
 * @param {Object} [options]
 * @return {Function} middleware
 * @public
 */
function msgpack (options) {

  return function compression (req, res, next) {


    next()
  }
}


/**
 * Determine if the response body is JSON.
 * @private
 */
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

module.exports = msgpack;
