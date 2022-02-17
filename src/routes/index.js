const router = require('express').Router();
const User = require('../models/User');
const Paciente = require('../models/Paciente');
const Cita = require('../models/Cita');
const NotaP = require('../models/NotaUsuario');
const NotaD = require('../models/NotaDoctor');
const Diente = require('../models/Diente');
const passport = require('passport');
const { isAuthenticated } = require('../helpers/auth');
const { isAuthenticatedP } = require('../helpers/auth');
const nodemailer = require('nodemailer');

//RUTAS INICAILES

router.get('/',(req,res) =>{
    res.render('index.hbs');
});

router.post('/',(req,res) =>{
    res.render('index.hbs');
});

router.get('/NewD',(req,res) =>{
    res.render('RegDoctor.hbs');
});

router.post('/NewD',async (req,res) =>{
        const errors = [];
    const errors2 = [];
    const { Nombre,Apellido,Cedula,Correo,Usuario,Contraseña,CContraseña,Sexo}=req.body;
    function Espacios(parametro){
        var patron=/^\s+$/;
        if(patron.test(parametro)){
            return false;
        }else{
            return true;
        }
    };
if(!Espacios(Nombre)||!Espacios(Apellido)||!Espacios(Contraseña)||!Espacios(Cedula)||!Espacios(Usuario)||!Espacios(Correo)){
        errors.push({text: 'Tienes que insertar datos'});
    }
    if(!Nombre || !Apellido || !Correo || !Usuario || !Contraseña || !CContraseña ||!Cedula){
      errors.push({text: 'Te falta completar un dato'});   
    }
    if(Contraseña != CContraseña){
      errors.push({text: 'Las conraseñas no coinciden'});  
    }
    if(Contraseña.length < 8){
      errors.push({text: 'La contraseña debe de ser mayor a 8 digitos'});  
    }
    if(CContraseña.length < 8){
      errors.push({text: 'La contraseña debe de ser mayor a 8 digitos'});  
    }
    if(Nombre.length > 20){
      errors.push({text: 'El nombre es muy largo'});  
    }
    if(Apellido.length > 20){
      errors.push({text: 'La contraseña es muy larga'});  
    }
    if(Cedula.length > 20){
      errors.push({text: 'La cedula es muy largo'});  
    }
    if(Correo.length > 50){
      errors.push({text: 'El correo es muy largo'});  
    }
    if(Usuario.length > 20){
      errors.push({text: 'El usuario es muy largo'});  
    }
    if(Contraseña.length > 20){
      errors.push({text: 'La contraseña es muy larga'});  
    }
    if(errors.length > 0){
        console.log('Entre a los errorees');
      res.render('RegDoctor.hbs',{errors,Nombre,Apellido,Cedula,Correo,Usuario,Contraseña,CContraseña})
    }else{
        const TheUser = await User.findOne({Usuario:Usuario})
        const Ced = await User.findOne({Cedula:Cedula})
        const TheEmail = await User.findOne({Correo:Correo})
        if(TheUser){  
            req.flash('error_msg','El nombre de usuario que introduciste, ya esta seleccionado');
            errors2.push({text: 'El nombre de usuario que introduciste ya esta seleccionado'});
            if(errors2.length > 0){
        console.log('Entre a los errorees');
      res.render('RegDoctor.hbs',{errors2,Nombre,Apellido,Cedula,Correo,Usuario,Contraseña,CContraseña})
    }
            console.log('algo salio mal');
        }
        else if(TheEmail){
            req.flash('success_msg','El correo que introduciste, ya esta seleccionado');
                        errors2.push({text: 'El correo que introduciste ya esta seleccionado'});
            if(errors2.length > 0){
        console.log('Entre a los errorees');
      res.render('RegDoctor.hbs',{errors2,Nombre,Apellido,Cedula,Correo,Usuario,Contraseña,CContraseña})
    }
            console.log('algo salio mal2');
        }
        else if(Ced){
            req.flash('success_msg','La cedula que introduciste ya esta en uso');
                        errors2.push({text: 'La cedula que introduciste ya esta en uso'});
            if(errors2.length > 0){
        console.log('Entre a los errorees');
      res.render('RegDoctor.hbs',{errors2,Nombre,Apellido,Cedula,Correo,Usuario,Contraseña,CContraseña})
    }
            console.log('algo salio mal2');
        }
        else{
            const NewUser = new User({Nombre,Apellido,Cedula,Correo,Usuario,Contraseña});
            NewUser.Contraseña = await NewUser.encryptPassword(Contraseña);
            
            if(Sexo=="Masculino"){
            console.log('Error1');
            await NewUser.save();
            req.flash('success_msg','Se ha registrado correctamente Doctor, ya puede Iniciar Sesion');
            res.redirect('/IS');   
            console.log('bien mama');
            }else{
            console.log('Error2');
            NewUser.Sexo = true;
            await NewUser.save();
            req.flash('success_msg','Se ha registrado correctamente Doctor, ya puede Iniciar Sesion');
            res.redirect('/IS');   
            console.log('bien mama');
            }
        }
    }
});

router.get('/IS',(req,res) =>{
    res.render('IniSes.hbs');
});

router.post('/IS',passport.authenticate('local-sign',{
    successRedirect: '/Doctor',
    failureRedirect: '/IS',
    failureFlash: true
}));

router.get('/ISP',(req,res) =>{
    res.render('IniSesPac.hbs');
});

router.post('/ISP',passport.authenticate('Paciente-sign',{
    successRedirect: '/Paciente',
    failureRedirect: '/ISP',
    failureFlash: true
}));

//RUTAS DEL PACIENTE

router.get('/Paciente',isAuthenticatedP,(req,res) =>{
    res.render('Paciente.hbs');
});

router.get('/Paciente/Notas',isAuthenticatedP,async (req,res) =>{
    const Notas = await NotaP.find({IDDOCTOR:req.user.IDDOCTOR,Usuario:req.user.Usuario});
    res.render('NotasPaciente.hbs',{Notas});
});

router.get('/Paciente/NotasDoctor',isAuthenticatedP,async (req,res) =>{
    const Notas = await NotaD.find({IDDOCTOR:req.user.IDDOCTOR,Usuario:req.user.Usuario});
    res.render('NotasDoctorPaciente.hbs',{Notas});
});

router.get('/Paciente/Notas/NuevaN',isAuthenticatedP,(req,res) =>{
    res.render('NuevaNotaPaciente.hbs');
});

router.delete('/Paciente/Notas/EliminarN/:id',isAuthenticatedP,async(req,res) =>{
    await NotaP.findByIdAndDelete(req.params.id);
    req.flash('success_msg','La nota se elimino exitosamente');
    res.redirect('/Paciente/Notas');
});

router.delete('/Paciente/Notas/EliminarND/:id',isAuthenticatedP,async(req,res) =>{
    await NotaD.findByIdAndDelete(req.params.id);
    req.flash('success_msg','La nota se elimino exitosamente');
    res.redirect('/Paciente/NotasDoctor');
});

router.get('/Paciente/Notas/EditarN/:id',isAuthenticatedP,async(req,res) =>{
    const epa = await NotaP.findById(req.params.id);
    res.render('EditarNotaPaciente.hbs',{epa});
});

router.put('/Paciente/Notas/EditarN/:id',isAuthenticatedP,async(req,res) =>{
    const {Titulo,Descripcion} = req.body;
    const errors = [];
        function Espacios(parametro){
        var patron=/^\s+$/;
        if(patron.test(parametro)){
            return false;
        }else{
            return true;
        }
    };
if(!Espacios(Titulo)||!Espacios(Descripcion)){
        errors.push({text: 'Tienes que insertar datos'});
    }
    if(!Titulo || !Descripcion){
        errors.push({text: 'Te falta completar un dato'});
    }
    if(errors.length > 0){
        console.log('Entre a los errorees del paciente');
        res.render('EditarNotaPaciente.hbs',{errors,Titulo,Descripcion})
    }else{
        await NotaP.findByIdAndUpdate(req.params.id,{Titulo,Descripcion})
        req.flash('success_msg','La Nota se edito exitosamente');
        res.redirect('/Paciente/Notas');
    }
});

