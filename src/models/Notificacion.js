const mongoose = require('mongoose');
const {Schema} = mongoose;

const NotificacionSchema = new Schema({
    Numero: {type: String, required: true},
    IDDOCTOR: {type: String, required: true},
    Checado: {type: Boolean, required: true},
    Date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Notificacion',NotificacionSchema);