const express = require('express');
const router = express.Router();
const twitterSearch = require('../services/twitterSearch.service');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});


// req.body.search is the search the user performs
// twitterSearch goes, grabs the tweets with that param, 
// sentiment analyzes them
// and returns an array of objects which look like this:
// {
//   "text": "I hate puppies",
//   "created_at": "Sat Feb 04 21:39:56 +0000 2017",
//   "sentiment": {
//     "score": -2,
//     "comparative": -0.2222222222222222,
//     "positive": {
//       "score": 0,
//       "comparative": 0,
//       "words": []
//     },
//     "negative": {
//       "score": 2,
//       "comparative": 0.2222222222222222,
//       "words": [
//         "hate"
//       ]
//     }
//   }
// }
router.get('/search', function(req, res, next) {
  twitterSearch(req.body.search, function(data) {
    res.json(data);
  });
});

module.exports = router;
