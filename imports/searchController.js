var q = require('q');
var mongoose = require('mongoose'); // Build theconnection string
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
    if(err) { d.reject(err); }
    else if(results.length === 0) {
      console.log('\n\nQuery of "%s" is for first time.. creating entry...', keywords);
      
      createSearch(keywordsArray).then(
        function(sObj) {
          d.resolve(sObj);
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

exports.addArticleToSearch = function(searchId, articleId) {
  try {
    var q = { _id: searchId };
    Search.findOneAndUpdate(
      { _id: searchId},
      {$push: {articleIds: articleId}},
      {safe: true, upsert: true},
      function(err, model) {
        if(err) { console.log("findOneAndUpdate err: %s", err); }
      }
    );
  } catch(ex) { console.log('sCtrl.addArticleToSearch() ex: %s', ex); }
};

createSearch = function(keywords) {
  var d = q.defer();

  s = Search({
    keywords: keywords,
    timestamp: new Date(),
    tags : ""
  });
  
  try {
    console.log('attempting save..');
    
    s.save(function(err) {
      if(err) { d.reject(err); }
      else {
        console.log('save successful! id: %s', s._id);
        d.resolve(s);
      }
    });
    
  }catch(ex) { console.log('Search.save ex: %s', ex); }
  return d.promise;
};

mongoose.connection.on('connected', function () { console.log('\n\nMongoose default connection open to ' + dbURI); });
mongoose.connection.on('error',function (err) { console.log('\n\nMongoose default connection error: ' + err); });
mongoose.connection.on('disconnected', function () { console.log('\n\nMongoose default connection disconnected'); });

process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('\n\nMongoose default connection disconnected through app termination');
    process.exit(0);
  });
});
