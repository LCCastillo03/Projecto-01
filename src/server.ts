import dotenv from 'dotenv';
dotenv.config();

import createApp from "./app";
import handleMongoConnection from "./db";

const app = createApp();

handleMongoConnection();

app.listen(8080, () => {
  console.log("Server listening to port 8080.");
});