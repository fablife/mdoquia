var mongoose = require('mongoose');

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var Texto = new Schema({
  name  : { type: String, default: 'Texto' },
  fecha : { type: Date, default: Date.now },
  texto : { type: String }
});
mongoose.model('Texto', Texto);

module.exports= {
  Texto: Texto
}
