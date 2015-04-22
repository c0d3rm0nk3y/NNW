var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

// create scheme
var searchSchema = new Schema({
  keywords : [String],
  created_at : Date,
  updated_on : [Date],
  tags : [String]
});


searchSchema.pre('save', function(next)  {
  var cDate = new Date();
  this.updated_on.push(cDate);
  if(!this.created_at) this.created_at = cDate;
  next();
});


var Search = mongoose.model('Search', searchSchema);

module.exports = Search;
