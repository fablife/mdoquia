var mongoose = require('mongoose');

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var Texto = new Schema({
  name  : { type: String, default: 'Texto' },
  fecha : { type: Date, default: Date.now },
  texto : { type: String },
  checked : { type: Boolean , default: false}
});
mongoose.model('Texto', Texto);

var Imagen = new Schema({
  path  : { type: String },
  checked : { type: Boolean , default: false}
});

module.exports= {
  Texto: Texto,
  Imagen: Imagen
}
