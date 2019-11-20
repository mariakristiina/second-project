const express = require('express');
const router = express.Router();
const Truck = require("../models/Truck");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index', {
    loggedIn: req.user,
    loggedOut: !req.user,
  });
});
// })

router.get("/api/findtrucks", (req, res, next) => {
  Truck.find()
    .then(response => {
      // res.json(response.request.response)
      res.json(response);
      // console.log('passed to hbs ',
      //   response.request.response);
    })
    .catch(err => {
      next(err);
    });
});

// router.post("/api/findtrucks", (req, res, next) => {
//   Truck.find()
//     .then(truck => {
//       res.json(truck.location)
//     }).catch(err => {
//       next(err);
//     })
// });


module.exports = router;