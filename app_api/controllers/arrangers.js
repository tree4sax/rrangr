var mongoose = require('mongoose');
var Arr = mongoose.model('Arranger');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.arrangersCreate = function(req, res) {
  Arr.create({
    name: req.body.name,
    emailAddress: req.body.emailAddress,
    specialties: req.body.specialties.split(",")
  }, function(err, arranger) {
    if (err) {
      sendJSONresponse(res, 400, err);
    } else {
      sendJSONresponse(res, 201, arranger);
    }
  });
};
module.exports.arrangersList = function(req, res) {
  console.log('Display arrangers list', req.params);
  if (req.params) {
    Arr
      .find(req.params.arrangers)
      .exec(function(err, arranger) {
        if (!arranger) {
          sendJSONresponse(res, 404, {
            "message": "no arrangers found"
          });
          return;
        } else if (err) {
          console.log(err);
          sendJSONresponse(res, 404, err);
          return;
        }
        console.log(arranger);
        sendJSONresponse(res, 200, arranger);
      });
  } else {
    console.log('No arranger list specified');
    sendJSONresponse(res, 404, {
      "message": "No arranger list in request"
    });
  }
};
module.exports.arrangersReadOne = function(req, res) {
  console.log('Finding arranger details', req.params);
  if (req.params && req.params.arrangerid) {
    Arr
      .findById(req.params.arrangerid)
      .exec(function(err, arranger) {
        if (!arranger) {
          sendJSONresponse(res, 404, {
            "message": "arrangerid not found"
          });
          return;
        } else if (err) {
          console.log(err);
          sendJSONresponse(res, 404, err);
          return;
        }
        console.log(arranger);
        sendJSONresponse(res, 200, arranger);
      });
  } else {
    console.log('No arrangerid specified');
    sendJSONresponse(res, 404, {
      "message": "No arrangerid in request"
    });
  }
};
module.exports.arrangersUpdateOne = function(req, res) {
  if (!req.params.arrangerid) {
    sendJSONresponse(res, 404, {
      "message": "Not found, arrangerid is required"
    });
    return;
  }
  Arr
    .findById(req.params.arrangerid)
    .select('-reviews -rating')
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
        arranger.name = req.body.name;
        arranger.emailAddress = req.body.emailAddress;
        arranger.specialties = req.body.specialties.split(",");
        arranger.save(function(err, arranger) {
          if (err) {
            sendJSONresponse(res, 404, err);
          } else {
            sendJSONresponse(res, 200, arranger);
          }
        });
      }
    )
};
module.exports.arrangersDeleteOne = function(req, res) {
  var arrangerid = req.params.arrangerid;
  if (arrangerid) {
    Arr
      .findByIdAndRemove(arrangerid)
      .exec(
        function(err, arranger) {
          if (err) {
            console.log(err);
            sendJSONresponse(res, 404, err);
            return;
          }
          console.log("Arranger id " + arrangerid + " deleted");
          sendJSONresponse(res, 204, null);
        }
      )
  } else {
    sendJSONresponse(res, 404, {
      "message": "No arrangerid"
    });
  }
};
