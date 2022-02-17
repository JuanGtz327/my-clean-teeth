const mongoose = require('mongoose');
const {Schema} = mongoose;

const CitaSchema = new Schema({
    Nombre: {type: String, required: true},
    Apellido: {type: String, required: true},
    Usuario: {type: String, required: true},
    Titulo: {type: String, required: true},
    Dia: {type: String, required: true},
    Hora: {type: String, required: true},
    Descripcion: {type: String, required: true},
    IDDOCTOR: {type: String, required: true},
    Confirmacion: {type: Boolean, required: true, default:false},
    Rechazo: {type: Boolean, required: true, default:false},
    Date: {type: Date, default: Date.now},
});

module.exports = mongoose.model('Cita',CitaSchema);