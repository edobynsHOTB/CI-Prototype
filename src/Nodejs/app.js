'use strict';

var express = require('express')
var app = express()
var mongoose = require("mongoose");

mongoose.connect('mongodb://mongo:27017');

var schema = mongoose.Schema({ name: 'string' });
var Event4 = mongoose.model('Event4', schema);

var event4 = new Event4({ name: 'something' });
event4.save(function (err) {
  if (err) // ...
  console.log('meow');
});

app.get('/', function (req, res) {

    const connection = mongoose.connection;
    Object.keys(connection.models).forEach((collection) => {
        // You can get the string name.
        console.info(collection);

        // Or you can do something else with the model.
        res.send(collection);
    });

    // res.send('This would be where someone might say, "Fuck you World" - connected to mongo...')
})

app.listen(3000, function () {
    console.log('Example app listening on port 80!')
})
