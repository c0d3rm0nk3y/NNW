var utility = require('./imports/utils.beta');
var aCtrl   = require('./imports/articleController');

var mongoose = require('mongoose'); // Build theconnection string
var dbURI = 'mongodb://localhost/nnwDB'; // for use when innitrious
var dbRemote = "mongodb://nnwUser:JohnPurple#cake!99@ds061711.mongolab.com:61711/nnw";

mongoose.connect(dbURI);

mongoose.connection.on('connected', function () { console.log('\n\nMongoose default connection open to ' + dbURI); });
mongoose.connection.on('error',function (err) { console.log('\n\nMongoose default connection error: ' + err); });
mongoose.connection.on('disconnected', function () { console.log('\n\nMongoose default connection disconnected'); });

process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('\n\nMongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

var a = process.argv.slice(2);

switch(a[0]) {
  case 'update' : update(a[1]); break;
  case 'get' : get(a[1]); break;
  case 'updateText' : updateText(); break;
  case 'add'        : add(a[1], a[2]); break;
  case 'yesterday'  : yesterday(a[1]); break;
  case 'show'       : show(a[1]); break;
  default           : defaultResponse(); break;
}

function defaultResponse() {
  //process.stout.write('033c');
  console.log('\033[2J');
  
  var response = "\n\nSorry, I don't know what your talking about...\n\n";
  response += "COMMANDS\n\n";
  response += "add - arguments: feed|article, url. def: this will add a feed or an article to the db.\n";
  response += "update: this pulls in fresh articles form rss feeds saved from previous searches...\n";
  response += "updateText - arguments: none. def: This will go through the entire db and update the 'text' of an article if its blank...\n";
  response += "yesterday - arguments: none. def: this will pull all articles in the db from yesterday...\n";
  response += "get - arguments: keywords to search surrounded in 'qoutes'.  def: This will search for keywords both in articles and feeds...\n";
  response += "show articles|searches: This will show the titles of all accumlated feeds...\n";
  response += "\n\n";
  console.log(response);
  mongoose.disconnect();
}

/*
db.collection.find( { field: { $gt: value1, $lt: value2 } } );

this will be needed to pull 'yesterdays' news

** here is an api to get your reppresentativ

whoismyrepresentative.com//api

whoismyrepresentative.com/getall_mems.php?zip=55109&output=json

www.senate.gov/general/contact_information/senators_cfm.xml

www.govtrack.us/developers/api


*/

function add(what, url) {
  console.log('add: %s, %s', what, url);
}

function updateText() {
  aCtrl.updateText().then(function(result){mongoose.disconnect();},function(err){mongoose.disconnect();});
}

function yesterday() {
  // mongo shell search by date range
  // > db.articles.find({ pubDate: { $gte:ISODate("2015-04-17T00:00:00.000Z") , $lt: ISODate("2015-04-18T00:00:00.000Z")  }}).pretty()
  aCtrl.yesterday().then(
    function(results) {
      mongoose.disconnect();
    }, function(err) { console.log('yesterday err: %s', JSON.stringify(err,null,2)); }
  );
}

function get(command) {
  console.log('nnw.get(command): %s', command);
  
  
  utility.get(command).then(
    function(result) {
      fs.writeFile(command + ".json", JSON.stringify(result,null,2), function(err) {
        if(err) {
          console.log('write failed... err: %s', err);
        }
      });
      console.log("%s created on: %s id: %s", result.search.keywords, result.search.timestamp, result.search._id);
      console.log("\n");
      console.log("%s articles", result.articles.length);
      //console.log(JSON.stringify(result,null,2));
    }, function(err) { console.log('utils.get() err: %s', err); }
  );
}
