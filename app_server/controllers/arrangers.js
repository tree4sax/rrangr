//controllers/arrangers/js
// GET 'home' page
module.exports.homelist = function(req, res) {
  res.render('arrangers-list', { title: 'Home' });
};

// GET 'arranger info' page
module.exports.arrangerInfo = function(req, res) {
  res.render('arranger-info', { title: 'Arranger Info' });
};

// GET 'Add review' page
module.exports.addreview = function(req, res) {
  res.render('arranger-review-form', { title: 'Add Review' });
};
