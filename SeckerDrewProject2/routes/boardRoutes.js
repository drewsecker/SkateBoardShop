const express = require('express');
const controller = require('../controllers/boardController');

const router = express.Router();

module.exports = (upload) => {
    router.get('/', controller.index);

    router.get('/items', controller.index);

    router.get('/new', controller.new);

    router.post('/', upload.single('image'), controller.create);

    router.get('/:id', controller.show);

    router.get('/:id/edit', controller.edit);

    router.put('/:id', upload.single('image'), controller.update);

    router.delete('/:id', controller.delete);

    return router;
}
