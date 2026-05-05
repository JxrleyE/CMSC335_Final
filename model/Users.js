const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
   },
   passwordHash: {
      type: String,
      select: false,
      required: true,
   }
});

const User = mongoose.model("Users", userSchema);
module.exports = User;