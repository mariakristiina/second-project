const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const Truck = require("../models/Truck");
const Location = require("../models/Location");



// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const loginCheck = () => {

  return (req, res, next) => {

    if (req.user) {
      next();
      console.log("successful login check")
    } else {
      console.log(req.body)
      res.redirect("/auth/login");
    }
  }
}

router.get("/login", (req, res, next) => {
  res.render("auth/login", {
    user: req.user,
    message: req.flash("error")
  });
});


router.get("/userprofile", loginCheck(), (req, res, next) => {
  if (req.user.truck === "YES") {
    Truck.find( {owner: req.user._id} )
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
  Truck.find( {owner: req.user._id} )
  .then(trucks => {
    res.render("auth/truckProfile", {trucks: trucks, user: req.user})
  })
  });



router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true,
}));

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const truck = req.body.truck;
  if (!username) {
    res.render("auth/signup", {
      message: "Please insert a username"
    });
    return;
  }
  if (password < 8) {
    res.render("auth/signup", {
      message: "Password is too short"
    });
    return;
  }

  User.findOne({
    username
  }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", {
        message: "The username already exists"
      });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      truck

    })

    newUser.save()
      .then(newUser => {

        req.login(newUser,err=>{
          if(err)next(err);
        else {
        if (req.user.truck === "YES") {
          res.redirect("/auth/add-a-truck");
        } else {
          res.redirect("/auth/userprofile");
        }
      }
      })
      .catch(err => {
        res.render("auth/signup", {
          message: "Something went wrong"
        });
      })
  });
})
});






router.get("/add-a-truck", loginCheck(), (req, res, next) => {
  res.render("../views/auth/add-a-truck", {loggedIn: req.user});
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
      res.redirect("/auth/truckProfile");
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
    loggedIn: req.user
  })
  });
});

router.get("/:id/truck/delete", (req, res) => {
  const query = req.params.id
  Truck.findByIdAndDelete(query)
    .then(() => {
      res.redirect("/auth/login");
    })
    .catch(err => {
      console.log(err);
    })
});

router.get("/userprofile/:id/delete", (req, res) => {
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
    res.render("auth/edit-truck", {truck: truck,
      loggedIn: req.user});
  })
});

router.post("/:id/truck/edit", (req, res) => {
  Truck.updateOne({_id: req.params.id},
  {
    name: req.body.name,
    description: req.body.description,
    menu: req.body.menu,
    hours: req.body.hours
  })
  .then(truck => {
    res.redirect("/auth/" + req.params.id + "/truck");
  })
  .catch(err => {
    console.log(err);
  })
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;