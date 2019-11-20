const express = require('express');
const router = express.Router();
const Truck = require("../models/Truck");
const Location = require("../models/Location");
const User = require("../models/User");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index', {
    loggedIn: req.user,
    loggedOut: !req.user,
  });
});
// })

const loginCheck = () => {

  return (req, res, next) => {

    if (req.user) {
      console.log("REQ.USER ", req.user);
      console.log("REQ.SESSION ", req.session);
      next();
    } else {
      console.log(req.body)
      res.redirect("/auth/login");
    }
  }
}

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

//create a truck
router.get("/add-a-truck", loginCheck(), (req, res, next) => {
  res.render("../views/auth/add-a-truck", {
    loggedIn: req.user
  });
});

router.post("/add-a-truck", loginCheck(), (req, res, next) => {
  console.log(req.body);
  const {
    name,
    description,
    cuisine,
    tags,
    menu,
    hours
  } = req.body;

  const location = [parseFloat(req.body.lng), parseFloat(req.body.lat)];
  console.log(location);

  console.log(req.user)
  const owner = req.user._id;

  Truck.create({
      name: name,
      description: description,
      cuisine: cuisine,
      tags: tags,
      owner: owner,
      locations: location,
      menu: menu,
      hours: hours,
    })
    .then(() => {
      res.redirect("/truckProfile");
    })
    .catch(err => {
      console.log(err);
    })
});


router.get("/:id/truck", (req, res) => {
  Truck.findById(req.params.id)
    .then(truck => {
      res.render("auth/truck", {
        truck: truck,
        loggedIn: req.user,
        userIsOwner: req.user._id.toString() === truck.owner.toString()

      })
    });
});

router.get("/:id/truck/delete", (req, res) => {
  const query = req.params.id
  Truck.findByIdAndDelete(query)
    .then(() => {
      res.redirect("/userprofile");
    })
    .catch(err => {
      console.log(err);
    })
});

router.post("/userprofile/:id/delete", (req, res) => {
  const query = req.params.id
  User.findByIdAndDelete(query)
    .then(() => {
      res.redirect("/auth/login");
    })
    .catch(err => {
      console.log(err);
    })
});

router.get("/:id/truck/edit", (req, res) => {
  Truck.findById(req.params.id)
    .then(truck => {
      res.render("auth/edit-truck", {
        truck: truck,
        loggedIn: req.user
      });
    })
});

router.post("/:id/truck/edit", (req, res) => {
  Truck.updateOne({
      _id: req.params.id
    }, {
      name: req.body.name,
      description: req.body.description,
      menu: req.body.menu,
      hours: req.body.hours
    })
    .then(truck => {
      res.redirect("/" + req.params.id + "/truck");
    })
    .catch(err => {
      console.log(err);
    })
});



router.get("/userprofile", loginCheck(), (req, res, next) => {
  if (req.user.truck === "YES") {
    Truck.find({
        owner: req.user._id
      })
      .then(trucks => {
        res.render("auth/truckprofile", {
          user: req.user,
          trucks: trucks,
          loggedIn: req.user
        })
      });
  } else if (req.user.truck === "NO") {
    res.render("auth/userprofile", {
      user: req.user,
      loggedIn: req.user
    });
  }
});

router.get("/truckProfile", (req, res, next) => {
  Truck.find({
      owner: req.user._id
    })
    .then(trucks => {
      res.render("auth/truckProfile", {
        trucks: trucks,
        user: req.user
      })
    })
});


module.exports = router;