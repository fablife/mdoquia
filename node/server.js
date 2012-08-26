var env = process.env.NODE_ENV || 'development';

var express = require('express');
var stylus = require('stylus');
var fs = require('fs');
var app = module.exports = express.createServer();
app.db = require('./models/models');


var publicdir = '/public';
var urlprefix = '/images/capturas/';
var image_path = __dirname + publicdir + urlprefix;

// Configuration
function compile(str, path) {
    return stylus(str)
	.set('filename', path)
	// .set('compress', true);
}

app.configure(function(){
    this.set('views', __dirname + '/views');
    this.set('view engine', 'jade');
    this.set('view options', { layout: 'layout' })
    this.use(express.bodyParser());
    this.use(express.logger());
    this.use(express.methodOverride());
    this.use(express.cookieParser());
    this.use(express.session({secret: 'Eah4tfzGAKhr'}));
    this.use(stylus.middleware({
	      src: __dirname + '/views'
        , dest: __dirname + '/public'
        , compile: compile
    }));
    this.use(express.favicon(__dirname + '/public/favicon.ico', { maxAge: 2592000000}));
    this.use(express.static(__dirname + '/public'));
    // Keep this as last one
    this.use(this.router);
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

var mongoose = require('mongoose');
mongoose.connect('mongodb://173.230.141.159/mdoquia');
var models = require('./models/models');
var Texto = mongoose.model('Texto', models.Texto);
var Imagen = mongoose.model('Imagen', models.Imagen);

app.get('/', function(req, res) {
    res.render('index');
});

app.post('/save_image', function(req, res) {
  if ('POST' !== req.method) return ;
  var file = req.files.manda_dibujo;
  console.log('  uploaded : %s %skb', file.name, file.size / 1024 | 0);
  var datesuffix = new Date().getTime() + file.name;
  var file_name = image_path + datesuffix;
  var url = urlprefix + datesuffix; 
  fs.readFile(req.files.manda_dibujo.path, function(err, data) {
    fs.writeFile(file_name, data, function (err) {
        if (err) {
          res.send("Upload failed!!!");
          throw err;
        }
        console.log("New file saved as: " + file_name + " with url: " + url);
        var img = new Imagen({path: url});
        img.save();
        res.send("Upload OK!");
    });
  });
});


app.get('/admin/control', function(req, res) {
 Imagen.find({ checked: false}, function(err, files) {
    console.log("Cargué " + files.length + " imagenes.");
    res.render('admin/control', {
      locals: {
        imagenes: files,
        image_dir: image_path
      }
    });
  });
});

app.post('/approve_image',function(req,res) {
  console.log("Approving image with path: " + req.body["id"]);
  Imagen.update({_id: req.body['id']},{ $set : { checked: true} }, {upsert: true}, function(err, img) {
    if (err) {
      res.send(500);
      console.log(err);
    }
    res.send(200);
    }); 
});

app.post('/save_text', function(req,res) {
  if ('POST' !== req.method) return ;
  var texto = new Texto(req.body);
  texto.save(function(error, _texto) {
    res.send("El texto fue guardado!");
  });
});

app.get('/todos_los_textos', function(req,res) {
  Texto.find({}, function(err, textos) {
    res.render('textos', {
      textos: textos
    });
  });
});

// App starts here
// Only listen on $ node app.js
if (!module.parent) {
    app.listen(6789);
    console.log("Express server listening on port %d", 6789);
} else {
    if (env == 'test') app.listen(6789);
}
