var q = require('q');
// var mongoose = require('mongoose'); // Build theconnection string
// var dbURI = 'mongodb://localhost/nnwDB'; // for use when in nitrious
// var dbRemote = "mongodb://nnwUser:JohnPurple#cake!99@ds061711.mongolab.com:61711/nnw";

// mongoose.connection.on('connected',    function ()    { console.log('\n\nMongoose default connection open to %s\n', dbURI); });
// mongoose.connection.on('error',        function (err) { console.log('\n\nMongoose default connection error: %s\n', err); });
// mongoose.connection.on('disconnected', function ()    { console.log('\n\nMongoose default connection disconnected\n'); });

// stop with worrying about the feed controller.. its all going to come back as news.google.com.....xml


var Feed = require('../models/feeds');

exports.getFeedId = function(content) {
  //console.log("getFeedId(%s)",JSON.stringify(content,null,2));
  var d = q.defer();
  //mongoose.connect(dbURI);
    
  try {
    //   * "content"      - {name, source, link} **
    
    console.log("%s",JSON.stringify(content,null,2));
    Feed.find(content).limit(1).exec(function(err, results) {
      if(err) { console.log("Feeds.find() err: %s", err); }
      else if(results.length === 0) {
        createFeedEntry(content).then(
          function(result) { d.resolve(result); },
          function(err)    { d.reject(err); }
        );
      } else {
        d.resolve(results[0]._id);
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
  //console.log('createdFeedEntry()...');
  var d = q.defer();
  f = Feed({
    name: content.name,
    source: content.source,
    link: content.link
  });
  
  //console.log('f: %s', JSON.stringify(f,null,2));
  try {
    f.save(function(err) {
      console.log('f.save()..');
      if(err) { d.reject(err); } // duh
      else    { d.resolve(f);  } // send back the id of the entry so it can be included in the search db entry
    });
  } catch(ex) { d.reject(ex); }
  return d.promise;
};