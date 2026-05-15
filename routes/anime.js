const express = require("express");
const Anime = require("../model/Anime.js");

const router = express.Router();

function requireAuth(req, res, next) {
    if (!req.session.user) return res.redirect("/login");
    next();
}

router.post("/anime/add", requireAuth, async (req, res) => {
    const { malId, title, imageUrl } = req.body;
    const username = req.session.user;

    try {
        await Anime.create({ username, malId: Number(malId), title, imageUrl });
    } catch (err) {
    }
    res.redirect("/home");
});

router.post("/anime/remove", requireAuth, async (req, res) => {
    const username = req.session.user;
    await Anime.deleteOne({ username, malId: Number(req.body.malId) });
    res.redirect("/home");
});

module.exports = router;
