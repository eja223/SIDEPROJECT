var mysql = require('mysql');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
var mustacheExpress = require('mustache-express');

// Register '.mustache' extension with The Mustache Express
app.engine('mustache', mustacheExpress());

app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'homestead',
  password : 'secret',
  database : 'test',
  port     : 33060
});

// Reads in newly added comments
app.post('/comment', function (req, res) {
  console.log(req.body);

  // Captured Values
  var sentCrap = [req.body.name, req.body.comment, req.body.media];

  connection.query('INSERT INTO `test2` (`name`, `comment`, `media`) VALUES (?, ?, ?)', sentCrap, function(err, comments, fields) {
    console.log(err);
    // show home page
    res.redirect('/');
  });
});

// Gets the information from the database
app.get('/home', function (req, res) {

  var page = Number(req.query.page || 1);
  console.log(req.query);

  connection.query('SELECT * FROM test2 LIMIT 5 OFFSET ' + ((page-1) * 5), function(err, comments, fields) {

    res.render('index', {
      title: 'Star Trek: The Current Generation',
      page: page,
      nextPage: page+1,
      comments: comments,
      renderDate: function() {
        if (!this.time || this.time === '0000-00-00 00:00:00') {
          return 'N/A';
        }
        return this.time;
      },
      renderId: function(test) {
        // renders the Id count
        var prefix = "0000000";
        return prefix.substring(0, prefix.length-String(this.id).length) + this.id;
      },
      renderImage: function() {
        // test for youtube
        var yt = null;
        var im = null;

        if (yt = /youtube\.com\/watch\?v\=([a-z\-0-9_]+)/ig.exec(this.media)) {
          var embedUrl = `https://www.youtube.com/embed/${yt[1]}`;
          return `<iframe width="420" height="315" src="${embedUrl}" frameborder="0" allowfullscreen></iframe>`;
        }

        // test for imgur
        if (im = /https?:\/\/i?\.?imgur\.com\/([a-z_\-0-9\.]+)/ig.exec(this.media)) {
          var imgTag = 'imgur cannot display because you need the extension.';
          if (im[1].indexOf('.') !== -1) {
            imgTag = `<img class="imgur" src="http://i.imgur.com/${im[1]}"/>`;
          }
          return `<p>${imgTag}</p>`;
        }
        // else test for other, renderother
        // ...
        // base case, just return the plain jane comment
        return null;
      },
    });
  });
});

// Gets the information from the database
app.get('/index2', function (req, res) {

  var page = Number(req.query.page || 1);
  console.log(req.query);

  connection.query('SELECT * FROM test2 LIMIT 5 OFFSET ' + ((page-1) * 5), function(err, comments, fields) {

    res.render('index2', {
      title: 'Bring Me Back',
      page: page,
      nextPage: page+1,
      comments: comments,
      renderDate: function() {
        if (!this.time || this.time === '0000-00-00 00:00:00') {
          return 'N/A';
        }
        return this.time;
      },
      renderId: function(test) {
        // renders the Id count
        var prefix = "0000000";
        return prefix.substring(0, prefix.length-String(this.id).length) + this.id;
      },
      renderImage: function() {
        // test for youtube
        var yt = null;
        var im = null;

        if (yt = /youtube\.com\/watch\?v\=([a-z\-0-9_]+)/ig.exec(this.media)) {
          var embedUrl = `https://www.youtube.com/embed/${yt[1]}`;
          return `<iframe width="420" height="315" src="${embedUrl}" frameborder="0" allowfullscreen></iframe>`;
        }

        // test for imgur
        if (im = /https?:\/\/i?\.?imgur\.com\/([a-z_\-0-9\.]+)/ig.exec(this.media)) {
          var imgTag = 'imgur cannot display because you need the extension.';
          if (im[1].indexOf('.') !== -1) {
            imgTag = `<img class="imgur" src="http://i.imgur.com/${im[1]}"/>`;
          }
          return `<p>${imgTag}</p>`;
        }
        // else test for other, renderother
        // ...
        // base case, just return the plain jane comment
        return null;
      },
    });
  });
});

app.listen(8080);
