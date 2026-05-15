const mongoose = require("mongoose");

const animeSchema = new mongoose.Schema({
    username: { type: String, required: true },
    malId:    { type: Number, required: true },
    title:    { type: String, required: true },
    imageUrl: { type: String, default: "" }
});

animeSchema.index({ username: 1, malId: 1 }, { unique: true });

const Anime = mongoose.model("Anime", animeSchema);
module.exports = Anime;
