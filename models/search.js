var mongoose =require('mongoose');
var Schema = mongoose.Schema;

// create scheme
var searchSchema = new Schema({
  keywords : [String],
  timestamp : Date,
  tags : String,
  updated_at : Date
});

/**
searchSchema.pre('save', function(next)  {
  var cDate = new Date();
  this.updated_at = cDate;
  if(!this.created_at) this.created_at = cDate;
  next;
});
**/

var Search = mongoose.model('Search', searchSchema);

module.exports = Search;
