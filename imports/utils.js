var q = require('q');
var feed = require('feed-read');
var mongoose = require('mongoose');
var read = require('node-readability');
var hs = require('htmlstrip-native');
var sController = require('./searchController');
var fController = require('./feedsController');
var aCtrl = require("./articleController");

var o = { include_script: false, include_style: false, compact_whitespace: true };

var Search = require('../models/search');
var Article   = require('../models/article');
var Feeds  = require('../models/feeds');

// Build the connection string
var dbURI = 'mongodb://localhost/nnwDB';




exports.get = function(keywords) {
  var d = q.defer();
  
  var results = {};
  
  //results.message = "hello from utils.get()..";
  
  sController.getSearchId(keywords).then(
    function(sID) {
      processKeywords(keywords, sID).then(
        function(result) {
          
        }, function(err) {}
      );
      
      result.sID = sID;
      d.resolve(results);
      
    }, function(err) { console.log('\n\rgetSearchId() err: %s', err); }
  );
  
  return d.promise;
};

processKeywords = function(keywords, searchId) {
  var d = q.defer();
  
  var url = "https://news.google.com/news?num=100&pz=1&cf=all&ned=us&hl=en&output=rss&q=";
  url = url + keywords.replace(' ', '+');
  feed(url,function(err, articles) {
    if(err) { console.log("feed err: %s\n", err); }
    processArticleFeeds(articles,searchId);
    
  });
  
  
  return d.promise;
};

  // Each article has the following properties:
  //
  //   * "title"     - The article title (String).
  //   * "author"    - The author's name (String).
  //   * "link"      - The original article link (String).
  //   * "content"   - The HTML content of the article (String).
  //   * "published" - The date that the article was published (Date).
  //   * "feed"      - {name, source, link}
  //
  
  /* dont worry about feed dbs for this.. they will always return news.googe.com..blah.blah.xml*/

processArticleFeeds = function(articles,searchId) {
  
  articles.forEach(function(article) {
    aCtrl.get(article).then(
      function(result) {
        sController.addArticleToSearch(searchId, result._id);
      },function(err) { console.log(err); }
    );
  });
};

/**
getSearchId = function(keywords) {
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
}

createSearch = function(keywords) {
  var d = q.defer();
  console.log('createSearch(): %s...', keywords);
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
}

mongoose.connection.on('connected', function () { console.log('\n\nMongoose default connection open to ' + dbURI); });
mongoose.connection.on('error',function (err) { console.log('\n\nMongoose default connection error: ' + err); });
mongoose.connection.on('disconnected', function () { console.log('\n\nMongoose default connection disconnected'); });


process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('\n\nMongoose default connection disconnected through app termination');
    process.exit(0);
  });
});
**/
