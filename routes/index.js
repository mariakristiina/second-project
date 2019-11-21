const express = require('express');
const router = express.Router();
const Truck = require("../models/Truck");
const Location = require("../models/Location");
const User = require("../models/User");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index', {
    user: req.user,
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
    hours,
    image
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
      image: image,
    })
    .then(() => {
      res.redirect("/truckprofile");
    })
    .catch(err => {
      console.log(err);
    })
});


router.get("/:id/truck", (req, res) => {
  const truckId = req.params.id;
  if (req.user) {

    Truck.findById(req.params.id)
      .then(truck => {
        res.render("auth/truck", {
          truck: truck,
          loggedIn: req.user,
          userIsOwner: req.user._id.toString() === truck.owner.toString(),
          notOwner: req.user._id.toString() !== truck.owner.toString(),
          like: req.user.likes.includes(truckId),
          notLiked: !req.user.likes.includes(truckId),
        })
      });
  } else {
    Truck.findById(req.params.id)
      .then(truck => {
        res.render("auth/truck", {
          truck: truck
        })
      });
  }
});

router.get("/:id/truck/delete", (req, res) => {
  const query = req.params.id
  Truck.findByIdAndDelete(query)
    .then(() => {
      res.redirect("/truckprofile");
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
  const location = [parseFloat(req.body.lng), parseFloat(req.body.lat)];
  Truck.updateOne({
      _id: req.params.id
    }, {
      name: req.body.name,
      description: req.body.description,
      menu: req.body.menu,
      hours: req.body.hours,
      locations: location
    })
    .then(truck => {
      res.redirect("/" + req.params.id + "/truck");
    })
    .catch(err => {
      console.log(err);
    })
});




router.get("/userprofile", loginCheck(), (req, res, next) => {
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
});

router.get("/truckProfile", (req, res, next) => {
  Truck.find({
      owner: req.user._id
    })
    .then(trucks => {
      res.render("auth/truckprofile", {
        trucks: trucks,
        user: req.user
      })
    })
});



router.get("/api/getuserfavorites", (req, res, next) => {
  res.json(req.user);
});


router.get("/api/findtrucks", (req, res, next) => {
  Truck.find()
    .then(response => {
      res.json(response);
      // console.log('passed to hbs ',
      //   response.request.response);
    })
    .catch(err => {
      next(err);
    });
});


router.post("/like/:id", (req, res) => {
  const truck = req.params.id;

  if (req.user.likes.includes(truck)) {
    User.updateOne({
        _id: req.user.id
      }, {
        $pull: {
          likes: truck
        }
      })
      .then(updatedTruck => console.log(updatedTruck));
    res.redirect("/" + req.params.id + "/truck");
  } else {

    User.updateOne({
        _id: req.user.id
      }, {
        $push: {
          likes: truck
        }
      })
      .then(updatedUser => console.log(updatedUser));
    res.redirect("/" + req.params.id + "/truck");
  }
});

// SEARCHBAR

// router.post('/api/searchtrucks', (res, req, next) => {
//   const searchText = res.body.searchbar;
//   console.log('this is the search text ', searchText);
//   Truck.find({
//     name: searchText
//   }).then(truck => {
//     console.log('found truck: ', truck);
//     res.json(truck);
//     // res.redirect('/');
//   })
// });

router.get('/api/:searchtext', (req, res, next) => {
  const searchText = req.params.searchtext;
  console.log("backend", searchText);

  if (req.user) {
    Truck.find({
        name: searchText
      })
      .then(response => {
        User.findById(req.user._id).then(user => {
          const favoriteSearchedTrucks = response.filter(truck => {
            if (user.likes.includes(truck._id)) {
              return true;
            }
            return false;
          })
          const nonfavoriteSearchedTrucks = response.filter(truck => {
            if (user.likes.includes(truck._id)) {
              return false;
            }
            return true;
          })
          return [favoriteSearchedTrucks, nonfavoriteSearchedTrucks];
        }).then(newarray => {
          console.log('backend result', response)
          res.json(newarray);

        })
      })
  } else {
    Truck.find({
      name: searchText
    }).then(response => {
      console.log('backend result', response)
      res.json(response);
    })
  }
});


module.exports = router;