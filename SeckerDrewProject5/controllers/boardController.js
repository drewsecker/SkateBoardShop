const model = require('../models/board.js');
//Board controller
exports.index = (req, res, next) => {
    let query = {};
    let sortedBy = {};
    
    if (req.query.query) { //Search functionality
        const search = req.query.query.toLowerCase();
        query = {
            $or: [
                {title: {$regex: search, $options: 'i'}},
                {details: {$regex: search, $options: 'i'}}
            ]
        };
        sortedBy = {title: 1};
    } else {
        sortedBy = {price: 1};
    }

    model.find(query).sort(sortedBy)
    .then(boards => res.render('./board/items', {boards}))
    .catch(err => next(err));
};

exports.new = (req, res) => {
    res.render('./board/new');
};

exports.create = (req, res, next) => {
    let board = new model(req.body);
    board.seller = req.session.user;
    if (req.file) {
        board.image = '/images/' + req.file.filename;
    } else {
        board.image = null;
    }

    board.save()
    .then(board =>{
        req.flash('success', 'Board created successfully.');
        res.redirect('/boards/items')
    })
    .catch(err => { //Error handling
        if (err.name === 'ValidationError') {
            err.status = 400;
            req.flash('error', 'Validation failed: ' + err.message);
            return res.redirect('back');
        }
        next(err);
    });
};

exports.show = (req, res, next) => {
    let id = req.params.id;

    model.findById(id).populate('seller', 'firstName lastName') //Data from the users collection
    .then(board => {
        if (board) {
            res.render('./board/item', {board});
        } else { //Error handling
            let err = new Error('Cannot find a board with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
};

exports.edit = (req, res, next) => {
    let id = req.params.id;

    model.findById(id)
    .then(board => {
        if (board) {
            res.render('./board/edit', {board});
        } else { //Error handling
            let err = new Error('Cannot find a board with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
};

exports.update = (req, res, next) => {
    let id = req.params.id;

    let newBoard = {
        title: req.body.title,
        condition: req.body.condition,
        price: parseFloat(req.body.price),
        details: req.body.details,
    };

    if (req.file) {
        newBoard.image = '/images/' + req.file.filename;
    }

    model.findByIdAndUpdate(id, newBoard, {useFindAndModify: false, runValidators: true})
    .then(board => {
        if (board) {
            req.flash('success', 'Board edited successfully.');
            res.redirect('/boards/' + id);
        } else { //Error handling
            let err = new Error('Cannot find a board with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => { //Error handling
        if (err.name === 'ValidationError') {
            err.status = 400;
            req.flash('error', 'Validation failed: ' + err.message);
            return res.redirect('back');
        }
        next(err);
    });
};

exports.delete = (req, res, next) => {
    let id = req.params.id;

    model.findByIdAndDelete(id, {useFindAndModify: false})
    .then(board => {
        if (board) {
            req.flash('success', 'Board deleted successfully.');
            res.redirect('/boards/items');
        } else { //Error handling
            let err = new Error('Cannot find a board with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
};