var q = require('q');
var sCtrl = require('./searchController');
var fCtrl = require('./feedsController');
var aCtrl = require("./articleController");

var Search  = require('../models/search');
var Article = require('../models/article');
var Feeds   = require('../models/feeds');

var fr   = require('feed-read');
var read = require('node-readability');
var hs   = require('htmlstrip-native');

exports.get = function(keywords) {
  var d = q.defer();
  try {
    sCtrl.getSearchId(keywords).then(
      function(sObj) {
        var result = {};
        result.search = sObj;
        console.log(JSON.stringify(sObj,null,2));
        buildGoogleNewsSearch(keywords, result).then(
          function(res) {
            d.resolve(res);
          }, function(err) {d.reject(err);}
        );
      }, function(err) {d.reject(err);}
    );
  } catch(ex) { d.reject(ex);}
  return d.promise;
};

var options = { include_script : false, include_style : false, compact_whitespace : true };

pullArticle = function(OrgArticle) {
  var d = q.defer();
  try {
    read(OrgArticle.link, function(article, err, meta)  {
      if(noReadErrors(err, article)) {
        result = {};
        article.title = strip(article.title);
        article.link = gup('url', article.link);
        article.text = strip(article.content);
        d.resolve(article);
      }
    });
  } catch(ex) { d.reject(ex);}
  return d.promise;
};

noReadErrors = function(err, article) {
  if(err) { console.log("read() err: %s", JSON.stringify(err, null, 2)); return false; }
  else if( typeof article === undefined) { console.log("read() article undefined"); return false;}
  else if(typeof article.content === undefined) { console.log("read() article.content undefined"); return false;}
  else if(article.content !== false) {return true;}
};

strip = function(text) {
  try {
    text = hs.html_strip(text,options);
    return text;
  } catch(ex) { return 'parse failure'; }
};

buildGoogleNewsSearch = function(keywords,result) {
  var d = q.defer();
  
  try {
    var url = buildUrl(keywords);
    getFeedArticles(url,result.search._id).then(
      function(articles) {
        result.articles = articles;
        d.resolve(result);
      },function(err){d.reject(err);}
    );
  } catch(ex) { d.reject(ex);}
  return d.promise;
};

getFeedArticles = function(feedUrl, searchId) {
  var d = q.defer();
  var rtrn = [];
  try {
    fr(feedUrl, function(err, articles) {
      if(err) { d.reject(err); }
      else {
        // remove redirect from article.link
        var result = [];
        for(var i=0; i<articles.length; i++) {
          
          articles[i].link = gup('url', articles[i].link);
          articles[i].title = strip(articles[i].title);
          articles[i].description = strip(articles[i].content);
          articles[i].searchId = searchId;
          
          //console.log("/n%s/n", JSON.stringify(articles[i], null,2));
          delete articles[i].feed;
          //articles[i].id = getArticle(articles[i]);
          saveArticle(articles[i]);
          result.push(articles[i]);
        }
        d.resolve(result);
        //console.log(JSON.stringify(articles,null,2));
      }
    });
  } catch(ex) { d.reject(ex);}
  return d.promise;
};

getArticle = function(article) {
  var d = q.defer();
  try {
    saveArticle.then(
      function(result) {
        d.resolve(result);
        //return result._id;
      },
      function(err) {
        d.reject(err);
        //return null;
      }
    );
  } catch(ex) {
    //d.reject(ex);
    console.log("saveArticle ex: %s", ex);
  }
  return d.promise;
};

saveArticle = function(article) {
  
  
  try {
    Article.find({link: article.link}).limit(1).exec(function(err, results) {
      if(err) { console.log("article find error: %s", err); }
      else if(results.length === 0) {
        a = Article({
          title : article.title,
          author : article.author,
          link   : article.link,
          description : article.description,
          pubDate : article.published,
          text : article.text,
          searchId : article.searchId,
          paragraphs : article.paragraphs,
          sentences  : article.sentences,
        });
        // d.resolve(a);
        a.save(function(err) {
          if(err) {console.log("save err: %s", JSON.stringify(err, null, 2)); }
          else {
            console.log('save successful: %s', a.title);
          }
        });
      } else {
        //d.resolve(results[0]);
      }
    });
  } catch(ex) { console.log('saveArticle ex: %s', JSON.stringify(ex,null,2)); }
  //return d.promise;
};

// var articleSchema = new Schema({
//   title : String,
//   author : String,
//   link : String,
//   content : String,
//   description : String,
//   pubDate : Date,
//   text : String,
//   paragraphs : [String],
//   sentences  : [String]
// });

// var Article = mongoose.model('Article', articleSchema);
// module.exports = Article;

//   // Each article has the following properties:
//   //
//   //   * "title"     - The article title (String).
//   //   * "author"    - The author's name (String).
//   //   * "link"      - The original article link (String).
//   //   * "content"   - The HTML content of the article (String).
//   //   * "published" - The date that the article was published (Date).
//   //   * "feed"      - {name, source, link}

gup = function( name, link ) {
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( link );
  if( results === null )
    return null;
  else
    return results[1];
}

buildUrl = function(keywords) {
  var url = "https://news.google.com/news?num=100&pz=1&cf=all&ned=us&hl=en&output=rss&q=";
  url = url + replaceAll(' ', '+', keywords);
  return url;
};

replaceAll = function(find, replace, str) {
  return str.replace(new RegExp(find, 'g'), replace);
};

aName = function() {
  var d = q.defer();
  try {
    
    d.resolve();
  } catch(ex) { d.reject(ex);}
  return d.promise;
};
