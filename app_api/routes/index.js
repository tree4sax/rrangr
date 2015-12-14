var express = require('express');
var router = express.Router();
var ctrlArrangers = require('../controllers/arrangers');
var ctrlReviews = require('../controllers/reviews');

// arrangers
router.get('/arrangers', ctrlArrangers.arrangersList);
router.post('/arrangers', ctrlArrangers.arrangersCreate);
router.get('/arrangers/:arrangerid', ctrlArrangers.arrangersReadOne);
router.put('/arrangers/:arrangerid', ctrlArrangers.arrangersUpdateOne);
router.delete('/arrangers/:arrangerid', ctrlArrangers.arrangersDeleteOne);

// reviews - no GET for /reviews because reviews are handled as a list in /arrangers
router.post('/arrangers/:arrangerid/reviews', ctrlReviews.reviewsCreate);
router.get('/arrangers/:arrangerid/reviews/:reviewid', ctrlReviews.reviewsReadOne);
router.put('/arrangers/:arrangerid/reviews/:reviewid', ctrlReviews.reviewsUpdateOne);
router.delete('/arrangers/:arrangerid/reviews/:reviewid', ctrlReviews.reviewsDeleteOne);

module.exports = router;
