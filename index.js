var express = require('express');
var app = express();
var Firebird = require('node-firebird');
var Path = require('path');
var stringify = require('json-stringify');
var jsonToHtmlTable = require('json-to-htmltable');

app.get('/', function (req, res) {
  var metadata = "";
  var options = {};
 
  options.host = 'localhost';
  options.port = 3050;
  // options.database = Path.join(process.cwd(),'/db/employee.fdb');
  options.database = '/var/lib/firebird/3.0/data/employee.fdb';
  options.user = 'SYSDBA';
  options.password = 'masterkey';
  options.lowercase_keys = false; // set to true to lowercase keys
  options.role = null;            // default
  options.pageSize = 8192;        // default when creating database

  Firebird.attach(options, function(err, db) {
    if (err) {
      console.log(err);
      res.send("query fail");
    } else {
        db.query('SELECT * FROM EMPLOYEE', function(err, result) {
          var table = "<table><tr><th>Full name</th></tr>";
          for (var i in result) {
            if (result[i].hasOwnProperty('FULL_NAME')) {
              table = table + "<tr><td>" + result[i].FULL_NAME + "</td></tr>";
            }
          }
          table = table + "</table>";
        res.send(table);
        });
        db.detach();
    }
  });
});

app.listen(3333, function () {
  console.log('Crudo running on port 3333!');
});

