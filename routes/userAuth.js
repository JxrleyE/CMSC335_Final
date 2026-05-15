const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../model/Users.js");
const Anime = require("../model/Anime.js");

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

        req.session.user = username;
        res.redirect("/home");
    } catch (err) {
        res.render("login", { error: "Something went wrong. Please try again.", username: "" });
    }
});

router.get("/home", async (req, res) => {
    if (!req.session.user) return res.redirect("/login");

    const username = req.session.user;
    const q = req.query.q || "";
    let searchResults = [];

    if (q) {
        try {
            const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(q)}&limit=8&sfw=true`);
            const json = await response.json();
            searchResults = json.data || [];
        } catch (err) {
            searchResults = [];
        }
    }

    const animeList = await Anime.find({ username });
    res.render("home", { username, animeList, searchResults, query: q });
});

router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/login");
});

module.exports = router;
