var q = require('q');
var Article = require('../models/article');

exports.get = function(article, searchId) {
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
          description: String,
          searchId, String,
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
        searchId: article.searchId,
        description: article.description,
        text : "not processed",
        content: "not processed"
      });
      
      getText(a).then(
        function(result) {
          result.save(function(err) {
            if(err) { d.resolve(err); }
            else { console.log('article saved id: %s',a._id); }
          });
              
        }, function(err) { d.reject(err);  }
      );
      
      
    } else {
      d.resolve(results[0]);
    }
  });
  return d.promise;
};

exports.yesterday = function() {
  var d = q.defer();
  
  try{
    Article.find({
      pubDate: {
        $gte : getDate(-1), $lt: getDate(0)
      }
    }).exec(function(err, results) {
      if(err) {
        console.log(JSON.stringify(err,null,2)); d.reject(err);
      } else if(results.length > 0) {
        d.resolve(results);
        results.forEach(function(article) {
          var r = {
            pubDate: article.pubDate,
            title : article.title,
            text : article.text
          };
          console.log("%s", JSON.stringify({ pubDate: article.pubDate, title : article.title, text : article.text },null,2));
        });
      } else { console.log("no results found for yesterday..."); d.resolve([]); }
    });
  } catch(ex) { d.reject(ex); }
  return d.promise;
};

getDate = function(adjustDay) {
  var d = new Date();
	d.setHours(0);
	d.setMinutes(0);
	d.setSeconds(0);
  d.setDate(d.getDate() + adjustDay);
  return d;
}

getText = function(article) {
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
