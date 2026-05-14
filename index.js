const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");

require("dotenv").config();

const authRouter = require("./routes/userAuth.js");

const app = express();
const portNumber = 4001;

app.use(bodyParser.urlencoded({ extended: false }));

/* to start saving users sessions */
app.use(session({
    secret: "dev-secret",
    resave: false,
    saveUninitialized: false
}));

/* connect to templates so that it refrences the files in there */
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


