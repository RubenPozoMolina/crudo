var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Crudo');
});

app.listen(3333, function () {
  console.log('Crudo running on port 3333!');
});

