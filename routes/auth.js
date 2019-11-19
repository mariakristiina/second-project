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

    if (req.session) {
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


router.get("/userprofile", (req, res, next) => {
  if (req.user.truck === "YES") {
    res.render("auth/truckprofile", {
      user: req.user,
      truck: req.truck
    });
  } else if (req.user.truck === "NO") {
    res.render("auth/userprofile", {
      user: req.user
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
      .then(newUser => {

        req.login(newUser,err=>{
          if(err)next(err);
        else {
        console.log(req.session);
        console.log("--------------", req.body.truck)
        if (req.user.truck === "YES") {
          res.redirect("/auth/add-a-truck");
        } else {
          res.redirect("/auth/userprofile");
        }
      }
      })
    })
      .catch(err => {
        res.render("auth/signup", {
          message: "Something went wrong"
        });
      })
  });
});


router.get("/add-a-truck", loginCheck(), (req, res, next) => {
  res.render("../views/auth/add-a-truck");
});


router.get("/truckProfile", (req, res, next) => {
  res.render("auth/truckProfile", {
    message: "your truck has been added!"
  })
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
  const location = [req.body.lng, req.body.lat];
  console.log(req.user)
  const owner = req.user._id;

  Truck.create({
      name,
      description,
      cuisine,
      tags,
      owner,
      location,
      menu,
      hours
    })
    .then(() => {
      res.redirect("/auth/truckProfile");
    })
    .catch(err => {
      console.log(err);
    })
});





router.get("/truck", (req, res) => {
  res.render("auth/truck", {
    truck: req.truck
  });
})

router.post("/truck/id/delete", (req, res) => {
  const query = {
    _id: req.params.id
  };
  Truck.deleteOne(query)
    .then(() => {
      res.redirect("/auth/truckprofile", {
        message: "Your truck was removed"
      });
    })
    .catch(err => {
      console.log(err);
    })
});

router.get("/edit-truck", loginCheck(), (req, res) => {
  res.render("auth/edit-truck", {
    user: req.user
  });
})

router.get("/userprofile/:id/delete", (req, res) => {

  const query = req.params.id
  console.log(req.params.id);
  User.findByIdAndDelete(query)
    .then(deletedUser => {

      res.redirect("/auth/login", {
      
      });
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