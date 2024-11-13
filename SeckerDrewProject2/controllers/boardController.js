const model = require('../models/board.js');

exports.index = (req, res) => {
    let boards = model.find();

    if(req.query.query) {
        const query = req.query.query.toLowerCase();
        boards = boards.filter(board => {
            return (
                board.title.toLowerCase().includes(query) || 
                board.details.toLowerCase().includes(query)
            );
        });
    } else {
        query = null;
    }

    res.render('./board/items', { boards });
};

exports.new = (req, res) => {
    res.render('./board/new');
};

exports.create = (req, res) => {
    let board = req.body;
    if (req.file) {
        board.image = '/images/' + req.file.filename;
    } else {
        board.image = null;
    }
    model.save(board);
    res.redirect('./boards/items');
};

exports.show = (req, res, next) => {
    let id = req.params.id;
    let board = model.findById(id);
    if (board) {
        res.render('./board/item', { board });
    } else {
        let err = new Error('Cannot find a board with id ' + id);
        err.status = 404;
        next(err);
    }
};

exports.edit = (req, res, next) => {
    let id = req.params.id;
    let board = model.findById(id);
    if (board) {
        res.render('./board/edit', { board });
    } else {
        let err = new Error('Cannot find a board with id ' + id);
        err.status = 404;
        next(err);
    }
};

exports.update = (req, res, next) => {
    const id = req.params.id;
    const newBoard = {
        title: req.body.title,
        condition: req.body.condition,
        price: parseFloat(req.body.price),
        details: req.body.details,
    };

    if (req.file) {
        newBoard.image = '/images/' + req.file.filename;
    }

    if (model.updateById(id, newBoard)) {
        res.redirect('./' + id);
    } else {
        let err = new Error('Cannot find a board with id ' + id);
        err.status = 404;
        next(err);
    }
};

exports.delete = (req, res, next) => {
    let id = req.params.id;

    if (model.deleteById(id)) {
        res.redirect('/boards/items');
    } else {
        let err = new Error('Cannot find a board with id ' + id);
        err.status = 404;
        next(err);
    }
};