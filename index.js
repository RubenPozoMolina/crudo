var express = require('express');
var metadata = require('./metadata.js');
var app = express();
var path = '/';

app.get('/', function (req, res) {
  metadata.get_tables(function(err, result) {
    if (err) {
      console.log(err);
      res.send('Error getting tables');
    } else { 
      res.send(result);
    }
  });
});

app.get('/:table', function (req, res) {
  metadata.show_table(req.params.table,function(err, result) {
    if (err) {
      console.log(err);
      res.send('Error showing table: '+ req.params.table);
    } else { 
      res.send(result);
    }
  });
});

app.get(path)

app.listen(3333, function () {
  console.log('Crudo running on port 3333!');
});

