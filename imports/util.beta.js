var q = require('q');
var sCtrl = require('./searchController');
var fCtrl = require('./feedsController');
var aCtrl = require("./articleController");
var dCtrl = require("./dbController");

var Search  = require('../models/search');
var Article = require('../models/article');
var Feeds   = require('../models/feeds');

var fr   = require('feed-read');
var nr = require('node-readability');
var hs   = require('htmlstrip-native');

exports.get = function(keywords) {
  console.log("util.beta.js.get()...");
  var d = q.defer();
  try {
    // Get search
    dCtrl.connectLocal();
    getSearch(keywords)
    .then(function(sObj)     { return sObj; }, function(err){d.reject(err);})
    .then(function(searchId) { return getFeed(keywords, searchId);}, function(err){ d.reject(err);})
    .then(function(articles) {
      console.log("article count: %s", articles.length);
      readArticles(articles);
    }).done(function() {dCtrl.disconnectDB();});
  } catch(ex) { console.log(ex); d.reject(ex); }
  return d.promise;
};

readArticles = function(articles) {
  console.log("readArticles().. l: %s", articles.length);
  var promises = articles.map(readArticle);
  
  console.log("Promises Length: ", promises.length);
  q.allSettled(promises)
  .then(function(results) {
    console.log("q.AllSettled.then(results)...\n%s", JSON.stringify(results, null, 2));
    //results.forEach(function(result){ console.log("results.foreach() result: %s", JSON.stringify(result.reason,null,2)); });
  })
  .catch(function(err) { console.log("allSettled() Err: %s", err); })
  .fail(function(err) { console.log("fail err: %s", err); });
};

readArticle = function(url) {
  console.log("readArticle()...");
  var d = q.defer();
  try {
    // Get search
    q.fcall(function() {
      console.log('q.fcall()..');
      nr(url, function(err, article, meta) {
        console.log("nr()...");
        if(nre(err,article)) {
          console.log("no error..");
          oArticle.content = article.content;
          oArticle.title = strip(article.title);
          oArticle.text = strip(article.content);
          console.log(oArticle.text);
          d.resolve(oArticle);
        } else if(err) { d.reject(err); }
      });
    });
  } catch(ex) { d.reject(ex); }
  return d.promise;
};

nre = function(err, article) {
  if(err) { console.log("read() err: %s", JSON.stringify(err, null, 2)); return false; }
  else if( typeof article === undefined) { console.log("read() article undefined"); return false;}
  else if(typeof article.content === undefined) { console.log("read() article.content undefined"); return false;}
  else if(article.content !== false) {return true;}
};

getFeed = function(keywords, searchId) {
  console.log("getArticles()\nkeywords: %s\nsearchId: %s\n", keywords, searchId);
  var d = q.defer();
  try {
    var url = "https://news.google.com/news?num=100&pz=1&cf=all&ned=us&hl=en&output=rss&q=" + keywords.replace(new RegExp(" ", 'g'), "+");
    fr(url, function(err, articles) {
      var link = [];
      articles.forEach(function(part, index, arry) {
        arry[index].link = stripRedirect(arry[index].link);
        arry[index].nr = r(arry[index].link).then(function(res) {console.log(JSON.stringify(res,null, 2)); }, function(err){console.log(err);});
        link.push(arry[index].link);
        
      });
      
      // ** too tired to continue.. maybe trying something else.. inserting the r() higher up the chain maybe..
      
      // get some rest.. your already up to late.. morning note.. try wrapping the read around the save routines and return..
      d.resolve(articles);
    });
  } catch(ex) { d.reject(ex); }
  return d.promise;
};

r = function(u) {
  var d = q.defer();
  nr(u, function(err, article, meta) {
    console.log("nr()...");
    var oArticle = {};
    try {
      if(nre(err,article)) {
        console.log("no error..");
        oArticle.content = article.content;
        oArticle.title = strip(article.title);
        oArticle.text = strip(article.content);
        oArticle.meta = meta;
        console.log(oArticle.text);
        d.resolve(oArticle);
      } else if(err) { d.reject(err); }
    } catch(ex) { d.reject(ex); }
  });
  return d.promise;
};

strip = function(text) {
  try {
    text = hs.html_strip(text,options);
    return text;
  } catch(ex) { return 'parse failure'; }
};

stripRedirect = function( link ) {
  var name = "url";
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( link );
  if( results === null )
    return null;
  else
    return results[1];
}

buildGoogleNewsLink = function(keywords) {
  var url = "https://news.google.com/news?num=100&pz=1&cf=all&ned=us&hl=en&output=rss&q=" + keywords.replace(new RegExp(" ", 'g'), "+");
  console.log(url);
  return url;
};

getSearch = function(keywords) {
  console.log("getSearch()..");
  var d = q.defer();
  try {
    var kwa = keywords.split(' '); // keywords to array
    // Get search
    
    Search.find({keywords: kwa}).limit(1).exec(function(err, results) {
      if(err) {d.reject(err);}
      else if(results.length === 0) {
        buildSearch(kwa)
        .then(function(searchId) { d.resolve(searchId); }, function(err) { d.reject(err); });
      } else if(results.length === 1) { d.resolve(results[0]._id); }
    
      
    });
  } catch(ex) { d.reject(ex); }
  return d.promise;
};

buildSearch = function(keywords) {
  console.log("buildSearch()...");
  var d = q.defer();
  try {
    s = Search({ keywords: keywords });
    s.save(function(err) {
      console.log("Search created:\n%s",JSON.stringify(s,null,2));
      if(err) { d.reject(err); }
      else { d.resolve(s._id); }
    });
  } catch(ex) { d.reject(err); }
  return d.promise;
}

a = function(keywords) {
  var d = q.defer();
  try {
    // Get search
    
  } catch(ex) { d.reject(ex); }
  return d.promise;
};


