const model = require('../models/board.js');

exports.index = (req, res, next) => {
    let query = {};
    let sortedBy = {};
    
    if (req.query.query) {
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
    
    if (req.file) {
        board.image = '/images/' + req.file.filename;
    } else {
        board.image = null;
    }

    board.save()
    .then(board => res.redirect('/boards/items'))
    .catch(err => {
        if (err.name === 'ValidationError') {
            err.status = 400;
        }
        next(err);
    });
};

exports.show = (req, res, next) => {
    let id = req.params.id;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid board ID');
        err.status = 400;
        return next(err);
    }

    model.findById(id)
    .then(board => {
        if (board) {
            res.render('./board/item', {board});
        } else {
            let err = new Error('Cannot find a board with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
};

exports.edit = (req, res, next) => {
    let id = req.params.id;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid board ID');
        err.status = 400;
        return next(err);
    }

    model.findById(id)
    .then(board => {
        if (board) {
            res.render('./board/edit', {board});
        } else {
            let err = new Error('Cannot find a board with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
};

exports.update = (req, res, next) => {
    let id = req.params.id;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid board ID');
        err.status = 400;
        return next(err);
    }

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
            res.redirect('/boards/' + id);
        } else {
            let err = new Error('Cannot find a board with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => {
        if (err.name === 'ValidationError') {
            err.status = 400;
        }
        next(err);
    });
};

exports.delete = (req, res, next) => {
    let id = req.params.id;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid board ID');
        err.status = 400;
        return next(err);
    }

    model.findByIdAndDelete(id, {useFindAndModify: false})
    .then(board => {
        if (board) {
            res.redirect('/boards/items');
        } else {
            let err = new Error('Cannot find a board with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
};