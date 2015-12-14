var express = require('express');
var router = express.Router();
var ctrlArrangers = require('../controllers/arrangers');
var ctrlOthers = require('../controllers/others');


/* arrangers pages */
router.get('/', ctrlArrangers.homelist);
router.get('/arranger/:arrangerid', ctrlArrangers.arrangerInfo);
router.get('/arranger/review/new', ctrlArrangers.addreview);

// Other pages
router.get('/about', ctrlOthers.about);

module.exports = router;
