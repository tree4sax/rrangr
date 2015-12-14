var mongoose = require('mongoose');
var Arr = mongoose.model('Arranger');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.reviewsCreate = function(req, res) {
  var arrangerid = req.params.arrangerid;
  if (arrangerid) {
    Arr
      .findById(arrangerid)
      .select('reviews')
      .exec(
        function(err, arranger) {
          if (err) {
            sendJSONresponse(res, 400, err);
          } else {
            doAddReview(req, res, arranger);
          }
        }
      )
  } else {
    sendJSONresponse(res, 404, {
      "message": "Not found, arrangerid required"
    });
  }
};

var doAddReview = function(req, res, arranger) {
  if (!arranger) {
    sendJSONresponse(res, 404, "arrangerid not found");
  } else {
    arranger.reviews.push({
      author: req.body.author,
      rating: req.body.rating,
      reviewText: req.body.reviewText
    });
    arranger.save(function(err, arranger) {
      var thisReview;
      if (err) {
        sendJSONresponse(res, 400, err);
      } else {
        updateAverageRating(arranger._id);
        thisReview = arranger.reviews[arranger.reviews.length - 1];
        sendJSONresponse(res, 201, thisReview);
      }
    });
  }
};

var updateAverageRating = function(arrangerid) {
  console.log("Update rating average for", arrangerid);
  Arr
    .findById(arrangerid)
    .select('reviews')
    .exec(
      function(err, arranger) {
        if (!err) {
          doSetAverageRating(arranger);
        }
      });
};

var doSetAverageRating = function(arranger) {
  var i, reviewCount, ratingAverage, ratingTotal;
  if (arranger.reviews && arranger.reviews.length > 0) {
    reviewCount = arranger.reviews.length;
    ratingTotal = 0;
    for (i = 0; i < reviewCount; i++) {
      ratingTotal = ratingTotal + arranger.reviews[i].rating;
    }
    ratingAverage = parseInt(ratingTotal / reviewCount, 10);
    arranger.rating = ratingAverage;
    arranger.save(function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Average rating updated to", ratingAverage);
      }
    });
  }
};

module.exports.reviewsReadOne = function(req, res) {
  console.log("Getting single review");
  if (req.params && req.params.arrangerid && req.params.reviewid) {
    Arr
      .findById(req.params.arrangerid)
      .select('name reviews')
      .exec(
        function(err, arranger) {
          console.log(arranger);
          var response, review;
          if (!arranger) {
            sendJSONresponse(res, 404, {
              "message": "arrangerid not found"
            });
            return;
          } else if (err) {
            sendJSONresponse(res, 400, err);
            return;
          }
          if (arranger.reviews && arranger.reviews.length > 0) {
            review = arranger.reviews.id(req.params.reviewid);
            if (!review) {
              sendJSONresponse(res, 404, {
                "message": "reviewid not found"
              });
            } else {
              response = {
                arranger: {
                  name: arranger.name,
                  id: req.params.arrangerid
                },
                review: review
              };
              sendJSONresponse(res, 200, response);
            }
          } else {
            sendJSONresponse(res, 404, {
              "message": "No reviews found"
            });
          }
        }
    );
  } else {
    sendJSONresponse(res, 404, {
      "message": "Not found, arrangerid and reviewid are both required"
    });
  }
};

module.exports.reviewsUpdateOne = function(req, res) {
  if (!req.params.arrangerid || !req.params.reviewid) {
    sendJSONresponse(res, 404, {
      "message": "Not found, arrangerid and reviewid are both required"
    });
    return;
  }
  Arr
    .findById(req.params.arrangerid)
    .select('reviews')
    .exec(
      function(err, arranger) {
        var thisReview;
        if (!arranger) {
          sendJSONresponse(res, 404, {
            "message": "arrangerid not found"
          });
          return;
        } else if (err) {
          sendJSONresponse(res, 400, err);
          return;
        }
        if (arranger.reviews && arranger.reviews.length > 0) {
          thisReview = arranger.reviews.id(req.params.reviewid);
          if (!thisReview) {
            sendJSONresponse(res, 404, {
              "message": "reviewid not found"
            });
          } else {
            thisReview.author = req.body.author;
            thisReview.rating = req.body.rating;
            thisReview.reviewText = req.body.reviewText;
            arranger.save(function(err, arranger) {
              if (err) {
                sendJSONresponse(res, 404, err);
              } else {
                updateAverageRating(arranger._id);
                sendJSONresponse(res, 200, thisReview);
              }
            });
          }
        } else {
          sendJSONresponse(res, 404, {
            "message": "No review to update"
          });
        }
      }
  );
};

module.exports.reviewsDeleteOne = function(req, res) {
  if (!req.params.arrangerid || !req.params.reviewid) {
    sendJSONresponse(res, 404, {
      "message": "Not found, arrangerid and reviewid are both required"
    });
    return;
  }
  Arr
    .findById(req.params.arrangerid)
    .select('reviews')
    .exec(
      function(err, arranger) {
        if (!arranger) {
          sendJSONresponse(res, 404, {
            "message": "arrangerid not found"
          });
          return;
        } else if (err) {
          sendJSONresponse(res, 400, err);
          return;
        }
        if (arranger.reviews && arranger.reviews.length > 0) {
          if (!arranger.reviews.id(req.params.reviewid)) {
            sendJSONresponse(res, 404, {
              "message": "reviewid not found"
            });
          } else {
            arranger.reviews.id(req.params.reviewid).remove();
            arranger.save(function(err) {
              if (err) {
                sendJSONresponse(res, 404, err);
              } else {
                updateAverageRating(arranger._id);
                sendJSONresponse(res, 204, null);
              }
            });
          }
        } else {
          sendJSONresponse(res, 404, {
            "message": "No review to delete"
          });
        }
      }
  );
};
