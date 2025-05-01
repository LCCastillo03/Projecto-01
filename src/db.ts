import mongoose from 'mongoose';

export default function handleMongoConnetion() {
    mongoose.connect(process.env.MONGO_CONN_STRING as string).then(() => {
        console.log("Connected to mongo server.");
    });
}