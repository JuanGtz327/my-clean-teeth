const express = require('express');
const path = require('path');
const ExHs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

//Inicializaciones
const app = express();
require('./database');
require('./config/passport');

//Ajustes
app.set('port' , process.env.PORT || 3000);
app.set('views' , path.join(__dirname, 'views'));
app.engine('.hbs' , ExHs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'),'partials'),
    extname: '.hbs'
}));
app.set('view engine' , '.hsb');

//Middlewares
app.use(express.urlencoded({extended:false}));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


//Variables
app.use((req,res,next) =>{
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.elol=req.flash('elol');
    res.locals.nav=req.flash('nav');
    res.locals.navpaciente=req.flash('navpaciente');
    res.locals.user=req.user || null;
    next();
});

//Rutas
app.use(require('./routes/index'));

//Dirnames
app.use(express.static(path.join(__dirname,'public')));

//RUN
app.listen(app.get('port'), ()=>{
    console.log('El servidor ha empezado a escuchar');
});