const express = require("express");
const dotenv = require("dotenv");
const main = require("./config/database");

const app = express();
dotenv.config();
const PORT = process.env.PORT;





async function InitializeServer() {
  try {
    await main();
    console.log("Database connection succssful");

    app.listen(PORT, () => {
      console.log("Server listening on PORT:" + PORT);
    });
  } catch (err) {
    console.error("Error initializing the server: ", err);
  }
}



InitializeServer();