router.post('/Paciente/Notas/NuevaN',isAuthenticatedP,async(req,res) =>{
    const { Titulo,Descripcion }=req.body;
    const errors = [];
            function Espacios(parametro){
        var patron=/^\s+$/;
        if(patron.test(parametro)){
            return false;
        }else{
            return true;
        }
    };
if(!Espacios(Titulo)||!Espacios(Descripcion)){
        errors.push({text: 'Tienes que insertar datos'});
    }
    if(!Titulo || !Descripcion){
      errors.push({text: 'Te falta completar un dato'});   
    }
    if(Descripcion.length > 200){
      errors.push({text: 'La Descripcion es muy larga'});  
    }
    if(errors.length > 0){
        console.log('Entre a los errorees del paciente');
      res.render('NuevaNotaPaciente.hbs',{errors,Titulo,Descripcion})
    }else{
            const NewNote = new NotaP({Titulo,Descripcion});
        const Doc = await User.findOne({Cedula:req.user.Cedula});
            NewNote.Nombre = req.user.Nombre;
            NewNote.Apellido = req.user.Apellido;
            NewNote.IDDOCTOR = req.user.IDDOCTOR;
            NewNote.Usuario = req.user.Usuario;
            await NewNote.save();
        //Envio de Nota
        
            let transporter = nodemailer.createTransport({
        service:'gmail', 
        secure:false, 
        port:25, 
        auth: {
            user: 'CleanTeth@gmail.com', 
            pass: 'qazwsx123+' 
        },
        tls: {
        rejectUnauthorized: false
    }
    });
    let mailOptions = {
        from: '"CleanTeth" <CleanTeth@gmail.com>',
        to: Doc.Correo,
        subject: 'Nueva Nota',
        text: 'Doctor vaya ahora a CleanTeth, su paciente '+req.user.Nombre+' '+req.user.Apellido+' le ha añadido una nota'
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s');
        
    });
        
            req.flash('success_msg','La nota se añadio con exito');
            res.redirect('/Paciente/Notas');   
    }
});

router.get('/Paciente/Citas/NuevaC',isAuthenticatedP,(req,res) =>{
    res.render('NuevaCitaPaciente.hbs');
});

router.post('/Paciente/Citas/NuevaC',isAuthenticatedP,async (req,res) =>{
    const { Titulo,Dia,Hora,Descripcion }=req.body;
    const errors = [];
            function Espacios(parametro){
        var patron=/^\s+$/;
        if(patron.test(parametro)){
            return false;
        }else{
            return true;
        }
    };
if(!Espacios(Titulo)||!Espacios(Descripcion)){
        errors.push({text: 'Tienes que insertar datos'});
    }
    if(!Titulo || !Dia || !Hora || !Descripcion ){
      errors.push({text: 'Te falta completar un dato'});   
    }
    if(Descripcion.length > 200){
      errors.push({text: 'La Descripcion es muy larga'});  
    }
    if(errors.length > 0){
        console.log('Entre a los errorees del paciente');
      res.render('NuevaCitaPaciente.hbs',{errors,Titulo,Dia,Hora,Descripcion})
    }else{
        const NC = await Cita.find({IDDOCTOR:req.user.IDDOCTOR,Usuario:req.user.Usuario});
        const Doc = await User.findOne({Cedula:req.user.Cedula});
        console.log('EL CORREO DEL DOCTOR ES'+Doc.Correo);
        if(NC.length>3){
            req.flash('error_msg','Haz alcanzado el limite de citas, por favor borra una');
            res.redirect('/Paciente/Citas'); 
        }else{
            const NewCita = new Cita({Titulo,Dia,Hora,Descripcion});
            NewCita.Nombre = req.user.Nombre;
            NewCita.Apellido = req.user.Apellido;
            NewCita.IDDOCTOR = req.user.IDDOCTOR;
            NewCita.Usuario = req.user.Usuario;
            await NewCita.save();
            //
            //Nodemailer
    let transporter = nodemailer.createTransport({
        service:'gmail', 
        secure:false, 
        port:25, 
        auth: {
            user: 'CleanTeth@gmail.com', 
            pass: 'qazwsx123+' 
        },
        tls: {
        rejectUnauthorized: false
    }
    });
    let mailOptions = {
        from: '"CleanTeth" <CleanTeth@gmail.com>',
        to: Doc.Correo,
        subject: 'Nueva Cita',
        text: 'Doctor vaya ahora a CleanTeth, su paciente '+req.user.Nombre+' '+req.user.Apellido+' le ha agendado una cita'
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s');
        
    });
            //
            req.flash('success_msg','La Cita se agendo con exito');
            res.redirect('/Paciente/Citas'); 
        }  
    }
});

router.delete('/Paciente/Citas/EliminarC/:id',isAuthenticatedP,async(req,res) =>{
    await Cita.findByIdAndDelete(req.params.id);
    req.flash('success_msg','La Cita se elimino exitosamente');
    res.redirect('/Paciente/Citas');
});

router.get('/Paciente/Citas/EditarC/:id',isAuthenticatedP,async(req,res) =>{
    const epa = await Cita.findById(req.params.id);
    res.render('EditarCitaPaciente.hbs',{epa});
});

router.put('/Paciente/Citas/EditarC/:id',isAuthenticatedP,async(req,res) =>{
    const {Titulo,Dia,Hora,Descripcion} = req.body;
    const errors = [];
            function Espacios(parametro){
        var patron=/^\s+$/;
        if(patron.test(parametro)){
            return false;
        }else{
            return true;
        }
    };
if(!Espacios(Titulo)||!Espacios(Descripcion)){
        errors.push({text: 'Tienes que insertar datos'});
    }
    if(!Titulo || !Dia || !Hora || !Descripcion){
        errors.push({text: 'Te falta completar un dato'});
    }
    if(errors.length > 0){
        console.log('Entre a los errorees del paciente');
        res.render('EditarCitaPaciente.hbs',{errors,Titulo,Dia,Hora,Descripcion})
    }else{
        await Cita.findByIdAndUpdate(req.params.id,{Titulo,Dia,Hora,Descripcion})
        req.flash('success_msg','La Cita se edito exitosamente');
        res.redirect('/Paciente/Citas');
    }
});

router.get('/Paciente/Citas',isAuthenticatedP,async (req,res) =>{
    const Citas = await Cita.find({IDDOCTOR:req.user.IDDOCTOR,Usuario:req.user.Usuario});
    res.render('CitasPaciente.hbs',{Citas});
});

router.get('/Paciente/Dientes/:id',isAuthenticatedP,async(req,res) =>{
    const pat = await Paciente.findById(req.params.id);
    const dientes = await Diente.find({IDDOCTOR:pat.IDDOCTOR,IDUSUARIO:pat.id,Usuario:pat.Usuario});
    res.render('DientesPaciente.hbs',{dientes});
});

router.get('/Paciente/MiDoctor/:id',isAuthenticatedP,async (req,res) =>{
    const Doctor = await User.find({_id:req.params.id,Cedula:req.user.Cedula});
    res.render('MiDoctor.hbs',{Doctor});
});

//RUTAS DEL DOCTOR

router.get('/Doctor',isAuthenticated,async(req,res) =>{
    res.render('Doctor.hbs');
});

router.post('/Doctor',isAuthenticated,(req,res) =>{
    res.render('Doctor.hbs');
});

router.get('/Doctor/Citas',isAuthenticated,async(req,res) =>{
    const Citas = await Cita.find({IDDOCTOR:req.user.id});
    res.render('CitasDoctor.hbs',{Citas});
});

router.post('/Doctor/Citas',isAuthenticated,(req,res) =>{
    res.render('CitasDoctor.hbs');
});

router.get('/Doctor/Citas/ConfirmarC/:id',isAuthenticated,async(req,res) =>{
        const Confirmacion = true;
        await Cita.findByIdAndUpdate(req.params.id,{Confirmacion})
        req.flash('success_msg','La Cita fue Confirmada');
        res.redirect('/Doctor/Citas');
});

