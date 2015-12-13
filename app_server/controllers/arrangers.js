//controllers/arrangers/js
// GET 'home' page
module.exports.homelist = function(req, res) {
  res.render('arrangers-list', {
    title: 'RrangR - find YOUR arranger',
    pageHeader: {
      title: 'RrangR',
      strapline: 'Find the perfect arranger for your needs'
    },
    sidebar: "Looking for a music arranger for your band? Need someone to arrange material for the studio? rrangr is the place for you!",
    arrangers: [{
      name: 'Billy Strayhorn',
      email: 'billy@strayhorn.com',
      rating: 5,
      experience: '70 yrs',
      specialties: ['Orchestral', 'Chamber Ensembles', 'Bluegrass']
    },{
      name: 'Hank Levy',
      email: 'hank@levy.com',
      rating: 11,
      experience: '50 yrs',
      specialties: ['Big Band', 'Odd Meters']
    },{
      name: 'Ray Conniff',
      email: 'ray@conniff.com',
      rating: 4,
      experience: '60 yrs',
      specialties: ['Big Band', 'Swing', 'Jump Blues']
    }]
  });
};


// GET 'arranger info' page
module.exports.arrangerInfo = function(req, res) {
  res.render('arranger-info', {
    title: 'Arranger Info',
    pageHeader: {title: 'Billy Strayhorn'},
    sidebar: 'Please leave a review',
    arranger: {
      name: 'Billy Strayhorn',
      email: 'billy@strayhorn.com',
      rating: 5,
      specialties: ['Orchestral', 'Chamber Ensembles', 'Bluegrass']
    },
    reviews: [{
      author: 'Trevor Specht',
      rating: 5,
      timestamp: '10 Dec 2015',
      reviewText: 'What can I say, he\'s a legend'
    },{
      author: 'Gertrude',
      rating: 0,
      timestamp: '2 Jan 1944',
      reviewText: 'Never heard of him'
    }]
  });
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
