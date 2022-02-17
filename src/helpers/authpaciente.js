const pas = {};

pas.isAuthenticated = (req,res,next)=>{
  if(req.isAuthenticated()){
    return next();
  }
    req.flash('elol','No estas autorizado');
    res.redirect('/ISP');
};

module.exports = pas;