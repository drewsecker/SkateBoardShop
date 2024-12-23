const Board = require('../models/board');
//Middlewares to authenticate requests and avoid code duplication
exports.isGuest = (req, res, next)=>{
    if(!req.session.user) {
        return next();
    } else {
        req.flash('error', 'You are logged in already');
        return res.redirect('/users/profile');
    }
};

exports.isLoggedIn = (req, res, next)=>{
    if(req.session.user) {
        return next();
    } else {
        req.flash('error', 'You need to log in first');
        return res.redirect('/users/login');
    }
};

exports.isSeller = (req, res, next)=>{
    let id = req.params.id;

    Board.findById(id)
    .then(board=>{
        if(board) {
            if(board.seller.equals(req.session.user)) {
                return next();
            } else {
                let err = new Error('Unauthorized to access the resource');
                err.status = 401;
                return next(err);
            }
        } else {
            let err = new Error('Cannot find board with id ' + id);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err=>next(err));
}