router.get('/Doctor/Citas/RechazarC/:id',isAuthenticated,async(req,res) =>{
        const Rechazo = true;
        await Cita.findByIdAndUpdate(req.params.id,{Rechazo})
        req.flash('success_msg','La Cita fue Rechazada');
        res.redirect('/Doctor/Citas');
});

router.delete('/Doctor/Citas/EliminarC/:id',isAuthenticated,async(req,res) =>{
    await Cita.findByIdAndDelete(req.params.id);
    req.flash('success_msg','La Cita se elimino exitosamente');
    res.redirect('/Doctor/Citas');
});

router.delete('/Doctor/Notas/EliminarN/:id',isAuthenticated,async(req,res) =>{
    await NotaD.findByIdAndDelete(req.params.id);
    req.flash('success_msg','La nota se elimino exitosamente');
    res.redirect('/Doctor/Notas');
});

router.delete('/Doctor/Notas/EliminarNP/:id',isAuthenticated,async(req,res) =>{
    await NotaP.findByIdAndDelete(req.params.id);
    req.flash('success_msg','la nota se elimino exitosamente');
    res.redirect('/Doctor/NotasPaciente');
});

router.get('/Doctor/Notas',isAuthenticated,async(req,res) =>{
    const Notas = await NotaD.find({IDDOCTOR:req.user.id});
    res.render('NotasDoctor.hbs',{Notas});
});

router.get('/Doctor/NotasPaciente',isAuthenticated,async(req,res) =>{
    const Notas = await NotaP.find({IDDOCTOR:req.user.id});
    res.render('NotasPacienteDoctor.hbs',{Notas});
});

router.get('/Doctor/Notas/NuevaN',isAuthenticated,async(req,res) =>{
    const Notas = await NotaD.find({IDDOCTOR:req.user.id});
    const Pacientes = await Paciente.find({IDDOCTOR:req.user.id});
    res.render('NuevaNotaDoctor.hbs',{Notas,Pacientes});
});

router.post('/Doctor/Notas/NuevaN',isAuthenticated,async(req,res) =>{
    const { Titulo,Usuario,Descripcion }=req.body;
    const errors = [];
            function Espacios(parametro){
        var patron=/^\s+$/;
        if(patron.test(parametro)){
            return false;
        }else{
            return true;
        }
    };
if(!Espacios(Titulo)||!Espacios(Descripcion)||!Espacios(Usuario)){
        errors.push({text: 'Tienes que insertar datos'});
    }
    if(!Titulo || !Descripcion || !Usuario){
      errors.push({text: 'Te falta completar un dato'});   
    }
    if(Descripcion.length > 200){
      errors.push({text: 'La Descripcion es muy larga'});  
    }
    if(errors.length > 0){
        console.log('Entre a los errorees del paciente');
      res.render('NuevaNotaDoctor.hbs',{errors,Titulo,Usuario,Descripcion})
    }else{
            const NewNote = new NotaD({Titulo,Usuario,Descripcion});
            NewNote.Nombre = req.user.Nombre;
            NewNote.Apellido = req.user.Apellido;
            NewNote.IDDOCTOR = req.user.id;
            await NewNote.save();
            req.flash('success_msg','La nota se añadio con exito');
            res.redirect('/Doctor/Notas');   
    }
});

router.put('/Doctor/Notas/EditarN/:id',isAuthenticated,async(req,res) =>{
    const {Titulo,Usuario,Descripcion} = req.body;
    const errors = [];
                function Espacios(parametro){
        var patron=/^\s+$/;
        if(patron.test(parametro)){
            return false;
        }else{
            return true;
        }
    };
if(!Espacios(Titulo)||!Espacios(Descripcion)||!Espacios(Usuario)){
        errors.push({text: 'Tienes que insertar datos'});
    }
    if(!Titulo || !Descripcion || !Usuario){
        errors.push({text: 'Te falta completar un dato'});
    }
    if(errors.length > 0){
        console.log('Entre a los errorees del paciente');
        res.render('EditarNotaDoctor.hbs',{errors,Usuario,Titulo,Descripcion})
    }else{
        await NotaD.findByIdAndUpdate(req.params.id,{Titulo,Usuario,Descripcion})
        req.flash('success_msg','La Nota se edito exitosamente');
        res.redirect('/Doctor/Notas');
    }
});

router.get('/Doctor/Notas/EditarN/:id',isAuthenticated,async(req,res) =>{
    const epa = await NotaD.findById(req.params.id);
    const Pacientes = await Paciente.find({IDDOCTOR:req.user.id});
    res.render('EditarNotaDoctor.hbs',{epa,Pacientes});
});

router.get('/Doctor/Pacientes',isAuthenticated,async(req,res) =>{
    const Pacientes = await Paciente.find({IDDOCTOR:req.user.id});
    res.render('PacientesDoctor.hbs',{Pacientes});
});

router.post('/Doctor/Pacientes',isAuthenticated,(req,res) =>{
    res.render('PacientesDoctor.hbs');
});

router.get('/Doctor/Pacientes/DientesP/:id',isAuthenticated,async (req,res) =>{
    const pat = await Paciente.findById(req.params.id);
    const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:pat.id,Usuario:pat.Usuario});
    res.render('DientesDoctor.hbs',{dientes});
});

router.get('/Doctor/Pacientes/NuevoP',isAuthenticated,(req,res) =>{
    res.render('NuevoPaciente.hbs');
});

router.post('/Doctor/Pacientes/NuevoP',isAuthenticated,async(req,res) =>{
    const {Nombre,Apellido,Usuario,Descripcion,Sexo} = req.body;
    const errors = [];
    const errors2 = [];
                function Espacios(parametro){
        var patron=/^\s+$/;
        if(patron.test(parametro)){
            return false;
        }else{
            return true;
        }
    };
if(!Espacios(Nombre)||!Espacios(Descripcion)||!Espacios(Usuario)||!Espacios(Apellido)){
        errors.push({text: 'Tienes que insertar datos'});
    }
    if(!Nombre || !Apellido || !Usuario || !Descripcion){
        errors.push({text: 'Te falta completar un dato'});
    }
    if(errors.length > 0){
        console.log('Entre a los errorees del Doctor');
        res.render('NuevoPaciente.hbs',{errors,Nombre,Apellido,Usuario,Descripcion})
    }else{
        const TheUser = await Paciente.findOne({Usuario:Usuario,IDDOCTOR:req.user.id})
        if(TheUser){
            errors2.push({text: 'El nombre de usuario ya existe'});
            if(errors2.length = 1){
               res.render('NuevoPaciente.hbs',{errors2,Nombre,Apellido,Usuario,Descripcion}) 
            }else{
                console.log('No c que pedo');
            }
            
        }else{
            
            const newPaciente = new Paciente({Nombre,Apellido,Usuario,Descripcion});
            newPaciente.Cedula = req.user.Cedula;
            newPaciente.IDDOCTOR = req.user.id;
            
            if(Sexo=="Masculino"){
                console.log('Fue masculino');
                await newPaciente.save();
                
                console.log('Va a buscar a el usuario '+Usuario);
                console.log('Va a buscar a el usuario '+req.user.id);
                const pat = await Paciente.findOne({Usuario:Usuario,IDDOCTOR:req.user.id});
                console.log('El nuevo usuario con sus dientes es '+pat.id); 
                const newDiente = new Diente({Nombre,Apellido,Usuario});
                newDiente.IDUSUARIO = pat.id;
                newDiente.IDDOCTOR = req.user.id;
                await newDiente.save();
                
                req.flash('success_msg','El paciente fue dado de alta correctamente');
                res.redirect('/Doctor/Pacientes');
            }else{
                console.log('Error2');
            newPaciente.Sexo = true;
            await newPaciente.save();
                
                console.log('Va a buscar a el usuario '+Usuario);
                console.log('Va a buscar a el usuario '+req.user.id);
                const pat = await Paciente.findOne({Usuario:Usuario,IDDOCTOR:req.user.id});
                console.log('El nuevo usuario con sus dientes es '+pat.id); 
                const newDiente = new Diente({Nombre,Apellido,Usuario});
                newDiente.IDUSUARIO = pat.id;
                newDiente.IDDOCTOR = req.user.id;
                await newDiente.save();
                  
            req.flash('success_msg','El paciente fue dado de alta correctamente');
            res.redirect('/Doctor/Pacientes');
            }
        }
    }
});

