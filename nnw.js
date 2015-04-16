var utility = require('./imports/utils');


var a = process.argv.slice(2);

switch(a[0]) {
  case 'update' : update(a[1]); break;
  case 'get' : get(a[1]); break;
  case 'show' : show(a[1]); break;
  default : defaultResponse(); break;
}

function defaultResponse() {
  //process.stout.write('033c');
  console.log('\033[2J');
  
  var response = "\n\nSorry, I don't know what your talking about...\n\n";
  response += "COMMANDS\n\n";
  response += "update: this pulls in fresh articles form rss feeds saved from previous searches.\n";
  response += "get 'keyword keyword': This will search for keywords both in articles and feeds\n";
  response += "show feeds: This will show the titles of all accumlated feeds\n";
  response += "\n\n";
  console.log(response);
}

function get(command) {
  console.log('nnw.get(command): %s', command);
  
  
  utility.get(command).then(
    function(searchId) {
      
    }, function(err) { console.log('utils.get() err: %s', err); }
  );
}