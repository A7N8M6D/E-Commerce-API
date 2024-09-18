import mongoose from "mongoose";
import { DB_Name } from "../constant.js";

const conectDb= async()=>{
try{
const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`)
console.log(`MongooseDb Connected !! ${connectionInstance.connection.host}`)
}
catch(error)
{
     console.log("DataBase Conection Error 0",error)
}
}
export default conectDb