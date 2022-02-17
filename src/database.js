const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://MyUser:12345@qdb.rd3yy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
   useCreateIndex: true,
   useNewUrlParser: true,
   useFindAndModify: false             
                 }).then(db => console.log('La base de datos se conecto'))
                    .catch(err =>console.error(err));