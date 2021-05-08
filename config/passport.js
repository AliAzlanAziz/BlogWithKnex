import passportlocal from 'passport-local'
import { connection } from './configdb.js'
import bcrypt from 'bcrypt'
import { generateId } from '../function/generateid.js'
const saltRounds = 10
const LocalStrategy = passportlocal.Strategy

export default function(passport){
    passport.serializeUser(function(user, done) {
        if(user.userId)
            return done(null, { userId: user.userId })
        else
            return done(null, user)
    })

    passport.deserializeUser(async function(user, done) {
        try{
            if(user.userId){
                const users = await connection.select().table('users').where('userId', user.userId)
                return done(null, users[0])
            }else{
                return done(null, user)
            }
        }catch(err){
            return console.log('[DeserializeUser]Error: ' + err)
        }   
    })
 
    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',     
        passwordField : 'password',
        passReqToCallback : true 
    },
    async function(req, email, password, done){
        try{
            const userEmail = await connection.select().table('users').where('email', req.body.email)
            if(userEmail.length){
                return done(null, false, req.flash('error', 'That email is already taken.'))
            }else{
                const id = await generateId()
                const users = {
                    userId: id,
                    fname: req.body.fname, 
                    lname: req.body.lname, 
                    email: req.body.email, 
                    pass: req.body.password, 
                    phone: req.body.contact,
                    dp: null
                }
                bcrypt.hash(users.pass, saltRounds, function(err, hash){
                    if(err){
                        throw err
                    } 
                    users.pass = hash
                    connection.insert(users).into('users').then(console.log("User Inserted")).catch((err)=>console.log(err))
                    return done(null, users, req.flash('info', 'Signed Up successfully!'))
                })
            }
        }catch(err){
            done(err)
            console.log('[local-signup]Error: '+err)
            return
        }
    }))

    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true 
    },
    async function(req, email, password, done){
        try{
            if(!email || !password) {
                return done(null, false, req.flash('error', 'Fill all required fields(* means field is required).'))
            }
            const user = await connection.select().table('users').where('email', email)
            if(!user.length){
                return done(null, false, req.flash('error', 'No user found.'))
            }else{
                bcrypt.compare(password, user[0].pass, function(err, result){
                    if(err){
                        throw err
                    }
                    if(!result){
                        return done(null, false, req.flash('error', 'Oops! Wrong password.'))
                    }else{
                        return done(null, user[0])
                    }
                })
            }
        }catch(err){
            done(err)
            console.log('[local-login]Error: ' + err)
            return
        }
    }))
}