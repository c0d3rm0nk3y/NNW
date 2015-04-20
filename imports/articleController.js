var q = require('q');
var Article = require('../models/article');

exports.get = function(article) {
  var d = q.defer();
  // check if url exists, if not create db entry
  Article.find({link: gup('url', article.link)}).limit(1).exec(function(err,results){
    if(err) { d.reject("error: %s" + err); }
    else if(results.length === 0) {
      /*
        var articleSchema = new Schema({
          title : String,
          author : String,
          link : String,
          content : String,
          pubDate : Date,
          text : String,
          paragraphs : [String],
          sentences  : [String]
        });
      */
      
      // REMEBER - parse link to remove that gogle redirect crap..
      
      a = Article({
        title : article.title,
        author : article.author,
        link : gup("url", article.link),
        pubDate: article.published,
        text : "not processed",
        content: "not processed"
      });
      
      a.save(function(err) {
        if(err) { d.resolve(err); }
        else { console.log('article saved id: %s',a._id); }
      });
      d.resolve(a);
    } else {
      d.resolve(results[0]);
    }
  });
  return d.promise;
};

getText = function(url) {
  var d = q.defer();
  
  try {
      
  } catch(ex) { d.reject(ex);}
  
  return d.promise;
}

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

exports.remove = function(url) {};

exports.update = function(udpatedArticle) {};
