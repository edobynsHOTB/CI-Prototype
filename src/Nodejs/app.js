'use strict';

var express = require('express')
var app = express()
// var mongoose = require("mongoose");

// mongoose.connect('mongodb://mongo:27017');

app.get('/', function (req, res) {
    res.send('This would be where someone might say, "Fuck you World" - connected to mongo...')
})

app.listen(3000, function () {
    console.log('Example app listening on port 80!')
})
