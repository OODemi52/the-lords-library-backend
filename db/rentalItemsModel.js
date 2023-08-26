const mongoose = require("mongoose");

const rentalItemsSchema = new mongoose.Schema({
    itemImage: String,
    itemName: String,
    itemCategory: String,
    itemQuantity: Number,
    itemDescription: String,
})

module.exports = mongoose.model("RentalItems", rentalItemsSchema);