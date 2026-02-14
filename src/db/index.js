import mongoose from 'mongoose'
import { DB_NAME } from '../constants.js'


export const DB_Connect = async ()=>{
    try {
        const connectingInstance = await mongoose.connect(`${process.env.DB_URI}/${DB_NAME}`)
        console.log("database cnnected succesfully \n")
        console.log(`${connectingInstance.Connection.host}`)
    } catch (error) {
        console.log("error in connectiing the db : ", error)
        process.exit(1)
    }
}





































// import mongoose from 'mongoose';
// import { DB_NAME } from '../constants.js';

// const DBConnect = async ()=>{
//     try {
//         const connectionInstance = await mongoose.connect(`${process.env.DB_URI}/${DB_NAME}`)
//         console.log(`Mongoose connection succesful DS:HOST : ${connectionInstance.connection.host}`)
//     } catch (error) {
//         console.log("error ", error)
//         process.exit(1);
//     }
// }
// export default DBConnect