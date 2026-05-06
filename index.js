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
    res.render("login", { error: null, 
                          username: "" });
});

app.get("/signup", (req,res) => {
    res.render("signup", { error: null, 
                           username: "" });
});

app.post("/signup", async (req, res) => {
    let {username, pw} = req.body;

    /* check to see if username already exists */
    const existing = await User.find({name: username});

    if (existing.length > 0) {
        return res.render("signup", { error: "Username already taken. Please choose another.", 
                                      username });
    }

    const hashedPass = await bcrypt.hash(pw, 10);
    await User.create({ name: username, passwordHash: hashedPass });
    res.redirect("/");
});

app.post("/login", async (req,res) => {
    try {
        let {username, pw} = req.body;

        /* since passwordHash has select:false, we have to tell mongo to include
           it when returning user */
        let user = await User.findOne({name: username}).select("+passwordHash");

        if (!user) {
            return res.render("login", { error: "No account found with that username.", username });
        }

        let passwordMatch = bcrypt.compareSync(pw, user.passwordHash);

        if (!passwordMatch) {
            return res.render("login", { error: "Incorrect password. Please try again.", 
                                         username });
        }

        res.render("home");
    } catch (err) {
        res.render("login", { error: "Something went wrong. Please try again.", 
                              username: "" });
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


