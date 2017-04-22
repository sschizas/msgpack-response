/*!
 * msgpack-response
 * Copyright(c) 2017 Mobiltron Inc
 * MIT Licensed
 */


/**
 * Module dependencies.
 */
var _ = require('lodash');
var typeis = require('type-is');
var msgpackLite = require('msgpack-lite');


module.exports = function(options) {
  return function(req, res, next) {

    // Check if we have all requirements in place.
    if (typeis(res, ['application/json']) === false || !typeis.hasBody(res) || isMgsPackSupported(req) === false) {
      return next()
    }
    
    var accept = req.headers['accept-encoding']
      , write = res.write
      , end = res.end
      , compress = true
      , stream;

    // Implement the middleware function

    next()
  };
};


function isMgsPackSupported(req) {
  return _.isNil(req.headers['accept']) === false && req.headers['accept'] === 'application/x-msgpack'
}
