var q = require('q');
var mongoose = require('mongoose'); // Build theconnection string
var dbURI = 'mongodb://localhost/nnwDB'; // for use when in nitrious
var dbRemote = "mongodb://nnwUser:JohnPurple#cake!99@ds061711.mongolab.com:61711/nnw";

mongoose.connection.on('connected',    function ()    { console.log('\n\nMongoose default connection open to %s\n', dbURI); });
mongoose.connection.on('error',        function (err) { console.log('\n\nMongoose default connection error: %s\n', err); });
mongoose.connection.on('disconnected', function ()    { console.log('\n\nMongoose default connection disconnected\n'); });

var Feed = require('../models/feeds');

exports.getFeedId = function(content) {
  
  var d = q.defer();
  try {
    //   * "content"      - {name, source, link}
    Feed.find(content).limit(1).exec(function(err, results) {
      if(err) { console.log("Feeds.find() err: %s", err); }
      // if no results (length = 0)
      console.log(JSON.stringify(results, null, 2));
      if(results.length === 0) {
        createFeedEntry(content).then(
          function(result) {
            console.log('feed entry created, id: %s', result);
            d.resolve(result);
          },
          function(err) {
            console.log("createFeedEntry().Feed.save() err: %s", err);
            d.reject(err);
          }
        );
      } else {
        console.log("feed found, id: %s", result[0]._id);
      }
    });
  } catch(ex) {console.log('getFeedId() ex: %s', ex);}
  return d.promise;
};

/**
something is wrong with the writing.. i'm guessing here that it has more to do
with how the db connection is created..   just a guess, ponder a control system
to handle a connection..
**/

createFeedEntry = function(content) {
  console.log('createdFeedEntry()...');
  var d = q.defer();
  var f = Feed(content);
  console.log('f: %s', JSON.stringify(f,null,2));
  f.save(function(err) {
    if(err) { d.reject(err); } // duh
    else {
      console.log('f: saved successfully');
      d.resolve(f);
    } // send back the id of the entry so it can be included in the search db entry
  });
  return d.promise;
};