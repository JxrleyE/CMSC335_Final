const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

require("dotenv").config();

const authRouter = require("./routes/userAuth.js");

const app = express();
const portNumber = 4001;

app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "templates"));

app.use("/", authRouter);


/* connecting to mongoose and running server */
(async () => {
   try {
      await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
      console.log("Connected to mongoose");

      app.listen(portNumber, () => {
        console.log(`Server started at: http://localhost:${portNumber}`)
      });
   } catch (err) {
    console.error(err);
    process.exit(1);
   }
})();