router.get('/Doctor/Pacientes/EditarP/:id',isAuthenticated,async(req,res) =>{
    const pa = await Paciente.findById(req.params.id);
    res.render('EditarPaciente.hbs',{pa});
});

router.put('/Doctor/Pacientes/EditarP/:id',isAuthenticated,async(req,res) =>{
    const {Nombre,Apellido,Usuario,Descripcion} = req.body;
    const errors = [];
                    function Espacios(parametro){
        var patron=/^\s+$/;
        if(patron.test(parametro)){
            return false;
        }else{
            return true;
        }
    };
if(!Espacios(Nombre)||!Espacios(Descripcion)||!Espacios(Usuario)||!Espacios(Apellido)){
        errors.push({text: 'Tienes que insertar datos'});
    }
    if(!Nombre || !Apellido || !Usuario || !Descripcion){
        errors.push({text: 'Te falta completar un dato'});
    }
    if(errors.length > 0){
        console.log('Entre a los errorees del Doctor');
        res.render('EditarPaciente.hbs',{errors,Nombre,Apellido,Usuario,Descripcion})
    }else{
        await Paciente.findByIdAndUpdate(req.params.id,{Nombre,Apellido,Usuario,Descripcion})
        req.flash('success_msg','El paciente se edito correctamente');
        res.redirect('/Doctor/Pacientes');
        
    }
});

router.delete('/Doctor/Pacientes/EliminarP/:id',isAuthenticated,async(req,res) =>{
    await Paciente.findByIdAndDelete(req.params.id);
    req.flash('success_msg','El paciente fue eliminado');
    res.redirect('/Doctor/Pacientes');
});

router.get('/Doctor/MiPerfil/:id',isAuthenticated,async (req,res) =>{
    const Doctor = await User.find({_id:req.params.id,Cedula:req.user.Cedula});
    res.render('MiPerfil.hbs',{Doctor});
});

router.put('/Doctor/EditarMiPerfil/:id',isAuthenticated,async (req,res) =>{
    const errors = [];
    const errors2 = [];
    const Doctor = await User.find({_id:req.params.id,Cedula:req.user.Cedula});
    const { Nombre,Apellido,Cedula,Correo,Usuario,Consultorio,Telefono}=req.body;
    function Espacios(parametro){
        var patron=/^\s+$/;
        if(patron.test(parametro)){
            return false;
        }else{
            return true;
        }
    };
if(!Espacios(Nombre)||!Espacios(Apellido)||!Espacios(Usuario)||!Espacios(Correo)){
        errors.push({text: 'Tienes que insertar datos'});
    }
    if(!Espacios(Consultorio)){
        errors.push({text: 'Si ingresas un consultorio, hay que escribir algo'});
    }
    if(!Nombre || !Apellido || !Correo || !Usuario || !Cedula){
      errors.push({text: 'Te falta completar un dato'});   
    }
    if(errors.length > 0){
        console.log('Entre a los errorees');
      res.render('MiPerfil.hbs',{errors,Doctor})
    }else{
        const TheUser = await User.findOne({Usuario:Usuario})
        const TheUserF = await User.findById(req.params.id)
        const TheEmail = await User.findOne({Correo:Correo})
        //Saber si son los mismos datos, o erroneos
        if(!TheUser){
            if(!TheEmail){
                 await User.findByIdAndUpdate(req.params.id,{Nombre,Apellido,Usuario,Consultorio,Correo,Telefono})
        req.flash('success_msg','Editaste tu perfil de forma exitosa');
        res.redirect('/Doctor');
            }
        }
        
        
        if(TheUser){
            if(TheUser.id==TheUserF.id){
                if(TheEmail){
                    if(TheEmail.id==TheUserF.id){
                        console.log('Mismo Usuario '+TheUser.id+' '+TheUserF.id);
                         await User.findByIdAndUpdate(req.params.id,{Nombre,Apellido,Usuario,Consultorio,Correo,Telefono})
        req.flash('success_msg','Editaste tu perfil de forma exitosa');
        res.redirect('/Doctor');
                    }else if(!(TheUserF.Correo==Correo)){
                        req.flash('success_msg','El correo que introduciste, ya esta seleccionado');
                        errors2.push({text: 'El correo que introduciste ya esta seleccionado'});
                        if(errors2.length > 0){
                            console.log('Entre a los errorees del correo');
                            res.render('MiPerfil.hbs',{errors2,Doctor})
                    }}
                }else{
                    await User.findByIdAndUpdate(req.params.id,{Nombre,Apellido,Usuario,Consultorio,Correo,Telefono})
        req.flash('success_msg','Editaste tu perfil de forma exitosa');
        res.redirect('/Doctor');
                }  
            }else if(!(TheUserF.Usuario==Usuario)){
                req.flash('error_msg','El nombre de usuario que introduciste, ya esta seleccionado');
                errors2.push({text: 'El nombre de usuario que introduciste ya esta seleccionado'});
                if(errors2.length > 0){
                console.log('Entre a los errorees del usuario');
                res.render('MiPerfil.hbs',{errors2,Doctor})
                }
            }
        }else{
            if(TheEmail){
                    if(TheEmail.id==TheUserF.id){
                        console.log('Mismo Usuario ');
                        await User.findByIdAndUpdate(req.params.id,{Nombre,Apellido,Usuario,Consultorio,Correo,Telefono})
        req.flash('success_msg','Editaste tu perfil de forma exitosa');
        res.redirect('/Doctor');
                    }else if(!(TheUserF.Correo==Correo)){
                        req.flash('success_msg','El correo que introduciste, ya esta seleccionado');
                        errors2.push({text: 'El correo que introduciste ya esta seleccionado'});
                        if(errors2.length > 0){
                            console.log('Entre a los errorees del correo');
                            res.render('MiPerfil.hbs',{errors2,Doctor})
                    }}
                }else{
        await User.findByIdAndUpdate(req.params.id,{Nombre,Apellido,Usuario,Consultorio,Correo,Telefono})
        req.flash('success_msg','Editaste tu perfil de forma exitosa');
        res.redirect('/Doctor');
                    
                } 
        }
        
    }
        
});

router.put('/Doctor/Pacientes/EditarEstadoDiente/:id',isAuthenticated,async (req,res)=>{
        const {ICSD} = req.body;
        const errors = [];
        function Espacios(parametro){
            var patron=/^\s+$/;
            if(patron.test(parametro)){
                return false;
            }else{
                return true;
            }
        };
        if(!Espacios(ICSD)){
            errors.push({text: 'Tienes que insertar datos'});
        }
        if(errors.length > 0){
            console.log('Entre a los errorees del paciente');
            res.render('EditarNotaDoctor.hbs',{errors,Usuario,Titulo,Descripcion})
        }else{
            console.log('La descripcion de ICSD es '+ICSD);
        }
});


router.put('/Doctor/Pacientes/ICSD/:IDUSUARIO/:id',isAuthenticated,async (req,res)=>{
    console.log('ESTOY OBTENIENDO LA ID '+req.params.IDUSUARIO);
    console.log('ESTOY OBTENIENDO LA ID de dientes'+req.params.id);
        const {ICSD} = req.body;
        const errors = [];
        const exitos = [];  
        function Espacios(parametro){
            var patron=/^\s+$/;
            if(patron.test(parametro)){
                return false;
            }else{
                return true;
            }
        };
        if(!Espacios(ICSD)){
            errors.push({text: 'Tienes que insertar datos'});
        }
        if(errors.length > 0){
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            console.log('Entre a los errorees del paciente');
            res.render('DientesDoctor.hbs',{errors,dientes})
        }else{
            await Diente.findByIdAndUpdate(req.params.id,{ICSD});
            exitos.push({text: 'El estado del diente se actualizo con exito'});
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            res.render('DientesDoctor.hbs',{exitos,dientes});
        }
});

