const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please provide a valid Email"],
        unique: [true, "Email Exists!"],
    },
    password: {
        type: String,
        required: [true, "Please provide a valid Password"],
        unique: false,
    }
})

module.exports = mongoose.model.Users || mongoose.model("Users", userSchema);