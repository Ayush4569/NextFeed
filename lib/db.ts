import mongoose from "mongoose";

type connectionObject = {
    isConnected?:number
}

const connection:connectionObject = {};

export const connectToDB = async ():Promise<void> => {
    if(connection.isConnected){
        console.log('Database already connected');
        return 
    }
    try {
        const db = await mongoose.connect(process.env.MONGO_URL as string);
        connection.isConnected = db.connections[0].readyState
        console.log('DB connected !!');
    } catch (error) {
        console.log('DB connection failed :',error);
        process.exit(1)
    }
}