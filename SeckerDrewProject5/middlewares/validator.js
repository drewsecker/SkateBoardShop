const {body} = require('express-validator');
const {validationResult} = require('express-validator');
const validator = require('validator');

exports.validId = (req, res, next) => {
    let id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid ID');
        err.status = 400;
        return next(err);
    } else {
        return next();
    }
};

exports.validateSignUp = [
    body('firstName', 'First name cannot be empty').notEmpty().trim().escape(),
    body('lastName', 'Last name cannot be empty').notEmpty().trim().escape(),
    body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
    body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({ min: 8, max: 64 }),
];

exports.validateLogIn = [
    body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
    body('password', 'Password must be at least 8 characters and at most 64 characters')
        .isLength({ min: 8, max: 64 }),
];

exports.validateBoard = [
    body('title', 'Title cannot be empty').notEmpty().trim().escape(),
    body('condition', 'Condition must be one of the allowed values').isIn(['Wear', 'Good', 'Like New', 'New', 'Mint']).trim().escape(),
    body('price', 'Price must be a valid currency amount').custom(value => validator.isCurrency(value.toString())).trim().escape(),
    body('details', 'Details cannot be empty').notEmpty().trim().escape(),
];

exports.validateOffer = [
    body('amount', 'Offer amount must be a valid currency value').custom(value => validator.isCurrency(value.toString())).trim().escape(),
];

exports.validateResult = (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
        res.redirect('back');
    } else {
        return next();
    }
};