router.put('/Doctor/Pacientes/ILSD/:IDUSUARIO/:id',isAuthenticated,async (req,res)=>{
    console.log('ESTOY OBTENIENDO LA ID '+req.params.IDUSUARIO);
    console.log('ESTOY OBTENIENDO LA ID de dientes'+req.params.id);
        const {ILSD} = req.body;
        const errors = [];
        const exitos = [];  
        function Espacios(parametro){
            var patron=/^\s+$/;
            if(patron.test(parametro)){
                return false;
            }else{
                return true;
            }
        };
        if(!Espacios(ILSD)){
            errors.push({text: 'Tienes que insertar datos'});
        }
        if(errors.length > 0){
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            console.log('Entre a los errorees del paciente');
            res.render('DientesDoctor.hbs',{errors,dientes})
        }else{
            await Diente.findByIdAndUpdate(req.params.id,{ILSD});
            exitos.push({text: 'El estado del diente se actualizo con exito'});
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            res.render('DientesDoctor.hbs',{exitos,dientes});
        }
});

router.put('/Doctor/Pacientes/CSD/:IDUSUARIO/:id',isAuthenticated,async (req,res)=>{
    console.log('ESTOY OBTENIENDO LA ID '+req.params.IDUSUARIO);
    console.log('ESTOY OBTENIENDO LA ID de dientes'+req.params.id);
        const {CSD} = req.body;
        const errors = [];
        const exitos = [];  
        function Espacios(parametro){
            var patron=/^\s+$/;
            if(patron.test(parametro)){
                return false;
            }else{
                return true;
            }
        };
        if(!Espacios(CSD)){
            errors.push({text: 'Tienes que insertar datos'});
        }
        if(errors.length > 0){
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            console.log('Entre a los errorees del paciente');
            res.render('DientesDoctor.hbs',{errors,dientes})
        }else{
            await Diente.findByIdAndUpdate(req.params.id,{CSD});
            exitos.push({text: 'El estado del diente se actualizo con exito'});
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            res.render('DientesDoctor.hbs',{exitos,dientes});
        }
});

router.put('/Doctor/Pacientes/PPSD/:IDUSUARIO/:id',isAuthenticated,async (req,res)=>{
    console.log('ESTOY OBTENIENDO LA ID '+req.params.IDUSUARIO);
    console.log('ESTOY OBTENIENDO LA ID de dientes'+req.params.id);
        const {PPSD} = req.body;
        const errors = [];
        const exitos = [];  
        function Espacios(parametro){
            var patron=/^\s+$/;
            if(patron.test(parametro)){
                return false;
            }else{
                return true;
            }
        };
        if(!Espacios(PPSD)){
            errors.push({text: 'Tienes que insertar datos'});
        }
        if(errors.length > 0){
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            console.log('Entre a los errorees del paciente');
            res.render('DientesDoctor.hbs',{errors,dientes})
        }else{
            await Diente.findByIdAndUpdate(req.params.id,{PPSD});
            exitos.push({text: 'El estado del diente se actualizo con exito'});
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            res.render('DientesDoctor.hbs',{exitos,dientes});
        }
});

router.put('/Doctor/Pacientes/SPSD/:IDUSUARIO/:id',isAuthenticated,async (req,res)=>{
    console.log('ESTOY OBTENIENDO LA ID '+req.params.IDUSUARIO);
    console.log('ESTOY OBTENIENDO LA ID de dientes'+req.params.id);
        const {SPSD} = req.body;
        const errors = [];
        const exitos = [];  
        function Espacios(parametro){
            var patron=/^\s+$/;
            if(patron.test(parametro)){
                return false;
            }else{
                return true;
            }
        };
        if(!Espacios(SPSD)){
            errors.push({text: 'Tienes que insertar datos'});
        }
        if(errors.length > 0){
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            console.log('Entre a los errorees del paciente');
            res.render('DientesDoctor.hbs',{errors,dientes})
        }else{
            await Diente.findByIdAndUpdate(req.params.id,{SPSD});
            exitos.push({text: 'El estado del diente se actualizo con exito'});
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            res.render('DientesDoctor.hbs',{exitos,dientes});
        }
});

router.put('/Doctor/Pacientes/PMSD/:IDUSUARIO/:id',isAuthenticated,async (req,res)=>{
    console.log('ESTOY OBTENIENDO LA ID '+req.params.IDUSUARIO);
    console.log('ESTOY OBTENIENDO LA ID de dientes'+req.params.id);
        const {PMSD} = req.body;
        const errors = [];
        const exitos = [];  
        function Espacios(parametro){
            var patron=/^\s+$/;
            if(patron.test(parametro)){
                return false;
            }else{
                return true;
            }
        };
        if(!Espacios(PMSD)){
            errors.push({text: 'Tienes que insertar datos'});
        }
        if(errors.length > 0){
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            console.log('Entre a los errorees del paciente');
            res.render('DientesDoctor.hbs',{errors,dientes})
        }else{
            await Diente.findByIdAndUpdate(req.params.id,{PMSD});
            exitos.push({text: 'El estado del diente se actualizo con exito'});
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            res.render('DientesDoctor.hbs',{exitos,dientes});
        }
});

router.put('/Doctor/Pacientes/SMSD/:IDUSUARIO/:id',isAuthenticated,async (req,res)=>{
    console.log('ESTOY OBTENIENDO LA ID '+req.params.IDUSUARIO);
    console.log('ESTOY OBTENIENDO LA ID de dientes'+req.params.id);
        const {SMSD} = req.body;
        const errors = [];
        const exitos = [];  
        function Espacios(parametro){
            var patron=/^\s+$/;
            if(patron.test(parametro)){
                return false;
            }else{
                return true;
            }
        };
        if(!Espacios(SMSD)){
            errors.push({text: 'Tienes que insertar datos'});
        }
        if(errors.length > 0){
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            console.log('Entre a los errorees del paciente');
            res.render('DientesDoctor.hbs',{errors,dientes})
        }else{
            await Diente.findByIdAndUpdate(req.params.id,{SMSD});
            exitos.push({text: 'El estado del diente se actualizo con exito'});
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            res.render('DientesDoctor.hbs',{exitos,dientes});
        }
});

router.put('/Doctor/Pacientes/TMSD/:IDUSUARIO/:id',isAuthenticated,async (req,res)=>{
    console.log('ESTOY OBTENIENDO LA ID '+req.params.IDUSUARIO);
    console.log('ESTOY OBTENIENDO LA ID de dientes'+req.params.id);
        const {TMSD} = req.body;
        const errors = [];
        const exitos = [];  
        function Espacios(parametro){
            var patron=/^\s+$/;
            if(patron.test(parametro)){
                return false;
            }else{
                return true;
            }
        };
        if(!Espacios(TMSD)){
            errors.push({text: 'Tienes que insertar datos'});
        }
        if(errors.length > 0){
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            console.log('Entre a los errorees del paciente');
            res.render('DientesDoctor.hbs',{errors,dientes})
        }else{
            await Diente.findByIdAndUpdate(req.params.id,{TMSD});
            exitos.push({text: 'El estado del diente se actualizo con exito'});
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            res.render('DientesDoctor.hbs',{exitos,dientes});
        }
});


router.put('/Doctor/Pacientes/TMID/:IDUSUARIO/:id',isAuthenticated,async (req,res)=>{
    console.log('ESTOY OBTENIENDO LA ID '+req.params.IDUSUARIO);
    console.log('ESTOY OBTENIENDO LA ID de dientes'+req.params.id);
        const {TMID} = req.body;
        const errors = [];
        const exitos = [];  
        function Espacios(parametro){
            var patron=/^\s+$/;
            if(patron.test(parametro)){
                return false;
            }else{
                return true;
            }
        };
        if(!Espacios(TMID)){
            errors.push({text: 'Tienes que insertar datos'});
        }
        if(errors.length > 0){
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            console.log('Entre a los errorees del paciente');
            res.render('DientesDoctor.hbs',{errors,dientes})
        }else{
            await Diente.findByIdAndUpdate(req.params.id,{TMID});
            exitos.push({text: 'El estado del diente se actualizo con exito'});
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            res.render('DientesDoctor.hbs',{exitos,dientes});
        }
});

