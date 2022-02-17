const helpers = {};
const User = require('../models/User');
const Paciente = require('../models/Paciente');

helpers.isAuthenticated = async(req,res,next)=>{
    
   if(req.user===undefined){
       req.flash('elol','Por favor inica sesion');
       res.redirect('/IS');
       console.log('La variable del doc estaba en null');
   }else{
            console.log('DOCTOR');
            console.log(req.user.Correo);
            const tr=User.findOne({Correo:req.user.Correo});
            if(tr.Correo=req.user.Correo){
                if(req.isAuthenticated()){
                    return next();
                }
            }else{
                req.logout();
                req.flash('elol','No estas autorizado');
                res.redirect('/IS');
            }
   }
};

helpers.isAuthenticatedP = (req,res,next)=>{
   if(req.user===undefined){
       req.flash('elol','Por favor inica sesion');
       res.redirect('/ISP');
       console.log('La variable del paciente estaba en null');
   }else{
       console.log(req.user.Usuario);
       console.log('PACIENTE');
       const tr=Paciente.findOne({Usuario:req.user.Usuario});
        if(!req.user.Correo){
            if(tr.Paciente=req.user.Usuario){
                if(req.isAuthenticated()){
                    return next();
                }
            }else{
                req.logout();
                req.flash('elol','No estas autorizado');
                res.redirect('/ISP');
            }   
       }else{
            req.logout();
            req.flash('elol','No estas autorizado');
            res.redirect('/ISP');
       }
   }
};

module.exports = helpers;