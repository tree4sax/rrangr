//controllers/arrangers/js
// GET 'home' page
var request = require('request');
var apiOptions = {
  server: "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production') {
  apiOptions.server = "https://rrangr.herokuapp.com";
}

var renderHomepage = function(req, res, responseBody) {
  var message;
  if (!(responseBody instanceof Array)) {
    message = "API lookup error";
    responseBody = []; //to prevent error being thrown in view, which expects an array
  } else {
    if (!responseBody.length) {
      message = "No arrangers found";
    }
  }
  res.render('arrangers-list', {
    title: 'RrangR - find YOUR arranger',
    pageHeader: {
      title: 'RrangR',
      strapline: 'Find the perfect arranger for your needs'
    },
    sidebar: "Looking for a music arranger for your band? Need someone to arrange material for the studio? rrangr is the place for you!",
    arrangers: responseBody,
    message: message
  });

};

var renderDetailPage = function(req, res, arrDetail) {
  res.render('arranger-info', {
    title: arrDetail.name,
    pageHeader: {title: arrDetail.name},
    sidebar: 'Please leave a review',
    arranger: arrDetail
  });
};

var _showError = function(req, res, status) {
  var title, content;
  if (status === 404) {
    title = "404, page not found";
    content = "Cannot find this page";
  } else {
    title = status + ", something has gone wrong";
    content = "Oops";
  }
  res.status(status);
  res.render('generic-text', {
    title : title,
    content : content
  });
};

module.exports.homelist = function(req, res) {
  var requestOptions, path;
  path = '/api/arrangers';
  requestOptions = {
    url: apiOptions.server + path,
    method: "GET",
    json: {}
  };
  request(
    requestOptions,
    function(err, response, body) {
      renderHomepage(req, res, body);
    }
  );
};


// GET 'arranger info' page
module.exports.arrangerInfo = function(req, res) {
  var requestOptions, path;
  path = "/api/arrangers" + req.params.arrangerid;
  requestOptions = {
    url: apiOptions.server + path,
    method: "GET",
    json: {}
  };
  request(
    requestOptions,
    function(err, response, body) {
      var data = body;
      if(response.statusCode === 200) {
        renderDetailPage(req, res, data);
      } else {
        _showError(req, res, response.statusCode);
      }
    }
  )
};

// GET 'Add review' page
module.exports.addreview = function(req, res) {
  res.render('arranger-review-form', {
    title: 'Review Billy Strayhorn on RrangR',
    pageHeader: {
      title: 'Review Billy Strayhorn',
      strapline: 'Let us know what you think of your experience'
    }});
};
