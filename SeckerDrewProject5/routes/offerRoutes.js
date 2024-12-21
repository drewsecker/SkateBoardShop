const express = require('express');
const router = express.Router({mergeParams: true});
const controller = require('../controllers/offerController');
const {isLoggedIn, isSeller} = require('../middlewares/auth');
const {validateOffer, validateResult} = require('../middlewares/validator');

router.post('/', isLoggedIn, validateOffer, validateResult, controller.makeOffer);
router.get('/', isLoggedIn, isSeller, controller.viewOffers);
router.post('/:offerId/accept', isLoggedIn, isSeller, controller.acceptOffer);

module.exports = router;