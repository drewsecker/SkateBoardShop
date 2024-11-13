const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const boardSchema = new Schema({
    title: {type: String, required: [true, 'title is required']},
    seller: {type: String, required: [true, 'seller is required']},
    condition: {type: String, required: [true, 'condition is required'], enum: ['Wear', 'Good', 'Like New', 'New', 'Mint']},
    price: {type: Number, required: [true, 'price is required'], min: [0.1, 'price must be a positive number']},
    details: {type: String, required: [true, 'details is required']},
    image: {type: String, required: [true, 'Image URL is required']},
    active: {type: Boolean, default: true},
    offers: {type: Number, default: 0}
}
);
module.exports = mongoose.model('Board', boardSchema);