router.put('/Doctor/Pacientes/SMID/:IDUSUARIO/:id',isAuthenticated,async (req,res)=>{
    console.log('ESTOY OBTENIENDO LA ID '+req.params.IDUSUARIO);
    console.log('ESTOY OBTENIENDO LA ID de dientes'+req.params.id);
        const {SMID} = req.body;
        const errors = [];
        const exitos = [];  
        function Espacios(parametro){
            var patron=/^\s+$/;
            if(patron.test(parametro)){
                return false;
            }else{
                return true;
            }
        };
        if(!Espacios(SMID)){
            errors.push({text: 'Tienes que insertar datos'});
        }
        if(errors.length > 0){
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            console.log('Entre a los errorees del paciente');
            res.render('DientesDoctor.hbs',{errors,dientes})
        }else{
            await Diente.findByIdAndUpdate(req.params.id,{SMID});
            exitos.push({text: 'El estado del diente se actualizo con exito'});
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            res.render('DientesDoctor.hbs',{exitos,dientes});
        }
});

router.put('/Doctor/Pacientes/PMID/:IDUSUARIO/:id',isAuthenticated,async (req,res)=>{
    console.log('ESTOY OBTENIENDO LA ID '+req.params.IDUSUARIO);
    console.log('ESTOY OBTENIENDO LA ID de dientes'+req.params.id);
        const {PMID} = req.body;
        const errors = [];
        const exitos = [];  
        function Espacios(parametro){
            var patron=/^\s+$/;
            if(patron.test(parametro)){
                return false;
            }else{
                return true;
            }
        };
        if(!Espacios(PMID)){
            errors.push({text: 'Tienes que insertar datos'});
        }
        if(errors.length > 0){
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            console.log('Entre a los errorees del paciente');
            res.render('DientesDoctor.hbs',{errors,dientes})
        }else{
            await Diente.findByIdAndUpdate(req.params.id,{PMID});
            exitos.push({text: 'El estado del diente se actualizo con exito'});
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            res.render('DientesDoctor.hbs',{exitos,dientes});
        }
});

router.put('/Doctor/Pacientes/SPID/:IDUSUARIO/:id',isAuthenticated,async (req,res)=>{
    console.log('ESTOY OBTENIENDO LA ID '+req.params.IDUSUARIO);
    console.log('ESTOY OBTENIENDO LA ID de dientes'+req.params.id);
        const {SPID} = req.body;
        const errors = [];
        const exitos = [];  
        function Espacios(parametro){
            var patron=/^\s+$/;
            if(patron.test(parametro)){
                return false;
            }else{
                return true;
            }
        };
        if(!Espacios(SPID)){
            errors.push({text: 'Tienes que insertar datos'});
        }
        if(errors.length > 0){
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            console.log('Entre a los errorees del paciente');
            res.render('DientesDoctor.hbs',{errors,dientes})
        }else{
            await Diente.findByIdAndUpdate(req.params.id,{SPID});
            exitos.push({text: 'El estado del diente se actualizo con exito'});
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            res.render('DientesDoctor.hbs',{exitos,dientes});
        }
});

router.put('/Doctor/Pacientes/PPID/:IDUSUARIO/:id',isAuthenticated,async (req,res)=>{
    console.log('ESTOY OBTENIENDO LA ID '+req.params.IDUSUARIO);
    console.log('ESTOY OBTENIENDO LA ID de dientes'+req.params.id);
        const {PPID} = req.body;
        const errors = [];
        const exitos = [];  
        function Espacios(parametro){
            var patron=/^\s+$/;
            if(patron.test(parametro)){
                return false;
            }else{
                return true;
            }
        };
        if(!Espacios(PPID)){
            errors.push({text: 'Tienes que insertar datos'});
        }
        if(errors.length > 0){
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            console.log('Entre a los errorees del paciente');
            res.render('DientesDoctor.hbs',{errors,dientes})
        }else{
            await Diente.findByIdAndUpdate(req.params.id,{PPID});
            exitos.push({text: 'El estado del diente se actualizo con exito'});
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            res.render('DientesDoctor.hbs',{exitos,dientes});
        }
});

router.put('/Doctor/Pacientes/CID/:IDUSUARIO/:id',isAuthenticated,async (req,res)=>{
    console.log('ESTOY OBTENIENDO LA ID '+req.params.IDUSUARIO);
    console.log('ESTOY OBTENIENDO LA ID de dientes'+req.params.id);
        const {CID} = req.body;
        const errors = [];
        const exitos = [];  
        function Espacios(parametro){
            var patron=/^\s+$/;
            if(patron.test(parametro)){
                return false;
            }else{
                return true;
            }
        };
        if(!Espacios(CID)){
            errors.push({text: 'Tienes que insertar datos'});
        }
        if(errors.length > 0){
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            console.log('Entre a los errorees del paciente');
            res.render('DientesDoctor.hbs',{errors,dientes})
        }else{
            await Diente.findByIdAndUpdate(req.params.id,{CID});
            exitos.push({text: 'El estado del diente se actualizo con exito'});
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            res.render('DientesDoctor.hbs',{exitos,dientes});
        }
});

router.put('/Doctor/Pacientes/ILID/:IDUSUARIO/:id',isAuthenticated,async (req,res)=>{
    console.log('ESTOY OBTENIENDO LA ID '+req.params.IDUSUARIO);
    console.log('ESTOY OBTENIENDO LA ID de dientes'+req.params.id);
        const {ILID} = req.body;
        const errors = [];
        const exitos = [];  
        function Espacios(parametro){
            var patron=/^\s+$/;
            if(patron.test(parametro)){
                return false;
            }else{
                return true;
            }
        };
        if(!Espacios(ILID)){
            errors.push({text: 'Tienes que insertar datos'});
        }
        if(errors.length > 0){
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            console.log('Entre a los errorees del paciente');
            res.render('DientesDoctor.hbs',{errors,dientes})
        }else{
            await Diente.findByIdAndUpdate(req.params.id,{ILID});
            exitos.push({text: 'El estado del diente se actualizo con exito'});
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            res.render('DientesDoctor.hbs',{exitos,dientes});
        }
});

router.put('/Doctor/Pacientes/ICID/:IDUSUARIO/:id',isAuthenticated,async (req,res)=>{
    console.log('ESTOY OBTENIENDO LA ID '+req.params.IDUSUARIO);
    console.log('ESTOY OBTENIENDO LA ID de dientes'+req.params.id);
        const {ICID} = req.body;
        const errors = [];
        const exitos = [];  
        function Espacios(parametro){
            var patron=/^\s+$/;
            if(patron.test(parametro)){
                return false;
            }else{
                return true;
            }
        };
        if(!Espacios(ICID)){
            errors.push({text: 'Tienes que insertar datos'});
        }
        if(errors.length > 0){
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            console.log('Entre a los errorees del paciente');
            res.render('DientesDoctor.hbs',{errors,dientes})
        }else{
            await Diente.findByIdAndUpdate(req.params.id,{ICID});
            exitos.push({text: 'El estado del diente se actualizo con exito'});
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            res.render('DientesDoctor.hbs',{exitos,dientes});
        }
});


router.put('/Doctor/Pacientes/ICSI/:IDUSUARIO/:id',isAuthenticated,async (req,res)=>{
    console.log('ESTOY OBTENIENDO LA ID '+req.params.IDUSUARIO);
    console.log('ESTOY OBTENIENDO LA ID de dientes'+req.params.id);
        const {ICSI} = req.body;
        const errors = [];
        const exitos = [];  
        function Espacios(parametro){
            var patron=/^\s+$/;
            if(patron.test(parametro)){
                return false;
            }else{
                return true;
            }
        };
        if(!Espacios(ICSI)){
            errors.push({text: 'Tienes que insertar datos'});
        }
        if(errors.length > 0){
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            console.log('Entre a los errorees del paciente');
            res.render('DientesDoctor.hbs',{errors,dientes})
        }else{
            await Diente.findByIdAndUpdate(req.params.id,{ICSI});
            exitos.push({text: 'El estado del diente se actualizo con exito'});
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            res.render('DientesDoctor.hbs',{exitos,dientes});
        }
});

