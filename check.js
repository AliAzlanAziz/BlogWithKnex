import { connection } from './config/configdb.js'
//file to check db with knex

connection
.select()
.table('sessions')
.then((rows=>{
    console.log(rows[0])  
}))
.catch((err)=>console.log(err))
.finally(()=>console.log('Done!'))

const rows = await connection.select().table('sessions')
console.log(rows[0])