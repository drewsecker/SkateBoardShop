const Board = require('../models/board');
//Middlewares to validate Mongodb IDs
exports.validId = (req, res, next)=>{
    let id = req.params.id;

    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid board id');
        err.status = 400;
        return next(err);
    } else {
        return next();
    }
};