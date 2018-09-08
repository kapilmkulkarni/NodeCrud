var csvjson = require('csvjson');
var fs=require('fs');
var path    = require('path');


var data = fs.readFileSync(path.join(__dirname, 'format.csv'), { encoding : 'utf8'});

var options = {
  delimiter : ',', // optional
  quote     : '"' // optional
};
 
// var jsonObject=csvjson.toObject(data, options);
var jsonObject=csvjson.toSchemaObject(data, options);

fs.writeFile(__dirname+'/customer.json', JSON.stringify(jsonObject), "utf8", function(err) {
    if (err) throw err;
    console.log("File saved.");
});

