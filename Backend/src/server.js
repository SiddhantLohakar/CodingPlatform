const express = require("express");
const dotenv = require("dotenv");
const main = require("./config/database");
const cookieParser = require('cookie-parser')
const authRouter = require('./routes/userAuth')
const redisClient = require("./config/redis")
const problemRouter = require("./routes/problemRoute")

const app = express();
dotenv.config();
const PORT = process.env.PORT;



app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRouter)
app.use("/problem", problemRouter)






async function InitializeServer() {
  
    try {
        await Promise.all([main(), redisClient.connect()]);
        console.log("Database connection succssful");

    
         app.listen(PORT, () => {
            console.log("Server listening on PORT:" + PORT);
        });


  } catch (err) {

        console.error("Error initializing the server: ", err);
  }
}



InitializeServer();

