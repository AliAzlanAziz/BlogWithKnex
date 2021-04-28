import { connection } from '../config/configdb.js'
import { v4 as uuidv4 } from 'uuid'

async function generateUserId(){
    let exist = true
    do{
        let pid = uuidv4()
        const id = await uuidExistOrNot(pid)
        if(id===pid){
            exist = false
            return id
        }
    }while(exist)
}

function uuidExistOrNot(pid){
    return new Promise(async (resolve, reject) => {
        try{
            const rows = await connection.select().table('users').where('userId', pid)
            if(!rows.length){
                return resolve(pid)
            }else{
                return reject('Id already exist!')
            }
        }catch(err){
            return console.log('[GenerateUserId]Error: ' + err)
        }
    })
}

export { generateUserId }