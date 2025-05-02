import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export default function handleMongoConnection() {
    console.log(process.env.MONGO_CONN_STRING);
    mongoose.connect(process.env.MONGO_CONN_STRING as string).then(() => {
        console.log("Connected to mongo server.");
    });
}