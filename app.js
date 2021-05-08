import express from 'express'
import session from 'express-session'
import expressMysqlSession from 'express-mysql-session'
import dotenv from 'dotenv'
import morgan from 'morgan'
import path from 'path'
import flash from 'connect-flash'
import passport from 'passport'
import methodOverride from 'method-override'
import { route as basicRoute } from './route/basic.js'
import { route as authRoute } from './route/register.js'
import { route as blogRoute } from './route/blog.js'
import { options } from './config/configdb.js'
import passportlocalstrategy from './config/passport.js'

/* initializing packages */

//give path to dotenv config for process.env.VARIABLES
dotenv.config({ path: './config/config.env'})

//initialize express
const app = express()

//parse json bodies instead of bodyParser.json() use below function 
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

//set view engine to ejs
app.set('view engine', 'ejs')

//set static files path
app.use(express.static( path.resolve() + '/public'))

// pass passport for configuration
passportlocalstrategy(passport); 

//express mysql session
expressMysqlSession(session)

//configure session
app.use(
    session({
        name: 'secret-knex-session',
        secret: 'Knex.jsKnex.jsKnex.js',
        store: new expressMysqlSession(options),
        // maxAge: 1*1*1*1*1*30*1000 ,
        resave: false,
        saveUninitialized: false,
        cookie:{
            // httponly: true, //put here some values
            originalMaxAge: 1*1*1*24*60*60*1000,
            //originalMaxAge: YEARS*MONTHS*DAYS*HOURS*MINUTES*SECONDS*MILLISECONDS
            // secure: true
        }
    })
);

//passport configuration
app.use(passport.initialize());
app.use(passport.session());

//custom methodOverride
app.use(
    methodOverride(function (req, res) {
        if(req.body && typeof req.body === 'object' && '_method' in req.body){
            // look in urlencoded POST bodies and delete it
            let method = req.body._method
            delete req.body._method
            return method
        }
    })
)

//declaring variables
const PORT = process.env.PORT || 6000
const NODE_ENV = process.env.NODE_ENV

//use morgan('dev') to log details when in development enviroment
if(NODE_ENV==='development'){
    app.use( morgan('dev') )
}

//set flash messages
app.use(flash())

//declaring global variables
app.use(function(req,res,next){
    res.locals.user=req.user || null;
    res.locals.error=req.flash('error');
    res.locals.success=req.flash('success');
    res.locals.info=req.flash('info');
    next();
});

//setting routes
app.use('/', basicRoute)
app.use('/', authRoute)
app.use('/bwk/blog', blogRoute)

//start the server
app.listen(PORT, ()=>{
    console.log(`Server started locally at PORT:${PORT} in ${NODE_ENV} environment. http://localhost:${PORT}/`)
})