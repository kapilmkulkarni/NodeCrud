var xlsx = require('node-xlsx');
var fs = require('fs');
var csvjson = require('csvjson');
var path = require('path');
var obj = xlsx.parse(__dirname + '/Tathawade Area June 18.xlsx'); // parses a file
console.log('///////////////////////////',obj[0].data);
var rows = [];
var writeStr = "";

//looping through all sheets
for (var i = 0; i < obj.length; i++) {
    var sheet = obj[i];
    //loop through all rows in the sheet
    for (var j = 0; j < sheet['data'].length; j++) {
        //add the row to the rows array
        rows.push(sheet['data'][j]);
    }
}

//creates the csv string to write it to a file
for (var i = 0; i < rows.length; i++) {
    writeStr += rows[i].join(",") + "\n";
}

//writes to a file, but you will presumably send the csv as a      
//response instead
fs.writeFile(__dirname + "/format.csv", writeStr, function (err) {
    if (err) {
        return console.log(err);
    } else {
        console.log("test.csv was saved in the current directory!");
        var data = fs.readFileSync(path.join(__dirname, 'format.csv'), { encoding: 'utf8' });
        var options = {
            delimiter: ',', // optional
            quote: '"' // optional
        };

        // var jsonObject=csvjson.toObject(data, options);
        var jsonObject = csvjson.toSchemaObject(data, options)

        fs.writeFile(__dirname +'/customer.json', JSON.stringify(jsonObject), "utf8", function (err) {
            if (err) throw err;
            console.log("File saved.");
        });

        

    }
});

