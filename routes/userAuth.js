const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../model/Users.js");

const router = express.Router();

router.get("/", (req, res) => {
    res.render("login", { error: null, username: "" });
});

router.get("/login", (req, res) => {
    res.render("login", { error: null, username: "" });
});

router.get("/signup", (req, res) => {
    res.render("signup", { error: null, username: "" });
});

router.post("/signup", async (req, res) => {
    let { username, pw } = req.body;

    const existing = await User.find({ name: username });
    if (existing.length > 0) {
        return res.render("signup", { error: "Username already taken. Please choose another.", username });
    }

    const hashedPass = await bcrypt.hash(pw, 10);
    await User.create({ name: username, passwordHash: hashedPass });
    res.redirect("/");
});

router.post("/login", async (req, res) => {
    try {
        let { username, pw } = req.body;

        /* passwordHash has select:false, so we must explicitly include it */
        let user = await User.findOne({ name: username }).select("+passwordHash");

        if (!user) {
            return res.render("login", { error: "No account found with that username.", username });
        }

        let passwordMatch = bcrypt.compareSync(pw, user.passwordHash);
        if (!passwordMatch) {
            return res.render("login", { error: "Incorrect password. Please try again.", username });
        }

        res.render("home", { username });
    } catch (err) {
        res.render("login", { error: "Something went wrong. Please try again.", username: "" });
    }
});

module.exports = router;
