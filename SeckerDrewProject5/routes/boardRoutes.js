const express = require('express');
const controller = require('../controllers/boardController');
const offerRoutes = require('./offerRoutes');
const {isLoggedIn, isSeller} = require('../middlewares/auth');
const {validId, validateBoard, validateResult} = require('../middlewares/validator');

const router = express.Router();
//Board router
module.exports = (upload) => {
    router.get('/', controller.index);

    router.get('/items', controller.index);

    router.get('/new', isLoggedIn, controller.new);

    router.post('/', isLoggedIn, upload.single('image'), validateBoard, validateResult, controller.create);

    router.get('/:id', validId, controller.show);

    router.get('/:id/edit', validId, isLoggedIn, isSeller, controller.edit);

    router.put('/:id', validId, isLoggedIn, isSeller, upload.single('image'), validateBoard, validateResult, controller.update);

    router.delete('/:id', validId, isLoggedIn, isSeller, controller.delete);

    router.use('/:id/offers', offerRoutes);

    return router;
}
