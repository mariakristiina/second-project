const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");


// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const loginCheck = () => {
  return (req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.redirect("/auth/login");
    }
  }
}

router.get("/login", (req, res, next) => {
  res.render("auth/login", {
    "message": req.flash("error")
  });
});


router.get("/userprofile", (req, res, next) => {
  if (req.user.truck === "YES") {
    res.render("auth/truckprofile", {
      user: req.user
    });
  } else {
    res.render("auth/userprofile", {
      user: req.user,
      truck: req.truck
    });
  }
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/auth/userprofile",
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
      .then(() => {
        req.session.user = newUser;
        console.log(req.session);
        if (req.body.truck === "YES") {
          res.redirect("/auth/add-a-truck");
        } else {
          res.redirect("/auth/userprofile");
        }
      })
      .catch(err => {
        res.render("auth/signup", {
          message: "Something went wrong"
        });
      })
  });
});








router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});


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

router.get("/add-a-truck", (req, res, next) => {
  res.render("../views/auth/add-a-truck");

});

router.post("/add-a-truck", (req, res, next) => {
  console.log(req.body);
  const {
    name,
    description,
    cuisine,
    tags,
    menu,
    hours
  } = req.body;
  console.log(req.user)
  const owner = req.user._id;
  // const location = marker.getLngLat();
  Truck.create({
      name,
      description,
      cuisine,
      tags,
      location,
      owner,
      menu,
      hours
    })
    .then(() => {
      res.redirect("/")
    })
    .catch(err => {
      console.log(err);
    })
});

router.get("/truckProfile", (req, res, next) => {
  res.render("/auth/truckProfile", {
    message: "your truck has been added!"
  })
});

router.get("/edit-truck", loginCheck(), (req, res) => {
  res.render("auth/edit-truck", {
    user: req.user
  });
})

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/", {truck: req.truck});
});

module.exports = router;