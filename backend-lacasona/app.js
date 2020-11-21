var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var mySQLstorage = require('express-mysql-session');
var config = require('./config/init');
var flash = require('connect-flash');
var bodyParser = require('body-parser');


var indexRouter = require('./router/index');
var usersRouter = require('./router/users');
var globalRouter = require('./router/global');
var turnoRouter = require('./router/turno');
var consultaRouter = require('./router/consulta');
var tiposPersonaRouter = require('./router/tipos_persona');
var HCRouter = require('./router/historia_clinica');
var patologiaRouter = require('./router/patologia');
var tratamientoRouter = require('./router/tratamiento');


var app = express();

app.set(require('./config/database'));
app.set('port', process.env.PORT || config.port);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(flash());
app.use(session({
  secret: config.session.secretPass,
  resave: false,
  saveUninitialized: false,
  store: mySQLstorage(config.database)
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//CONVIERTE A JSON LAS PETICIONES HTTP
app.use(bodyParser.json());
//CONFIGURA BODY-PARSER, PARA QUE BODYPARSER FUNCIONE
app.use(bodyParser.urlencoded({extended:false}));

//CONF CABECERAS HTTP, NECESARIAS PARA QUE LA API QUE ESTAMOS CONSTRUYENDO FUNCIONE A NIVEL DE AJAX
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin','*');
	res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept ,Access-Control-Allow-Request-Method');		
	res.header('Access-Control-Allow-Methods','GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow','GET, POST, OPTIONS, PUT, DELETE');
	next();	
})


// app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/global', globalRouter);
app.use('/turno', turnoRouter);
app.use('/consulta', consultaRouter);
app.use('/tipos_persona', tiposPersonaRouter);
app.use('/hc', HCRouter);
app.use('/patologia', patologiaRouter);
app.use('/tratamiento',tratamientoRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.listen(app.get('port'), () => { console.log('Listening to port: ' + app.get('port')) })


module.exports = app;
