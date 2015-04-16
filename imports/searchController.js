var q = require('q'); var mongoose = require('mongoose'); // Build theconnection string
var dbURI = 'mongodb://localhost/nnwDB'; // for use when innitrious
var dbRemote = "mongodb://nnwUser:JohnPurple#cake!99@ds061711.mongolab.com:61711/nnw";
var Search = require('../models/search');
var Feeds = require('../models/feeds.js');

exports.getSearchId = function(keywords) {
  var d = q.defer();
  var keywordsArray = keywords.split(" ");
  // Create the database connection
  mongoose.connect(dbURI);
  /**
    something is wrong with the if->exist function.. not catching
  ***/
  Search.find( { keywords: keywordsArray }).limit(1).exec(function(err, results){
    if(err) { console.log('\n\nSearch.find() err: %s', err); }
    else if(results.length === 0) {
      console.log('\n\nQuery of "%s" is for first time.. creating entry...', keywords);
      
      createSearch(keywordsArray).then(
        function(sId) {
          d.resolve(sId);
        }, function(err) {
          d.reject('getSearchId().createSearch() err: ' + err);
        }
      );
      
      //mongoose.connection.close(function() {});
      
    } else {
      console.log('\n\rQuery repeated:\n%s', JSON.stringify(results,null,2));
      d.resolve(results[0]);
    }
  });
  
  return d.promise;
};

createSearch = function(keywords) {
  var d = q.defer();
  console.log('createSearch(): %s...', keywords.toString());
  
  s = Search({
    keywords: keywords,
    timestamp: new Date(),
    tags : ""
  });
  
  console.log('search created: %s', JSON.stringify(s,null,2));
  
  try {
    console.log('attempting save..');
    
    s.save(function(err) {
      if(err) { console.log(err); d.reject(err); }
      else {
        console.log('save successful! id: %s', s._id);
        d.resolve(s._id);
      }
    });
    
  }catch(ex) { console.log('Search.save ex: %s', ex); }
  return d.promise;
};

mongoose.connection.on('connected', function () { console.log('\n\nMongoose default connection open to ' + dbURI); });
mongoose.connection.on('error',function (err) { console.log('\n\nMongoose default connection error: ' + err); });
mongoose.connection.on('disconnected', function () { console.log('\n\nMongoose default connection disconnected'); });
