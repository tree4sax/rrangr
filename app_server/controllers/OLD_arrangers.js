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

var getArrangerInfo = function (req, res) {
  var requestOptions, path;
  path = "/api/arrangers/" + req.params.arrangerid;
  // requestOptions = {
  //   url : apiOptions.server + path,
  //   method : "GET",
  //   json : {}
  // };
  // request(
  //   requestOptions,
  //   function(err, response, body) {
  //     var data = body;
  //     // if (response.statusCode === 200) {
  //     //   data.coords = {
  //     //     lng : body.coords[0],
  //     //     lat : body.coords[1]
  //     //   };
  //       callback(req, res, data);
  //     } else {
  //       _showError(req, res, response.statusCode);
  //     }
  //   }
  // );
};

var renderDetailPage = function (req, res, arrDetail) {
  res.render('arranger-info', {
    title: arrDetail.name,
    pageHeader: {title: arrDetail.name},
    arranger: arrDetail
  });
};

/* GET 'Location info' page */
module.exports.arrangerInfo = function(req, res){
  // getArrangerInfo(req, res, function(req, res, responseData) {
    var responseData;
    renderDetailPage(req, res, responseData);
  // });
};

var renderReviewForm = function (req, res, arrDetail) {
  res.render('arranger-review-form', {
    title: 'Review ' + arrDetail.name + ' on RrangR',
    pageHeader: { title: 'Review ' + arrDetail.name },
    error: req.query.err
  });
};

// GET 'Add review' page
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
