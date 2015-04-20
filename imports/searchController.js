var q = require('q');
var Search = require('../models/search');
var Feeds = require('../models/feeds.js');

exports.getSearchId = function(keywords) {
  var d = q.defer();
  var keywordsArray = keywords.split(" ");
  
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
