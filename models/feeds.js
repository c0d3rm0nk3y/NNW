var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

// create scheme
var feedsSchema = new Schema({
  name : String,
  source : String,
  link : String
});


//feedsSchema.pre('save', function(next)  {});

var Feeds = mongoose.model('Feeds', feedsSchema);

module.exports = Feeds;
