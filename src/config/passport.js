const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User');
const Paciente = require('../models/Paciente');

passport.use('local-sign',new LocalStrategy({
    usernameField: 'Usuariox',
    passwordField: 'Contraseñax',
    passReqToCallback: true
}, async (req,Usuariox,Contraseñax,done,err) => {
   const user = await User.findOne({Usuario:Usuariox});
    
    if(user){
        console.log('Se encontro un usuario');
        const match =  user.matchPassword(Contraseñax);
        if(match){
        console.log('Las contraseñas coinciden');
          return done(null,user); 
        } else {
            console.log('La Contraseña es Incorrecta');
            return done(null,false,req.flash('elol','La contraseña es incorrecta'));
        }
        
    }
    else {
        console.log('No hay usuario existente en la BD');
        return done(null,false,req.flash('elol','No se encontro ningun usuario'));
    }
}));

passport.use('Paciente-sign',new LocalStrategy({
    usernameField: 'UsuarioP',
    passwordField: 'CedulaP',
    passReqToCallback: true
}, async (req,UsuarioP,CedulaP,done,err) => {
   
    const doc = await User.findOne({Cedula:CedulaP});
    console.log('ELL DOCCCCCCCCCCCCCCCCCCC WAS'+doc);
    if(doc){
            const paciente = await Paciente.findOne({Usuario:UsuarioP,IDDOCTOR:doc.id});
    if(paciente){
        console.log('Se encontro un paciente');
        console.log(paciente.Cedula);
        if(paciente.Cedula==CedulaP){
        console.log('Las Cedulas coinciden');
          return done(null,paciente); 
        } else {
            console.log('La Cedula es Incorrecta');
            return done(null,false,req.flash('elol','La cedula es Invalida'));
        }
        
    }
    else {
        console.log('No hay paciente existente en la BD');
        return done(null,false,req.flash('elol','No se encontro ningun Paciente'));
    }
    }else{
        
    }console.log('No hay ningun doc con esa cedula');
        return done(null,false,req.flash('elol','No hay un Doctor registrado con esa cedula'));

}));

passport.serializeUser((user,done)=>{
    console.log('Entre aqui Doctor');
    done(null,user.id);
});

passport.deserializeUser(async(id,done)=>{
    console.log('La id De usuario es '+id);
    const tr= await User.findById(id);
    console.log('El usuario Encontrado fue'+tr)
    if (tr){
    console.log('Buqueda de Doctor');
    User.findById(id, (err,user)=>{
       done(err,user); 
    });
    }else{
    console.log('Busqueda de Paciente');
    Paciente.findById(id, (err,user)=>{
       done(err,user); 
    });   
    }
});