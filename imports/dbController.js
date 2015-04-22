var mongoose = require('mongoose'); // Build theconnection string

var dbURI = 'mongodb://localhost/nnwDB'; // for use when innitrious
var dbRemote = "mongodb://nnwUser:JohnPurple#cake!99@ds061711.mongolab.com:61711/nnw";

mongoose.connection.on('connected', function () { console.log('\n\nMongoose default connection open to ' + dbURI); });
mongoose.connection.on('error',function (err) { console.log('\n\nMongoose default connection error: ' + err); });
mongoose.connection.on('disconnected', function () { console.log('\n\nMongoose default connection disconnected'); });

exports.connectLocal  = function() { mongoose.connect(dbURI); }
exports.connectRemote = function() { mongoose.connect(dbRemote); }
exports.disconnectDB  = function() { mongoose.disconnect(); }

process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('\n\nMongoose default connection disconnected through app termination');
    process.exit(0);
  });
});