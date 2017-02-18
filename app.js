'use strict';
              
var express = require('express');
var app = express();
var router = express.Router();

process.env.PORT = 8080;

// Initialize Server
app.listen(process.env.PORT, function() {
  console.log('Wooooooo Hoooooooooo!!!');
  console.log('Wooooooo Hoooooooooo!!!');
  console.log('Listening on port:' + process.env.PORT);
});
 
// Handle Errors
app.use(function(req, res) {
  res.status(404);
  res.sendFile('404.html', { root: require('path').join(__dirname, 'public/views/misc') });
  console.log('Error: /404 loaded');
});

module.exports = app;
