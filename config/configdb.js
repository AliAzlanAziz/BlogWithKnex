import knex from 'knex'
import dotenv from 'dotenv'
dotenv.config({ path: './config/config.env'})

const options = {
    host : '127.0.0.1',
    port: '3306',
    user : 'root',
    password : process.env.PASS,
    database : 'bwk' //aka BlogWithKnex
}

const connection = knex({
    client: 'mysql',
    acquireConnectionTimeout: 10000,
    pool: { min: 2, max: 12 },
    connection: {
        host : '127.0.0.1',
        user : 'root',
        password : process.env.PASS,
        database : 'bwk' //aka BlogWithKnex
    },
    // debug: true,
    log: {
        warn(message){
            console.log('Warn: ' + message)
        },
        error(message){
            console.log('Error: ' + message)
        },
        deprecate(message){
            console.log('Deprecated: ' + message)
        },
        debug(message){
            console.log('Debug: ' + message)
        },
    }
})

export { options, connection }