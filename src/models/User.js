const mongoose = require('mongoose');
const {Schema} = mongoose;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    Nombre: {type: String, required: true},
    Apellido: {type: String, required: true},
    Sexo: {type: Boolean, required: true, default:false},
    Cedula: {type: String, required: true},
    Correo: {type: String, required: true},
    Usuario: {type: String, required: true},
    Telefono: {type: String, required: false, default:''},
    Consultorio: {type: String, required: false, default:''},
    Contraseña: {type: String, required: true},
    Date: {type: Date, default: Date.now},
});

UserSchema.methods.encryptPassword = async (password) =>{
  const salt = await bcrypt.genSalt(10);
  const hash = bcrypt.hashSync(password,salt);
  return hash;
};

UserSchema.methods.matchPassword = function (password){
    return bcrypt.compareSync(password , this.Contraseña);
};

module.exports = mongoose.model('User',UserSchema);