const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
    crypto: {
        type: String,
        required: true
    },
    cryptoSymbol: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    currencySymbol: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    dateTime: String,
    price: String
}, { timestamps: true });

module.exports = mongoose.model('data', dataSchema);