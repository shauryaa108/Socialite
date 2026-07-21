import mongoose from 'mongoose'
import { DB_NAME } from '../constants.js'


const DB_Connect = async ()=>{
    try {
        const connectingInstance = await mongoose.connect(`${process.env.DB_URI}/${DB_NAME}`)
        console.log("database connected succesfully")
        console.log(`${connectingInstance.connection.host}`)
        console.log("DB_URI:", process.env.MONGODB_URI)
    } catch (error) {
        console.log("error in connecting the db : ", error)
        process.exit(1)
    }
}

export default DB_Connect



































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