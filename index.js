const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

const app = express();
const portNumber = 4001;

/* importing user model */
const User = require("./model/Users.js");

app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "templates"));

require("dotenv").config();

app.get("/", (req,res) => {
    res.render("login");
});

app.get("/signup", (req,res) => {
    res.render("signup");
});

app.post("/signup", async (req, res) => {

    let {username, pw} = req.body;
    /* check to see if username already exists */
    const name  = await User.find({name:username})
    console.log(name);

    if (name.length > 0) {
        return res.send("Username already exists");
    } else {
        const saltRounds = 10;
        const hashedPass = await bcrypt.hash(pw,saltRounds);

        /* create and add user to db */
        await User.create({
            name: username,
            passwordHash: hashedPass
        });
    }
});

app.post("/login", async (req,res) => {
    
    try {
    let {username, pw} = req.body;

    let user = await User.findOne({name:username});

    if(!user) {
        res.send("No Username found");
    } else {

        /* since passwordHash has select:false, we have to tell mongo to include
           it when returning user */
        let userPW = await User.findOne({name:username}).select("+passwordHash");

        let passwordMatch = bcrypt.compareSync(pw, userPW.passwordHash);

        if (!passwordMatch) {
            return res.send("Incorrect password")
        } else {
            res.render("home");
        }
    }
    } catch (err) {
        res.send("Something went wrong");
    }
});


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

