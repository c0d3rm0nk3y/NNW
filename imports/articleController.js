var mongoose = require('mongoose');
// Build the connection string
var dbURI = 'mongodb://localhost/nnwDB';

var Search = require('../models/search');

exports.get = function(articleUrl) {
  // check if url exists, if not create db entry
}

exports.remove = function(url) {}

exports.update = function(udpatedArticle) {}
