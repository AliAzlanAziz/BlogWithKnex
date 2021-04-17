import express from 'express'
import session from 'express-session'
import expressMysqlSession from 'express-mysql-session'
import dotenv from 'dotenv'
import morgan from 'morgan'
import path from 'path'
import flash from 'connect-flash'
import { route as basicRoute } from './route/basic.js';
import { route as authRoute } from './route/register.js';

/* initializing packages */

//give path to dotenv config for process.env.VARIABLES
dotenv.config({ path: './config/config.env'})

//initialize express
const app = express()

//parse json bodies instead of bodyParser.json() use below function 
app.use(express.json())

//set view engine to ejs
app.set('view engine', 'ejs')

//set static files path
app.use(express.static( path.resolve() + '/public'))

//express mysql session
// expressMysqlSession(session)

//configure session
// app.use(
//     session({
//         name: 'secret-knex-session',
//         secret: 'Knex.jsKnex.jsKnex.js',
//         store: new expressMysqlSession(configDB.connection),
//         // maxAge: 1*1*1*1*1*30*1000 ,
//         resave: false,
//         saveUninitialized: false,
//         cookie:{
//             // httponly: true, //put here some values
//             originalMaxAge: 1*1*1*24*60*60*1000,
//             //originalMaxAge: YEARS*MONTHS*DAYS*HOURS*MINUTES*SECONDS*MILLISECONDS
//             // secure: true
//         }
//     })
// );

//set flash messages
// app.use(flash())

//declaring global variables
app.use(function(req,res,next){
    res.locals.user=req.user || null;
    // res.locals.error=req.flash('error');
    // res.locals.success=req.flash('success');
    // res.locals.info=req.flash('info');
    next();
});

//setting routes
app.use('/', basicRoute)
app.use('/', authRoute)

//use morgan('dev') to log details when in development enviroment
if(process.env.NODE_ENV==='development')    app.use( morgan('dev') )

//start the server
app.listen(process.env.PORT, ()=>{
    console.log(`Server started locally at PORT:${process.env.PORT} in ${process.env.NODE_ENV} environment. http://localhost:${process.env.PORT}/`)
})