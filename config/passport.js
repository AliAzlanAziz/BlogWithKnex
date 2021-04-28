import passportlocal from 'passport-local'
import { connection } from './configdb.js'
import bcrypt from 'bcrypt'
import { generateUserId } from '../function/generateuserid.js'
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
                const rows = await connection.select().table('users').where('userId', user.userId)
                return done(null, rows[0])
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
            let user = req.body
            const rows = await connection.select().table('users').where('email', user.email)
            if(rows.length){
                return done(null, false, req.flash('error', 'That email is already taken.'))
            }else{
                const id = await generateUserId()
                const insertobj = {
                    userId: id,
                    fname: user.fname, 
                    lname: user.lname, 
                    email: user.email, 
                    pass: null, 
                    phone: user.contact,
                    dp: null
                }
                bcrypt.hash(user.password, saltRounds, function(err, hash){
                    if(err){
                        throw err
                    } 
                    insertobj.pass = hash
                    connection.insert(insertobj).into('users').then(console.log("inserted")).catch((err)=>console.log(err))
                    return done(null, insertobj, req.flash('info', 'Signed Up successfully!'))
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
        if(!email || !password) {
            return done(null, false, req.flash('error', 'Fill all required fields(* means field is required).'))
        }
        try{
            const rows = await connection.select().table('users').where('email', email)
            if(!rows.length){
                return done(null, false, req.flash('error', 'No user found.'))
            }else{
                bcrypt.compare(password, rows[0].pass, function(err, result){
                    if(err){
                        throw err
                    }
                    if(!result){
                        return done(null, false, req.flash('error', 'Oops! Wrong password.'))
                    }else{
                        return done(null, rows[0])
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