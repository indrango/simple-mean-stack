//set up package
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var config = require('./config');
var Todo = require('./app/models/todo');

//configuration
mongoose.connect(config.database, function(err) {
  if(err)
    console.log('Koneksi gagal!');
  else
    console.log('Koneksi berhasil.');
});

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_comonents'));
app.use(express.static(__dirname + '/app'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(methodOverride());

app.get('*', function(req, res) {
  res.sendFile('index.html');
});

//ROUTE
app.route('/api/todos')
  .get(function(req, res) {
    Todo.find(function(err, todos) {
      if (err)
        res.send(err)

      res.json(todos);
    });
  })

  .post(function(req, res) {
    Todo.create({
      text: req.body.text,
      done: false
    }, function(err, todo) {
      if (err)
        res.send(err);

      Todo.find(function(err, todos) {
        if (err)
          res.send(err)

        res.json(todos);
      });
    });
  });

app.route('/api/todos/:todo_id')
  .delete(function(req, res) {
    Todo.remove({
      _id : req.params.todo_id
    }, function(err, todo) {
      if(err)
        res.send(err)

      Todo.find(function(err, todos) {
        if(err)
          res.send(err);

        res.json(todos);
      });
    });
  });

app.listen(config.port);
console.log('Simple Mean Stack running at http://localhost:' + config.port);
