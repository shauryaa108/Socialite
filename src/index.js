// import mongoose from 'mongoose';
import dotenv from 'dotenv'
// import { DB_NAME } from './constants';
import DBConnect from './db/index.js';

// another method to setup the database connection
DBConnect()










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