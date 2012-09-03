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
mongoose.connect('mongodb://192.168.0.147/mdoquia');
var models = require('./models/models');
var Texto = mongoose.model('Texto', models.Texto);
var Imagen = mongoose.model('Imagen', models.Imagen);

app.get('/', function(req, res) {
    res.redirect('/admin/control');
});

app.post('/save_image', function(req, res) {
  if ('POST' !== req.method) return ;
  var base64Data = req.body.data.replace(/^data:image\/png;base64,/,"");
  var data = new Buffer(base64Data, 'base64');
  //console.log(base64Data);
  filename = 'imagen.png';
  console.log('  uploaded : %s %skb', filename, data.length / 1024 | 0);
  var datesuffix = new Date().getTime() + '-' + filename;
  var file_name = image_path + datesuffix;
  var url = urlprefix + datesuffix; 
  var path = '/public/images/capturas';
  fs.writeFile(file_name, data, function (err) {
      if (err) {
        res.send("Upload failed!!!");
        throw err;
      }
      console.log("New file saved as: " + file_name + " with url: " + url);
      var img = new Imagen({path: url});
      img.save();
      res.send("Imagen guardada!");
  });
});


app.get('/admin/control', function(req, res) {
    Imagen.find(function(err, files) {
	res.render('admin/control', {
	    locals: {
		imagenes: files,
		image_dir: image_path,
		pagina: 'Imagen'
	    }
	});
    });
});

app.get('/admin/textos', function(req, res) {
    Texto.find(function(err, files) {
	console.log("Cargué " + files.length + " textos.");
	res.render('admin/textos', {
	    locals: {
		textos: files,
		pagina: 'Texto'
	    }
	});
    });
});

app.post('/approve_image',function(req,res) {
    if(!req.body.checked || req.body.checked == 'false') req.body.checked = false;
    Imagen.update({_id: req.body['id']}, { $set : { checked: req.body.checked } }, function(err, img) {
	if (err) {
	    res.send(500);
	    console.log(err);
	}
	res.send(200);
    });
});

app.post('/approve_text',function(req,res) {
    if(!req.body.checked || req.body.checked == 'false') req.body.checked = false;
    Texto.update({_id: req.body['id']}, { $set : { checked: req.body.checked } }, function(err, img) {
	if (err) {
	    res.send(500);
	    console.log(err);
	}
	res.send(200);
    });
});

app.post('/save_text', function(req,res) {
  if ('POST' !== req.method) return ;
  console.log(req.body.data);
  var texto = new Texto({ texto : req.body.data });
    //console.log(texto);
    texto.save(function(error, _texto) {
    res.send("El texto fue guardado!");
    });
});

app.get('/todos_los_textos', function(req,res) {
  Texto.find({}, function(err, textos) {
    res.render('textos', {
      pagina: 'Todos los textos',
      textos: textos
    });
  });
});

app.get('/visualizacion', function(req,res) {
    res.render('visualizacion', {
	layout: false
    });
});

app.get('/random_data', function(req,res) {
    console.log('oeoeoeoe');
    // Cambiar el query por { checked: true }
    if(req.query.texto == 'true'){
	Texto.find({ checked: true }, function(err, textos) {
	    randomnumber = Math.floor(Math.random()*(textos.length-1));
	    //console.log("textos: " + textos[ randomnumber ] );
	    res.send(textos[ randomnumber ]);
	});
    }else {
	Imagen.find({ checked: true }, function(err, imagenes) {
	    randomnumber = Math.floor(Math.random()*(imagenes.length-1));
	    //console.log("imágenes:" + imagenes[ randomnumber ])
	    res.send(imagenes[ randomnumber ]);
	});
    }
});


// App starts here
// Only listen on $ node app.js
if (!module.parent) {
    app.listen(6789);
    console.log("Express server listening on port %d", 6789);
} else {
    if (env == 'test') app.listen(6789);
}
