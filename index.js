var express = require('express');
var metadata = require('./metadata.js');
var app = express();

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

app.listen(3333, function () {
  console.log('Crudo running on port 3333!');
});

