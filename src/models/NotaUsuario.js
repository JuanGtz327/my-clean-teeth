const mongoose = require('mongoose');
const {Schema} = mongoose;

const NotaSchema = new Schema({
    Nombre: {type: String, required: true},
    Apellido: {type: String, required: true},
    Usuario: {type: String, required: true},
    Titulo: {type: String, required: true},
    ISDOCTOR: {type: Boolean, required: true, default: false},
    Descripcion: {type: String, required: true},
    IDDOCTOR: {type: String, required: true},
    Date: {type: Date, default: Date.now},
});

module.exports = mongoose.model('NotaP',NotaSchema);