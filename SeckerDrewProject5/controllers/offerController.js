const model = require('../models/offer.js');
const Board = require('../models/board.js');
const User = require('../models/user.js');
//Offer controller
exports.makeOffer = (req, res, next) =>{
    const id = req.params.id;
    const {amount} = req.body;

    Board.findById(id)
        .then(board => {
            if (!board) {
                let err = new Error('Cannot find a board with id ' + id);
                err.status = 404;
                throw err;
            }

            if (!board.active) {
                let err = new Error('Cannot make offers on inactive boards.');
                err.status = 400;
                throw err;
            }

            if (board.seller.toString() === req.session.user) { //Verifying the user is not the seller
                let err = new Error('You cannot make an offer on your own board.');
                err.status = 401;
                throw err;
            }

            const offer = new model({amount, user: req.session.user, board: id});
            return offer.save()
            .then(() => {
                return Board.findByIdAndUpdate(id, {
                    $inc: {totalOffers: 1},
                    $max: {highestOffer: amount}
                });
            });
        })
        .then(() => {
            req.flash('success', 'Offer made successfully.');
            res.redirect('/boards/' + id);
        })
        .catch(err => {
            if (err.name === 'ValidationError') {
                err.status = 400;
                req.flash('error', 'Validation failed: ' + err.message);
                return res.redirect('back');
            }
            next(err);
        });
};

exports.viewOffers = (req, res, next) =>{
    const id = req.params.id;

    Board.findById(id)
        .then(board => {
            if (!board) {
                const err = new Error('Cannot find a board with id ' + id);
                err.status = 404;
                throw err;
            }

            if (board.seller.toString() !== req.session.user) { //Validate the user is the seller
                const err = new Error('Unauthorized to view offers for this board.');
                err.status = 401;
                throw err;
            }

            return model.find({board: id}).populate('board', 'title active').populate('user', 'firstName lastName');
        })
        .then(offers => {
            res.render('./offers/offers', {offers});
        })
        .catch(err => next(err));
};

exports.acceptOffer = (req, res, next) =>{
    const {id, offerId} = req.params;

    Board.findById(id)
    .then(board => {
        if (!board) {
            const err = new Error('Cannot find a board with id ' + id);
            err.status = 404;
            throw err;
        }

        if (board.seller.toString() !== req.session.user) { //Validate the user is the seller
            const err = new Error('Unauthorized to view offers for this board.');
            err.status = 401;
            throw err;
        }

        return Board.findByIdAndUpdate(id, {active: false})
    .then(() => {
        return model.findByIdAndUpdate(offerId, {status: 'accepted'});
    })
    .then(() => {
        return model.updateMany(
            {board: id, _id: {$ne: offerId}},
            {status: 'rejected'}
        );
    });
    })
    .then(() => {
        req.flash('success', 'Offer accepted successfully.');
        res.redirect(`/boards/${id}/offers`);
    })
    .catch(err => next(err));
};