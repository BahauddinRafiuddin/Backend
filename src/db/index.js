import mongoose from "mongoose";
import  {DB_NAME}  from '../constants.js'

const connectDb = async () => {
    try {
        const connectionInsatance=await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log(`\n Mongo DB Connected Successfully - DB HOST: ${connectionInsatance.connection.host}`)
    } catch (error) {
        console.log("Mongo Db Connetion Failed!!!!",error)
        process.exit(1)
    }
}

export default connectDb;