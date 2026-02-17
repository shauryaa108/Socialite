// import mongoose from 'mongoose';
import dotenv from 'dotenv'
// import { DB_NAME } from './constants';
import DB_Connect from './db/index.js';
import { app } from './app.js';
dotenv.config({
    path : '../env'
})



// another method to check the database connection, we connected the db already in a seperate index file in db folder
DB_Connect()
.then(()=>{
    app.on("error", (error)=>{
        console.log("error occured : ", error);
        
    })
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`app is listening on port ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("Connection error : ", err)
}

)









/* outdated method
import express from 'express'

const app = express()


(async ()=>{
    try {
        await mongoose.connect(`${process.env.DB_URI}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.log("ERROR: ", error)
            throw error
        })
        app.listen(process.env.PORT, ()=>{
            console.log(`app is listening on port ${PORT}`)
        })
    } catch (error) {
        console.error("ERROR!!!!, ", error);
        throw error
    }
})()

*/