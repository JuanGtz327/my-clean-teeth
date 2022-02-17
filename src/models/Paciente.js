const mongoose = require('mongoose');
const {Schema} = mongoose;

const PacienteSchema = new Schema({
    Nombre: {type: String, required: true},
    Apellido: {type: String, required: true},
    Usuario: {type: String, required: true},
    Descripcion: {type: String, required: true},
    IDDOCTOR: {type: String, required: true},
    Cedula: {type: String, required: true},
    Sexo: {type: Boolean, required: true, default:false},
    Date: {type: Date, default: Date.now},
});

module.exports = mongoose.model('Paciente',PacienteSchema);