const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: String,
    price: {
        type: Number,
        required: true,
    },
    image: {
        filename: String,
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1511300636408-a63a89df3482?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
    },
    location: {
        type: String,
        required: true,
    },
    country: String
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;