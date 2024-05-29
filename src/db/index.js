import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async ()=>{  // async function named connectDB
    try {

        // this line uses Mongoose's "connect" method to establish a connection to the MongoDB database.
       const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

        console.log(`MONGODB Connected !!!  DB_HOST =${connectionInstance } `);
        
    } catch (error) {
        console.log("MongoDb connection error : ", error)
        process.exit(1)
    }
}

export default connectDB