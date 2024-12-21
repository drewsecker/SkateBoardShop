const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const offerSchema = new Schema({
    amount: {type: Number, required: [true, 'amount is required'], min: [0.01, 'amount must be a positive number']},
    status: {type: String, enum: ['pending', 'rejected', 'accepted'], default: 'pending'},
    user: {type: Schema.Types.ObjectId, ref: 'User', required: [true, 'user is required']},
    board: {type: Schema.Types.ObjectId, ref: 'Board', required: [true, 'board is required']}
}
);
module.exports = mongoose.model('Offer', offerSchema);