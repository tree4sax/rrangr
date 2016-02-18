var express = require('express');
var router = express.Router();
var ctrlArrangers = require('../controllers/arrangers');
var ctrlOthers = require('../controllers/others');


/* arrangers pages */
router.get('/', ctrlArrangers.homelist);
router.get('/arranger/:arrangerid', ctrlArrangers.arrangerInfo);
router.get('/arranger/:arrangerid/review/new', ctrlArrangers.addReview);
router.post('/arranger/:arrangerid/review/new', ctrlArrangers.doAddReview);

// Other pages
router.get('/about', ctrlOthers.about);

module.exports = router;
