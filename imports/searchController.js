var q = require('q');
var mongoose = require('mongoose');
// Build the connection string
var dbURI = 'mongodb://localhost/nnwDB';
// for use when in nitrious
var dbRemote = "mongodb://nnwUser:JohnPurple#cake!99@ds061711.mongolab.com:61711/nnw";

var Search = require('../models/search');

exports.getSearchId = function(keywords) {
  var d = q.defer();
  
  // Create the database connection
  mongoose.connect(dbURI);
  
  Search.find( { keywords: keywords }).limit(1).exec(function(err, results){
    if(err) { console.log('\n\nSearch.find() err: %s', err); } 
    else if(results.length === 0) {
      console.log('\n\nQuery of "%s" is for first time.. creating entry...', keywords);
      
      createSearch(keywords).then(
        function(sId) {
          console.log('getSearchId().createSearch() result: ', sId);
          d.resolve(sId);
        }, function(err) {
          console.log('getSearchId().createSearch() err: %s',err);
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
  console.log('createSearch(): %s...', keywords);
  var kw = keywords.split(' ');
  kw.sort();
  s = Search({
    keywords: kw,
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
