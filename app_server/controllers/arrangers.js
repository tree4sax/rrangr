var request = require('request');
var apiOptions = {
  server : "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production') {
  apiOptions.server = "https://Rrangr.herokuapp.com";
}

var _isNumeric = function (n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

var _formatDistance = function (distance) {
  var numDistance, unit;
  if (distance && _isNumeric(distance)) {
    if (distance > 1) {
      numDistance = parseFloat(distance).toFixed(1);
      unit = 'km';
    } else {
      numDistance = parseInt(distance * 1000,10);
      unit = 'm';
    }
    return numDistance + unit;
  } else {
    return "?";
  }
};

var _showError = function (req, res, status) {
  var title, content;
  if (status === 404) {
    title = "404, page not found";
    content = "Oh dear. Looks like we can't find this page. Sorry.";
  } else if (status === 500) {
    title = "500, internal server error";
    content = "How embarrassing. There's a problem with our server.";
  } else {
    title = status + ", something's gone wrong";
    content = "Something, somewhere, has gone just a little bit wrong.";
  }
  res.status(status);
  res.render('generic-text', {
    title : title,
    content : content
  });
};

var renderHomepage = function(req, res, responseBody){
  var message;
  if (!(responseBody instanceof Array)) {
    message = "API lookup error";
    responseBody = [];
  } else {
    if (!responseBody.length) {
      message = "No arrangers found";
    }
  }
  res.render('arrangers-list', {
    title: 'Rrangr - find an arranger',
    pageHeader: {
      title: 'Rrangr',
      strapline: 'Find the perfect arranger for your needs'
    },
    sidebar: 'Looking for a music arranger for your band? Need someone to arrange material for the studio? RrangR is the place for you!',
    arrangers: responseBody,
    message: message
  });
};

/* GET 'home' page */
module.exports.homelist = function(req, res){
  var requestOptions, path;
  path = '/api/arrangers';
  requestOptions = {
    url : apiOptions.server + path,
    method : "GET",
    json : {},
    qs : {
      lng : -0.7992599,
      lat : 51.378091,
      maxDistance : 20
    }
  };
  request(
    requestOptions,
    function(err, response, body) {
      var i, data;
      data = body;
      if (response.statusCode === 200 && data.length) {
        for (i=0; i<data.length; i++) {
          data[i].distance = _formatDistance(data[i].distance);
        }
      }
      renderHomepage(req, res, data);
    }
  );
};

var getArrangerInfo = function (req, res, callback) {
  var requestOptions, path;
  path = "/api/arrangers/" + req.params.arrangerid;
  requestOptions = {
    url : apiOptions.server + path,
    method : "GET",
    json : {}
  };
  request(
    requestOptions,
    function(err, response, body) {
      var data = body;
      if (response.statusCode === 200) {
        // data.coords = {
        //   lng : body.coords[0],
        //   lat : body.coords[1]
        // };
        callback(req, res, data);
      } else {
        _showError(req, res, response.statusCode);
      }
    }
  );
};

var renderDetailPage = function (req, res, arrDetail) {
  res.render('arranger-info', {
    title: arrDetail.name,
    pageHeader: {title: arrDetail.name},
    sidebar: {
      context: 'is an arranger on Rrangr',
      callToAction: 'please leave a review to help other people just like you.'
    },
    arranger: arrDetail
  });
};

/* GET 'Arranger info' page */
module.exports.arrangerInfo = function(req, res){
  getArrangerInfo(req, res, function(req, res, responseData) {
    renderDetailPage(req, res, responseData);
  });
};

var renderReviewForm = function (req, res, arrDetail) {
  res.render('arranger-review-form', {
    title: 'Review ' + arrDetail.name + ' on Rrangr',
    pageHeader: { title: 'Review ' + arrDetail.name },
    error: req.query.err
  });
};

/* GET 'Add review' page */
module.exports.addReview = function(req, res){
  getArrangerInfo(req, res, function(req, res, responseData) {
    renderReviewForm(req, res, responseData);
  });
};

/* POST 'Add review' page */
module.exports.doAddReview = function(req, res){
  var requestOptions, path, arrangerid, postdata;
  arrangerid = req.params.arrangerid;
  path = "/api/arrangers/" + arrangerid + '/reviews';
  postdata = {
    author: req.body.name,
    rating: parseInt(req.body.rating, 10),
    reviewText: req.body.review
  };
  requestOptions = {
    url : apiOptions.server + path,
    method : "POST",
    json : postdata
  };
  if (!postdata.author || !postdata.rating || !postdata.reviewText) {
    res.redirect('/arranger/' + arrangerid + '/reviews/new?err=val');
  } else {
    request(
      requestOptions,
      function(err, response, body) {
        if (response.statusCode === 201) {
          res.redirect('/arranger/' + arrangerid);
        } else if (response.statusCode === 400 && body.name && body.name === "ValidationError" ) {
          res.redirect('/arranger/' + arrangerid + '/reviews/new?err=val');
        } else {
          console.log(body);
          _showError(req, res, response.statusCode);
        }
      }
    );
  }
};
