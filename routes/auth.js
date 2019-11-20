const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");




// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;



router.get("/login", (req, res, next) => {
  res.render("auth/login", {
    user: req.user,
    message: req.flash("error")
  });
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

        req.login(newUser, err => {
            if (err) next(err);
            else {
              if (req.user.truck) {
                res.redirect("/add-a-truck");
              } else {
                res.redirect("/");
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





router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;