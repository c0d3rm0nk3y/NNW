var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var articleSchema = new Schema({
  title : String,
  author : String,
  link : String,
  content : String,
  description : String,
  pubDate : Date,
  text : String,
  searchId : String,
  paragraphs : [String],
  sentences  : [String]
});

var Article = mongoose.model('Article', articleSchema);
module.exports = Article;

  // Each article has the following properties:
  //
  //   * "title"     - The article title (String).
  //   * "author"    - The author's name (String).
  //   * "link"      - The original article link (String).
  //   * "content"   - The HTML content of the article (String).
  //   * "published" - The date that the article was published (Date).
  //   * "feed"      - {name, source, link}