router.put('/Doctor/Pacientes/ILSI/:IDUSUARIO/:id',isAuthenticated,async (req,res)=>{
    console.log('ESTOY OBTENIENDO LA ID '+req.params.IDUSUARIO);
    console.log('ESTOY OBTENIENDO LA ID de dientes'+req.params.id);
        const {ILSI} = req.body;
        const errors = [];
        const exitos = [];  
        function Espacios(parametro){
            var patron=/^\s+$/;
            if(patron.test(parametro)){
                return false;
            }else{
                return true;
            }
        };
        if(!Espacios(ILSI)){
            errors.push({text: 'Tienes que insertar datos'});
        }
        if(errors.length > 0){
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            console.log('Entre a los errorees del paciente');
            res.render('DientesDoctor.hbs',{errors,dientes})
        }else{
            await Diente.findByIdAndUpdate(req.params.id,{ILSI});
            exitos.push({text: 'El estado del diente se actualizo con exito'});
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            res.render('DientesDoctor.hbs',{exitos,dientes});
        }
});

router.put('/Doctor/Pacientes/CSI/:IDUSUARIO/:id',isAuthenticated,async (req,res)=>{
    console.log('ESTOY OBTENIENDO LA ID '+req.params.IDUSUARIO);
    console.log('ESTOY OBTENIENDO LA ID de dientes'+req.params.id);
        const {CSI} = req.body;
        const errors = [];
        const exitos = [];  
        function Espacios(parametro){
            var patron=/^\s+$/;
            if(patron.test(parametro)){
                return false;
            }else{
                return true;
            }
        };
        if(!Espacios(CSI)){
            errors.push({text: 'Tienes que insertar datos'});
        }
        if(errors.length > 0){
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            console.log('Entre a los errorees del paciente');
            res.render('DientesDoctor.hbs',{errors,dientes})
        }else{
            await Diente.findByIdAndUpdate(req.params.id,{CSI});
            exitos.push({text: 'El estado del diente se actualizo con exito'});
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            res.render('DientesDoctor.hbs',{exitos,dientes});
        }
});

router.put('/Doctor/Pacientes/PPSI/:IDUSUARIO/:id',isAuthenticated,async (req,res)=>{
    console.log('ESTOY OBTENIENDO LA ID '+req.params.IDUSUARIO);
    console.log('ESTOY OBTENIENDO LA ID de dientes'+req.params.id);
        const {PPSI} = req.body;
        const errors = [];
        const exitos = [];  
        function Espacios(parametro){
            var patron=/^\s+$/;
            if(patron.test(parametro)){
                return false;
            }else{
                return true;
            }
        };
        if(!Espacios(PPSI)){
            errors.push({text: 'Tienes que insertar datos'});
        }
        if(errors.length > 0){
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            console.log('Entre a los errorees del paciente');
            res.render('DientesDoctor.hbs',{errors,dientes})
        }else{
            await Diente.findByIdAndUpdate(req.params.id,{PPSI});
            exitos.push({text: 'El estado del diente se actualizo con exito'});
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            res.render('DientesDoctor.hbs',{exitos,dientes});
        }
});

router.put('/Doctor/Pacientes/SPSI/:IDUSUARIO/:id',isAuthenticated,async (req,res)=>{
    console.log('ESTOY OBTENIENDO LA ID '+req.params.IDUSUARIO);
    console.log('ESTOY OBTENIENDO LA ID de dientes'+req.params.id);
        const {SPSI} = req.body;
        const errors = [];
        const exitos = [];  
        function Espacios(parametro){
            var patron=/^\s+$/;
            if(patron.test(parametro)){
                return false;
            }else{
                return true;
            }
        };
        if(!Espacios(SPSI)){
            errors.push({text: 'Tienes que insertar datos'});
        }
        if(errors.length > 0){
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            console.log('Entre a los errorees del paciente');
            res.render('DientesDoctor.hbs',{errors,dientes})
        }else{
            await Diente.findByIdAndUpdate(req.params.id,{SPSI});
            exitos.push({text: 'El estado del diente se actualizo con exito'});
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            res.render('DientesDoctor.hbs',{exitos,dientes});
        }
});

router.put('/Doctor/Pacientes/PMSI/:IDUSUARIO/:id',isAuthenticated,async (req,res)=>{
    console.log('ESTOY OBTENIENDO LA ID '+req.params.IDUSUARIO);
    console.log('ESTOY OBTENIENDO LA ID de dientes'+req.params.id);
        const {PMSI} = req.body;
        const errors = [];
        const exitos = [];  
        function Espacios(parametro){
            var patron=/^\s+$/;
            if(patron.test(parametro)){
                return false;
            }else{
                return true;
            }
        };
        if(!Espacios(PMSI)){
            errors.push({text: 'Tienes que insertar datos'});
        }
        if(errors.length > 0){
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            console.log('Entre a los errorees del paciente');
            res.render('DientesDoctor.hbs',{errors,dientes})
        }else{
            await Diente.findByIdAndUpdate(req.params.id,{PMSI});
            exitos.push({text: 'El estado del diente se actualizo con exito'});
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            res.render('DientesDoctor.hbs',{exitos,dientes});
        }
});

router.put('/Doctor/Pacientes/SMSI/:IDUSUARIO/:id',isAuthenticated,async (req,res)=>{
    console.log('ESTOY OBTENIENDO LA ID '+req.params.IDUSUARIO);
    console.log('ESTOY OBTENIENDO LA ID de dientes'+req.params.id);
        const {SMSI} = req.body;
        const errors = [];
        const exitos = [];  
        function Espacios(parametro){
            var patron=/^\s+$/;
            if(patron.test(parametro)){
                return false;
            }else{
                return true;
            }
        };
        if(!Espacios(SMSI)){
            errors.push({text: 'Tienes que insertar datos'});
        }
        if(errors.length > 0){
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            console.log('Entre a los errorees del paciente');
            res.render('DientesDoctor.hbs',{errors,dientes})
        }else{
            await Diente.findByIdAndUpdate(req.params.id,{SMSI});
            exitos.push({text: 'El estado del diente se actualizo con exito'});
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            res.render('DientesDoctor.hbs',{exitos,dientes});
        }
});

router.put('/Doctor/Pacientes/TMSI/:IDUSUARIO/:id',isAuthenticated,async (req,res)=>{
    console.log('ESTOY OBTENIENDO LA ID '+req.params.IDUSUARIO);
    console.log('ESTOY OBTENIENDO LA ID de dientes'+req.params.id);
        const {TMSI} = req.body;
        const errors = [];
        const exitos = [];  
        function Espacios(parametro){
            var patron=/^\s+$/;
            if(patron.test(parametro)){
                return false;
            }else{
                return true;
            }
        };
        if(!Espacios(TMSI)){
            errors.push({text: 'Tienes que insertar datos'});
        }
        if(errors.length > 0){
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            console.log('Entre a los errorees del paciente');
            res.render('DientesDoctor.hbs',{errors,dientes})
        }else{
            await Diente.findByIdAndUpdate(req.params.id,{TMSI});
            exitos.push({text: 'El estado del diente se actualizo con exito'});
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            res.render('DientesDoctor.hbs',{exitos,dientes});
        }
});


