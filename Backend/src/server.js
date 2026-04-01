const express = require("express");
const dotenv = require("dotenv");
const main = require("./config/database");
const cookieParser = require('cookie-parser')
const authRouter = require('./routes/userAuth')
const redisClient = require("./config/redis")
const problemRouter = require("./routes/problemRoute")
const submissionRouter = require("./routes/submissionRouter")
const cors = require("cors")

const app = express();
dotenv.config();
const PORT = process.env.PORT;

const corsOptions = {
  origin: 'http://localhost:5173', 
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'] 
};



app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions))

app.use("/auth", authRouter)
app.use("/problem", problemRouter)
app.use("/submission", submissionRouter);






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

