import {connect} from "mongoose"
import { config } from "dotenv"

config() //process.env

export const connectToDB=async()=>{
    try{
    await connect(process.env.DB_URL)
    console.log("DB connection successful")
    }
    catch(err){
        console.log("Err in DB connection",err)
    }
}