router.put('/Doctor/Pacientes/TMII/:IDUSUARIO/:id',isAuthenticated,async (req,res)=>{
    console.log('ESTOY OBTENIENDO LA ID '+req.params.IDUSUARIO);
    console.log('ESTOY OBTENIENDO LA ID de dientes'+req.params.id);
        const {TMII} = req.body;
        const errors = [];
        const exitos = [];  
        function Espacios(parametro){
            var patron=/^\s+$/;
            if(patron.test(parametro)){
                return false;
            }else{
                return true;
            }
        };
        if(!Espacios(TMII)){
            errors.push({text: 'Tienes que insertar datos'});
        }
        if(errors.length > 0){
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            console.log('Entre a los errorees del paciente');
            res.render('DientesDoctor.hbs',{errors,dientes})
        }else{
            await Diente.findByIdAndUpdate(req.params.id,{TMII});
            exitos.push({text: 'El estado del diente se actualizo con exito'});
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            res.render('DientesDoctor.hbs',{exitos,dientes});
        }
});

router.put('/Doctor/Pacientes/SMII/:IDUSUARIO/:id',isAuthenticated,async (req,res)=>{
    console.log('ESTOY OBTENIENDO LA ID '+req.params.IDUSUARIO);
    console.log('ESTOY OBTENIENDO LA ID de dientes'+req.params.id);
        const {SMII} = req.body;
        const errors = [];
        const exitos = [];  
        function Espacios(parametro){
            var patron=/^\s+$/;
            if(patron.test(parametro)){
                return false;
            }else{
                return true;
            }
        };
        if(!Espacios(SMII)){
            errors.push({text: 'Tienes que insertar datos'});
        }
        if(errors.length > 0){
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            console.log('Entre a los errorees del paciente');
            res.render('DientesDoctor.hbs',{errors,dientes})
        }else{
            await Diente.findByIdAndUpdate(req.params.id,{SMII});
            exitos.push({text: 'El estado del diente se actualizo con exito'});
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            res.render('DientesDoctor.hbs',{exitos,dientes});
        }
});

router.put('/Doctor/Pacientes/PMII/:IDUSUARIO/:id',isAuthenticated,async (req,res)=>{
    console.log('ESTOY OBTENIENDO LA ID '+req.params.IDUSUARIO);
    console.log('ESTOY OBTENIENDO LA ID de dientes'+req.params.id);
        const {PMII} = req.body;
        const errors = [];
        const exitos = [];  
        function Espacios(parametro){
            var patron=/^\s+$/;
            if(patron.test(parametro)){
                return false;
            }else{
                return true;
            }
        };
        if(!Espacios(PMII)){
            errors.push({text: 'Tienes que insertar datos'});
        }
        if(errors.length > 0){
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            console.log('Entre a los errorees del paciente');
            res.render('DientesDoctor.hbs',{errors,dientes})
        }else{
            await Diente.findByIdAndUpdate(req.params.id,{PMII});
            exitos.push({text: 'El estado del diente se actualizo con exito'});
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            res.render('DientesDoctor.hbs',{exitos,dientes});
        }
});

router.put('/Doctor/Pacientes/SPII/:IDUSUARIO/:id',isAuthenticated,async (req,res)=>{
    console.log('ESTOY OBTENIENDO LA ID '+req.params.IDUSUARIO);
    console.log('ESTOY OBTENIENDO LA ID de dientes'+req.params.id);
        const {SPII} = req.body;
        const errors = [];
        const exitos = [];  
        function Espacios(parametro){
            var patron=/^\s+$/;
            if(patron.test(parametro)){
                return false;
            }else{
                return true;
            }
        };
        if(!Espacios(SPII)){
            errors.push({text: 'Tienes que insertar datos'});
        }
        if(errors.length > 0){
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            console.log('Entre a los errorees del paciente');
            res.render('DientesDoctor.hbs',{errors,dientes})
        }else{
            await Diente.findByIdAndUpdate(req.params.id,{SPII});
            exitos.push({text: 'El estado del diente se actualizo con exito'});
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            res.render('DientesDoctor.hbs',{exitos,dientes});
        }
});

router.put('/Doctor/Pacientes/PPII/:IDUSUARIO/:id',isAuthenticated,async (req,res)=>{
    console.log('ESTOY OBTENIENDO LA ID '+req.params.IDUSUARIO);
    console.log('ESTOY OBTENIENDO LA ID de dientes'+req.params.id);
        const {PPII} = req.body;
        const errors = [];
        const exitos = [];  
        function Espacios(parametro){
            var patron=/^\s+$/;
            if(patron.test(parametro)){
                return false;
            }else{
                return true;
            }
        };
        if(!Espacios(PPII)){
            errors.push({text: 'Tienes que insertar datos'});
        }
        if(errors.length > 0){
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            console.log('Entre a los errorees del paciente');
            res.render('DientesDoctor.hbs',{errors,dientes})
        }else{
            await Diente.findByIdAndUpdate(req.params.id,{PPII});
            exitos.push({text: 'El estado del diente se actualizo con exito'});
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            res.render('DientesDoctor.hbs',{exitos,dientes});
        }
});

router.put('/Doctor/Pacientes/CII/:IDUSUARIO/:id',isAuthenticated,async (req,res)=>{
    console.log('ESTOY OBTENIENDO LA ID '+req.params.IDUSUARIO);
    console.log('ESTOY OBTENIENDO LA ID de dientes'+req.params.id);
        const {CII} = req.body;
        const errors = [];
        const exitos = [];  
        function Espacios(parametro){
            var patron=/^\s+$/;
            if(patron.test(parametro)){
                return false;
            }else{
                return true;
            }
        };
        if(!Espacios(CII)){
            errors.push({text: 'Tienes que insertar datos'});
        }
        if(errors.length > 0){
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            console.log('Entre a los errorees del paciente');
            res.render('DientesDoctor.hbs',{errors,dientes})
        }else{
            await Diente.findByIdAndUpdate(req.params.id,{CII});
            exitos.push({text: 'El estado del diente se actualizo con exito'});
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            res.render('DientesDoctor.hbs',{exitos,dientes});
        }
});

router.put('/Doctor/Pacientes/ILII/:IDUSUARIO/:id',isAuthenticated,async (req,res)=>{
    console.log('ESTOY OBTENIENDO LA ID '+req.params.IDUSUARIO);
    console.log('ESTOY OBTENIENDO LA ID de dientes'+req.params.id);
        const {ILII} = req.body;
        const errors = [];
        const exitos = [];  
        function Espacios(parametro){
            var patron=/^\s+$/;
            if(patron.test(parametro)){
                return false;
            }else{
                return true;
            }
        };
        if(!Espacios(ILII)){
            errors.push({text: 'Tienes que insertar datos'});
        }
        if(errors.length > 0){
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            console.log('Entre a los errorees del paciente');
            res.render('DientesDoctor.hbs',{errors,dientes})
        }else{
            await Diente.findByIdAndUpdate(req.params.id,{ILII});
            exitos.push({text: 'El estado del diente se actualizo con exito'});
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            res.render('DientesDoctor.hbs',{exitos,dientes});
        }
});

router.put('/Doctor/Pacientes/ICII/:IDUSUARIO/:id',isAuthenticated,async (req,res)=>{
    console.log('ESTOY OBTENIENDO LA ID '+req.params.IDUSUARIO);
    console.log('ESTOY OBTENIENDO LA ID de dientes'+req.params.id);
        const {ICII} = req.body;
        const errors = [];
        const exitos = [];  
        function Espacios(parametro){
            var patron=/^\s+$/;
            if(patron.test(parametro)){
                return false;
            }else{
                return true;
            }
        };
        if(!Espacios(ICII)){
            errors.push({text: 'Tienes que insertar datos'});
        }
        if(errors.length > 0){
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            console.log('Entre a los errorees del paciente');
            res.render('DientesDoctor.hbs',{errors,dientes})
        }else{
            await Diente.findByIdAndUpdate(req.params.id,{ICII});
            exitos.push({text: 'El estado del diente se actualizo con exito'});
            const dientes = await Diente.find({IDDOCTOR:req.user.id,IDUSUARIO:req.params.IDUSUARIO});
            res.render('DientesDoctor.hbs',{exitos,dientes});
        }
});

//SALIR

router.get('/logout',isAuthenticated,async(req,res) =>{
    req.logout();
    res.redirect('/');
});

router.get('/logoutp',isAuthenticatedP,async(req,res) =>{
    req.logout();
    res.redirect('/');
});

module.exports = router;