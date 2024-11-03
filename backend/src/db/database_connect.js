import mongoose from "mongoose"


const db_connect = async () => {
  try {
      const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}`)
      console.log(`\n DataBase Connection is Successful Congrates  \n Info about host : ${connectionInstance.connection.host}`)
  } catch (error) {
    console.log('Mongodb connection error',error)
  }
}

export default db_connect