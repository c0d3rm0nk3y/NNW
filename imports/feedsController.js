var q = require('q');
var mongoose = require('mongoose'); // Build theconnection string
var dbURI = 'mongodb://localhost/nnwDB'; // for use when in nitrious
var dbRemote = "mongodb://nnwUser:JohnPurple#cake!99@ds061711.mongolab.com:61711/nnw";

mongoose.connection.on('connected', function () { console.log('\n\nMongoose default connection open to %s\n', dbURI); });
mongoose.connection.on('error',function (err) { console.log('\n\nMongoose default connection error: %s\n', err); });
mongoose.connection.on('disconnected', function () { console.log('\n\nMongoose default connection disconnected\n'); });


exports.getFeedId = function(content) {
  try {
    
  } catch(ex) {console.log('getFeedId() ex: %s', ex);}
};