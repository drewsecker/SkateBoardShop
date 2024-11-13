const express = require('express');
const controller = require('../controllers/boardController');
const {isLoggedIn, isSeller} = require('../middlewares/auth');
const {validId} = require('../middlewares/validator.js');

const router = express.Router();
//Board router
module.exports = (upload) => {
    router.get('/', controller.index);

    router.get('/items', controller.index);

    router.get('/new', isLoggedIn, controller.new);

    router.post('/', isLoggedIn, upload.single('image'), controller.create);

    router.get('/:id', validId, controller.show);

    router.get('/:id/edit', validId, isLoggedIn, isSeller, controller.edit);

    router.put('/:id', validId, isLoggedIn, isSeller, upload.single('image'), controller.update);

    router.delete('/:id', validId, isLoggedIn, isSeller, controller.delete);

    return router;
}
